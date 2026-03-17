const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const GameScoreEvent = require('../models/GameScoreEvent');
const User = require('../models/User');
const requireAuth = require('../middleware/requireAuth');

// ---- Simple SSE "pubsub" for real-time leaderboard ----
const sseClients = new Set();

function sseSend(res, eventName, payload) {
  // SSE format: event + data + blank line
  res.write(`event: ${eventName}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

async function getLeaderboard(limit = 10) {
  const registeredIds = await User.find().select({ _id: 1 });
  const registeredIdStrings = registeredIds.map((u) => String(u._id));

  const leaderboard = await Game.find({ user: { $in: registeredIdStrings } })
    .sort({ score: -1, completedAt: 1 })
    .limit(limit);

  return leaderboard.map((record) => ({
    _id: record._id,
    player: record.displayName?.trim()
      ? record.displayName.trim()
      : `Player_${String(record.user).substring(0, 8)}`,
    user: record.user,
    score: record.score,
    game: record.game || 'Various',
    timestamp: record.completedAt,
    level: record.level || 'N/A',
    difficulty: record.difficulty || 'N/A',
  }));
}

async function getTrends({ top = 5, points = 20 } = {}) {
  const registeredIds = await User.find().select({ _id: 1 });
  const registeredIdStrings = registeredIds.map((u) => String(u._id));

  const topUsers = await Game.find({ user: { $in: registeredIdStrings } })
    .sort({ score: -1, completedAt: 1 })
    .limit(top)
    .select({ user: 1, displayName: 1, score: 1 });

  const users = topUsers.map((d) => d.user);
  if (users.length === 0) return { series: [] };

  const events = await GameScoreEvent.find({ user: { $in: users } })
    .sort({ createdAt: -1 })
    .limit(top * points)
    .select({ user: 1, score: 1, createdAt: 1, displayName: 1 });

  const byUser = new Map();
  for (const e of events) {
    if (!byUser.has(e.user)) byUser.set(e.user, []);
    if (byUser.get(e.user).length < points) {
      byUser.get(e.user).push({
        t: e.createdAt,
        score: e.score,
      });
    }
  }

  const series = users.map((user) => {
    const displayName =
      topUsers.find((u) => u.user === user)?.displayName?.trim() ||
      events.find((e) => e.user === user)?.displayName?.trim() ||
      `Player_${String(user).substring(0, 8)}`;

    const pts = (byUser.get(user) || []).reverse(); // oldest -> newest
    return { user, player: displayName, points: pts };
  });

  return { series };
}

async function broadcastLeaderboardUpdate() {
  if (sseClients.size === 0) return;

  try {
    // Send a larger snapshot so clients can locally filter (top 10/20/50 etc.)
    const [leaderboard, trends] = await Promise.all([getLeaderboard(50), getTrends({ top: 5, points: 20 })]);
    const payload = { leaderboard, trends, sentAt: new Date().toISOString() };
    for (const res of sseClients) {
      sseSend(res, 'leaderboard', payload);
    }
  } catch (e) {
    console.error('Failed to broadcast leaderboard update:', e);
  }
}

// Get all games
router.get('/games', async (req, res) => {
  // Mock data for games
  const mockGames = [
    { 
      id: 1,
      title: "Memory Match",
      description: "Match pairs of art-related items in this classic memory game",
      difficulty: "Easy to Hard",
      features: ["Multiple themes", "Timer", "Scoring"]
    },
    { 
      id: 2,
      title: "Color Mixing",
      description: "Mix RGB colors to match target colors and become a color master",
      difficulty: "Easy to Hard",
      features: ["Target matching", "Hints", "Time tracking"]
    },
    {
      id: 3,
      title: "Art History Quiz",
      description: "Test your knowledge of artists, movements, and masterpieces",
      difficulty: "Easy to Hard",
      features: ["Multiple difficulty levels", "Scoring", "Review answers"]
    }
  ];
  
  res.json(mockGames);
});

// Submit score (update if higher score for same user optional)
router.post('/submit', requireAuth, async (req, res) => {
    const { score, level = 'N/A', game = 'Various', difficulty = 'N/A' } = req.body;
    try {
        const userId = String(req.user._id);
        const numericScore = Number(score);
        const displayName = (req.user.name || '').trim();

        if (!userId || !Number.isFinite(numericScore)) {
          return res.status(400).json({ error: 'Invalid payload: numeric score is required' });
        }

        // Always append an event for graphs.
        await GameScoreEvent.create({
          user: userId,
          score: numericScore,
          level,
          game,
          difficulty,
          displayName,
        });

        // Keep "best score per user" in Game collection.
        const existing = await Game.findOne({ user: userId });
        if (!existing || existing.score < numericScore) {
          const best = await Game.findOneAndUpdate(
            { user: userId },
            {
              $set: {
                user: userId,
                score: numericScore,
                level,
                game,
                difficulty,
                displayName,
                completedAt: new Date(),
              },
            },
            { upsert: true, new: true }
          );

          // Push update to connected clients.
          broadcastLeaderboardUpdate();
          return res.json({ message: 'New best score saved', game: best });
        }

        // Not a new best, but still broadcast (activity + trends changed).
        broadcastLeaderboardUpdate();
        return res.json({ message: 'Score event recorded (not a new best)', game: existing });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get leaderboard from database
router.get('/leaderboard/db', async (req, res) => {
    try {
        const leaderboard = await Game.find()
            .sort({ score: -1, level: -1 })
            .limit(10);
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    res.json(await getLeaderboard(limit));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get time-series data for graphs (top users)
router.get('/leaderboard/trends', async (req, res) => {
  try {
    const top = Math.min(10, Math.max(1, Number(req.query.top) || 5));
    const points = Math.min(100, Math.max(5, Number(req.query.points) || 20));
    res.json(await getTrends({ top, points }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Real-time leaderboard stream (Server-Sent Events)
router.get('/leaderboard/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');

  // Helpful for some proxies.
  res.flushHeaders?.();

  // Initial "hello" + initial snapshot.
  sseSend(res, 'ready', { ok: true, t: new Date().toISOString() });
  try {
    const [leaderboard, trends] = await Promise.all([getLeaderboard(50), getTrends({ top: 5, points: 20 })]);
    sseSend(res, 'leaderboard', { leaderboard, trends, sentAt: new Date().toISOString() });
  } catch (e) {
    sseSend(res, 'error', { message: e.message });
  }

  // Keep-alive ping every 25s (avoids idle timeouts).
  const pingId = setInterval(() => {
    res.write(`event: ping\ndata: ${Date.now()}\n\n`);
  }, 25000);

  sseClients.add(res);

  req.on('close', () => {
    clearInterval(pingId);
    sseClients.delete(res);
  });
});

// ---------- DRAG & DROP AI GAME (Proxy to Python service) ----------
// Helper to proxy requests to the Python game API
const proxyToPythonGame = async (endpoint, method, body = null) => {
  const gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:5002';
  
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  // Note: we're using dynamic import for node-fetch as it's an ES module
  const { default: fetch } = await import('node-fetch');
  const response = await fetch(`${gameServiceUrl}${endpoint}`, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Python Game Service Error ${response.status}: ${errorText}`);
  }
  
  return await response.json();
};

router.post('/scene-creator/start', async (req, res) => {
  try {
    const data = await proxyToPythonGame('/start_game', 'POST', req.body);
    res.json(data);
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ error: 'Failed to start scene creator game', details: error.message });
  }
});

router.post('/scene-creator/choose_background/:gameId', async (req, res) => {
  try {
    const data = await proxyToPythonGame(`/choose_background/${req.params.gameId}`, 'POST', req.body);
    res.json(data);
  } catch (error) {
    console.error('Error choosing background:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/scene-creator/add_element/:gameId', async (req, res) => {
  try {
    const data = await proxyToPythonGame(`/add_element/${req.params.gameId}`, 'POST', req.body);
    res.json(data);
  } catch (error) {
    console.error('Error adding element:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/scene-creator/check_scene/:gameId', async (req, res) => {
  try {
    const data = await proxyToPythonGame(`/check_scene/${req.params.gameId}`, 'GET');
    res.json(data);
  } catch (error) {
    console.error('Error checking scene:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/scene-creator/get_suggestions/:gameId', async (req, res) => {
  try {
    const data = await proxyToPythonGame(`/get_suggestions/${req.params.gameId}`, 'GET');
    res.json(data);
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/scene-creator/adjust_difficulty/:gameId', async (req, res) => {
  try {
    const data = await proxyToPythonGame(`/adjust_difficulty/${req.params.gameId}`, 'POST');
    res.json(data);
  } catch (error) {
    console.error('Error adjusting difficulty:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Artwork = require('../models/Artwork');
const Blog = require('../models/Blog');
const LearningPath = require('../models/LearningPath');
const UserProgress = require('../models/UserProgress');
const User = require('../models/User');

function buildArtProfessorSystemPrompt() {
  return [
    "You are ArtVista Virtual Professor, a helpful assistant with deep expertise in art history, art techniques, visual analysis, and museum-level explanation.",
    "You can also answer general questions outside art when asked; be clear when something is outside your specialty.",
    "Be specific: define terms, give context, and include practical next steps or examples where appropriate.",
    "When the user asks for critique, be constructive and actionable.",
    "If you’re unsure or the question is ambiguous, ask 1-2 clarifying questions but still provide a best-effort answer.",
    "Keep answers well-structured with short sections or bullets when useful.",
    "If you are given WEB SOURCES, use them to answer up-to-date questions. Cite sources by listing 2-6 links under a 'Sources' section when relevant.",
    "Never fabricate citations or claim you browsed the web unless WEB SOURCES are provided.",
  ].join("\n");
}

function normalizeChatHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string')
    .map(m => ({ role: m.role, content: m.text }))
    .slice(-12);
}

function setSseHeaders(res) {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  // Some reverse proxies buffer by default; this hints not to.
  res.setHeader('X-Accel-Buffering', 'no');
}

function sseSend(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function parseProviderError(errText) {
  try {
    const json = JSON.parse(errText);
    const e = json?.error || json;
    return {
      message: e?.message || 'AI provider error',
      code: e?.code || e?.type || null,
      type: e?.type || null,
      raw: json,
    };
  } catch {
    return { message: errText || 'AI provider error', code: null, type: null, raw: null };
  }
}

function friendlyProviderHint(parsed) {
  const code = String(parsed?.code || '').toLowerCase();
  const type = String(parsed?.type || '').toLowerCase();
  if (code === 'insufficient_quota' || type === 'insufficient_quota') {
    return "Your OpenAI API key has no available quota/credits. Add billing or credits on your OpenAI account, then restart the backend.";
  }
  if (code === 'invalid_api_key' || type === 'invalid_request_error') {
    return "The OpenAI API key looks invalid or unauthorized. Re-check `OPENAI_API_KEY` in `artvista-backend/.env`, then restart the backend.";
  }
  return null;
}

function shouldUseWebSearch(userMessage) {
  const q = (userMessage || '').trim().toLowerCase();
  if (!q) return false;

  // Explicit user opt-in
  if (q.startsWith('/web ') || q.startsWith('web:') || q.includes('search the web')) return true;

  // "Real-time" indicators
  const realtimeSignals = [
    'today',
    'yesterday',
    'this week',
    'this month',
    'latest',
    'current',
    'right now',
    'news',
    'headline',
    'release date',
    'price',
    'stock',
    'score',
    'won',
    'election',
    'update',
    '2025',
    '2026',
  ];
  return realtimeSignals.some(s => q.includes(s));
}

async function tavilySearch(query, { maxResults = 5 } = {}) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return { ok: false, error: 'TAVILY_API_KEY not configured' };

  const r = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: 'basic',
      include_answer: false,
      include_raw_content: false,
      max_results: Math.max(1, Math.min(Number(maxResults) || 5, 10)),
    }),
  });

  if (!r.ok) {
    const errText = await r.text();
    return { ok: false, error: errText || `Tavily error (${r.status})` };
  }

  const data = await r.json();
  const results = Array.isArray(data?.results) ? data.results : [];
  const sources = results
    .map(it => ({
      title: it?.title || it?.url || 'Source',
      url: it?.url,
      snippet: it?.content || '',
    }))
    .filter(s => typeof s.url === 'string' && s.url.startsWith('http'))
    .slice(0, Math.max(1, Math.min(Number(maxResults) || 5, 10)));

  return { ok: true, sources };
}

function fallbackArtAnswer(message) {
  const q = (message || '').trim();
  if (!q) return "Ask me anything about art—an artist, movement, technique, or a specific artwork.";
  return [
    "I can help with that, but the AI provider isn’t configured on the server yet.",
    "",
    `Your question: "${q}"`,
    "",
    "Tell me one of these and I’ll tailor a stronger answer:",
    "- Are you learning art history, making art, or analyzing an artwork?",
    "- Any specific artist/movement/medium/time period you mean?",
  ].join("\n");
}

async function callOllamaChat({
  baseUrl,
  model,
  messages,
  temperature = 0.7,
  stream = false,
}) {
  const url = `${String(baseUrl || 'http://localhost:11434').replace(/\/$/, '')}/api/chat`;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream,
        options: {
          temperature,
        },
      }),
    });
    return r;
  } catch (e) {
    const msg = e?.message || String(e);
    const err = new Error(`Failed to reach Ollama at ${url}. ${msg}`);
    err.cause = e;
    throw err;
  }
}

// --- Art Chat (supports JSON or SSE streaming) ---
router.post('/chat', async (req, res) => {
  const { message, history } = req.body || {};
  const userMessage = typeof message === 'string' ? message.trim() : '';
  if (!userMessage) {
    return res.status(400).json({ error: 'message is required' });
  }

  const provider = (process.env.AI_CHAT_PROVIDER || '').trim().toLowerCase(); // 'ollama' | 'openai' | ''
  const apiKey = process.env.OPENAI_API_KEY || process.env.ARTVISTA_OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || process.env.ARTVISTA_OPENAI_MODEL || 'gpt-4o-mini';
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.1';
  const webEnabled = Boolean(process.env.TAVILY_API_KEY);
  const webMaxResults = process.env.TAVILY_MAX_RESULTS || 5;
  const wantsSse =
    (req.headers.accept || '').includes('text/event-stream') ||
    String(req.query.stream || '') === '1';

  const shouldUseOllama =
    provider === 'ollama' ||
    (!provider && !apiKey) ||
    (provider === 'auto' && !apiKey);
  const shouldUseOpenAI = provider === 'openai' || (!provider && Boolean(apiKey)) || provider === 'auto';

  let webSources = [];
  try {
    if (webEnabled && shouldUseWebSearch(userMessage)) {
      const web = await tavilySearch(userMessage.replace(/^\/web\s+/i, ''), { maxResults: webMaxResults });
      if (web.ok) webSources = web.sources || [];
    }
  } catch (e) {
    // Web search is best-effort; never fail the whole chat.
    webSources = [];
  }

  const webContextMessage = webSources.length
    ? [
        "WEB SOURCES (use for up-to-date facts; cite links when relevant):",
        ...webSources.map((s, i) => {
          const snippet = (s.snippet || '').replace(/\s+/g, ' ').trim();
          const shortSnippet = snippet.length > 280 ? `${snippet.slice(0, 277)}...` : snippet;
          return `${i + 1}. ${s.title}\nURL: ${s.url}\nSnippet: ${shortSnippet}`;
        }),
      ].join("\n\n")
    : null;

  const messages = [
    { role: 'system', content: buildArtProfessorSystemPrompt() },
    ...(webContextMessage ? [{ role: 'system', content: webContextMessage }] : []),
    ...normalizeChatHistory(history),
    { role: 'user', content: userMessage },
  ];

  const openaiUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions';

  try {
    // --- OLLAMA (local, free) ---
    if (shouldUseOllama) {
      if (!ollamaModel) {
        const text = "Local AI (Ollama) is selected but OLLAMA_MODEL is not set.";
        if (wantsSse) {
          setSseHeaders(res);
          sseSend(res, { type: 'delta', text });
          sseSend(res, { type: 'done' });
          return res.end();
        }
        return res.status(500).json({ error: text });
      }

      if (!wantsSse) {
        let r;
        try {
          r = await callOllamaChat({
            baseUrl: ollamaBaseUrl,
            model: ollamaModel,
            messages,
            temperature: 0.7,
            stream: false,
          });
        } catch (e) {
          return res.status(502).json({
            error: 'Local AI (Ollama) unreachable',
            details: e.message,
            hint: 'Start Ollama, then pull the model: `ollama pull llama3.1`. Ollama must be running at http://localhost:11434.',
          });
        }

        if (!r.ok) {
          const errText = await r.text();
          return res.status(502).json({
            error: 'Local AI (Ollama) error',
            details: errText,
            hint: 'Make sure Ollama is installed and running, and the model is pulled (e.g. `ollama pull llama3.1`).',
          });
        }

        const data = await r.json();
        const text = data?.message?.content || "I'm sorry — I couldn't generate a response.";
        return res.json({
          response: text,
          provider: 'ollama',
          model: ollamaModel,
          web: { enabled: webEnabled, used: webSources.length > 0, sources: webSources },
        });
      }

      // Streaming via Ollama (JSONL)
      setSseHeaders(res);
      sseSend(res, { type: 'meta', provider: 'ollama', model: ollamaModel, web: { enabled: webEnabled, used: webSources.length > 0, sources: webSources } });

      let r;
      try {
        r = await callOllamaChat({
          baseUrl: ollamaBaseUrl,
          model: ollamaModel,
          messages,
          temperature: 0.7,
          stream: true,
        });
      } catch (e) {
        sseSend(res, {
          type: 'error',
          message: 'Local AI (Ollama) unreachable',
          hint: 'Start Ollama, then pull the model: `ollama pull llama3.1`. Ollama must be running at http://localhost:11434.',
          details: e.message,
        });
        sseSend(res, { type: 'done' });
        return res.end();
      }

      if (!r.ok || !r.body) {
        const errText = await r.text();
        sseSend(res, {
          type: 'error',
          message: 'Local AI (Ollama) error',
          hint: 'Make sure Ollama is installed and running, and the model is pulled (e.g. `ollama pull llama3.1`).',
          details: errText,
        });
        sseSend(res, { type: 'done' });
        return res.end();
      }

      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      for await (const chunk of r.body) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const json = JSON.parse(trimmed);
            const delta = json?.message?.content || '';
            if (delta) sseSend(res, { type: 'delta', text: delta });
            if (json?.done) {
              sseSend(res, { type: 'done' });
              return res.end();
            }
          } catch {
            // ignore malformed lines
          }
        }
      }

      sseSend(res, { type: 'done' });
      return res.end();
    }

    // --- OPENAI (paid key) ---
    if (!shouldUseOpenAI || !apiKey) {
      const text = fallbackArtAnswer(userMessage);
      if (wantsSse) {
        setSseHeaders(res);
        sseSend(res, { type: 'delta', text });
        sseSend(res, { type: 'done' });
        return res.end();
      }
      return res.json({ response: text, provider: 'fallback' });
    }

    if (!wantsSse) {
      const r = await fetch(openaiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
        }),
      });

      if (!r.ok) {
        const errText = await r.text();
        const parsed = parseProviderError(errText);
        const hint = friendlyProviderHint(parsed);
        return res.status(502).json({ error: 'AI provider error', details: parsed?.message || errText, code: parsed?.code || parsed?.type, hint });
      }

      const data = await r.json();
      const text = data?.choices?.[0]?.message?.content || "I'm sorry — I couldn't generate a response.";
      return res.json({ response: text, provider: 'openai', model, web: { enabled: webEnabled, used: webSources.length > 0, sources: webSources } });
    }

    // Streaming (SSE) via OpenAI-compatible stream format
    setSseHeaders(res);
    sseSend(res, { type: 'meta', provider: 'openai', model, web: { enabled: webEnabled, used: webSources.length > 0, sources: webSources } });

    const r = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!r.ok || !r.body) {
      const errText = await r.text();
      const parsed = parseProviderError(errText);
      const hint = friendlyProviderHint(parsed);
      sseSend(res, { type: 'error', message: parsed?.message || 'AI provider error', code: parsed?.code || parsed?.type, hint });
      sseSend(res, { type: 'done' });
      return res.end();
    }

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    for await (const chunk of r.body) {
      buffer += decoder.decode(chunk, { stream: true });

      // OpenAI streams as "data: {...}\n\n"
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || '';

      for (const part of parts) {
        const line = part.split('\n').find(l => l.startsWith('data: '));
        if (!line) continue;
        const data = line.slice('data: '.length).trim();
        if (!data) continue;
        if (data === '[DONE]') {
          sseSend(res, { type: 'done' });
          return res.end();
        }

        try {
          const json = JSON.parse(data);
          const delta =
            json?.choices?.[0]?.delta?.content ??
            json?.choices?.[0]?.delta?.text ??
            '';
          if (delta) sseSend(res, { type: 'delta', text: delta });
        } catch {
          // ignore malformed chunks
        }
      }
    }

    sseSend(res, { type: 'done' });
    return res.end();
  } catch (error) {
    console.error('Error in /api/ai/chat:', error);
    if (wantsSse) {
      setSseHeaders(res);
      sseSend(res, { type: 'error', message: error.message || 'Unknown error' });
      sseSend(res, { type: 'done' });
      return res.end();
    }
    return res.status(500).json({ error: 'Failed to generate chat response', details: error.message });
  }
});

// SMART RECOMMENDATIONS - Real-time data from your website
router.get('/smart-suggestions/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Fetch all real data from website
    const [allArtworks, allBlogs, allLearningPaths, userProgressList, userData] = await Promise.all([
      Artwork.find().limit(20),
      Blog.find().limit(10),
      LearningPath.find(),
      UserProgress.find({ userId }),
      User.findById(userId)
    ]);

    // Get user's favorites
    const userFavorites = userData?.favoriteArtworks?.map(id => id.toString()) || [];

    // Build learning recommendations
    const completedPathIds = userProgressList
      .filter(p => p.progress === 100)
      .map(p => p.learningPathId.toString());
    
    const inProgressPaths = userProgressList
      .filter(p => p.progress > 0 && p.progress < 100)
      .map(p => ({ ...p.toObject(), pathId: p.learningPathId.toString() }));

    const recommendedLearningPaths = allLearningPaths
      .filter(path => !completedPathIds.includes(path._id.toString()))
      .map(path => {
        const inProgress = inProgressPaths.find(ip => ip.pathId === path._id.toString());
        return {
          title: path.title,
          description: path.description,
          category: path.category,
          difficulty: path.difficulty,
          duration: path.duration,
          progress: inProgress?.progress || 0,
          status: inProgress ? 'continue' : 'start', // 'start' = new, 'continue' = in progress
          completedModules: inProgress?.completedModules?.length || 0,
          totalModules: path.modules?.length || 0,
          type: 'learning_path'
        };
      })
      .sort((a, b) => {
        // Sort: in-progress first, then by difficulty
        if (a.progress > 0) return -1;
        if (b.progress > 0) return 1;
        const diffOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
        return diffOrder[a.difficulty] - diffOrder[b.difficulty];
      });

    // Build artwork recommendations - real from gallery
    const artworksNotInFavorites = allArtworks.filter(a => 
      !userFavorites.includes(a._id.toString())
    );
    
    const recommendedArtworks = artworksNotInFavorites
      .slice(0, 5)
      .map(art => ({
        _id: art._id,
        title: art.title,
        artist: art.artist || 'Unknown',
        imageUrl: art.imageUrl,
        category: art.category,
        description: art.description,
        likes: art.likes || 0,
        type: 'artwork'
      }));

    // Build tutorial recommendations - from blogs matching current learning
    const recommendedTutorials = allBlogs
      .slice(0, 4)
      .map(blog => ({
        id: blog._id,
        title: blog.title,
        description: blog.content?.substring(0, 100) || 'Recommended tutorial',
        type: 'blog'
      }));

    // Build "next steps" message based on progress
    let nextStepsMessage = '';
    if (inProgressPaths.length > 0) {
      const highestProgress = inProgressPaths[0];
      const pathName = allLearningPaths.find(p => p._id.toString() === highestProgress.pathId)?.title || 'Your current path';
      nextStepsMessage = `Continue with ${pathName} - ${highestProgress.progress}% complete`;
    } else if (recommendedLearningPaths.length > 0) {
      nextStepsMessage = `Get started with ${recommendedLearningPaths[0].title}`;
    }

    res.json({
      success: true,
      userId,
      message: nextStepsMessage,
      stats: {
        completedLearningPaths: completedPathIds.length,
        inProgressLearningPaths: inProgressPaths.length,
        totalFavorites: userFavorites.length,
        availableArtworks: allArtworks.length,
        availableBlogs: allBlogs.length
      },
      recommendations: {
        learningPaths: recommendedLearningPaths,
        artworks: recommendedArtworks,
        tutorials: recommendedTutorials
      }
    });

  } catch (error) {
    console.error('Error in smart suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch smart suggestions', details: error.message });
  }
});

// Get AI suggestions for a user
router.get('/suggestions/:userId', async (req, res) => {
  try {
    const userIdParam = req.params.userId;
    let userId;
    
    // Handle both numeric IDs and string IDs (like MongoDB ObjectIds)
    // For our dataset, we expect numeric IDs (1, 2), but for real user accounts we might need to map
    if (/^\d+$/.test(userIdParam)) {
      // It's a numeric string, convert to integer
      userId = parseInt(userIdParam);
    } else {
      // It's likely a MongoDB ObjectId string
      // For demo purposes, we'll cycle through available user IDs based on ObjectId hash
      // This ensures different users get different recommendations
      if (/^[0-9a-fA-F]{24}$/.test(userIdParam)) {
        // Use the last few characters of the ObjectId to determine user ID
        const hash = userIdParam.slice(-2); // Last 2 characters
        const numericHash = parseInt(hash, 16); // Convert hex to decimal
        userId = (numericHash % 2) + 1; // Map to 1 or 2 (our available user IDs)
      } else {
        return res.status(400).json({ error: 'Invalid user ID format' });
      }
    }
    
    // Ensure userId is within our dataset range (1-2)
    if (userId < 1 || userId > 2) {
      userId = 1; // Default to user 1
    }
    
    console.log(`Mapping user ${userIdParam} to dataset user ${userId}`);
    
    // Import fetch dynamically
    const { default: fetch } = await import('node-fetch');
    
    // Call the Python AI service
    const aiServiceUrl = (process.env.AI_SUGGESTIONS_URL || 'http://localhost:5001').replace(/\/$/, '');
    const targetUrl = `${aiServiceUrl}/adaptive_suggest?user_id=${userId}`;
    console.log(`Calling Python AI service: ${targetUrl}`);
    
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI service returned error ${response.status}: ${errorText}`);
      return res.status(500).json({ error: 'AI service communication failed' });
    }
    
    const suggestions = await response.json();
    console.log('Received suggestions from Python:', JSON.stringify(suggestions).slice(0, 500));
    
    // Wrap the response in the format the frontend expects
    const result = {
      success: true,
      userIdParam,
      recommendations: {
        artworks: suggestions.artworks || [],
        tutorials: suggestions.tutorials || [],
        learningPaths: [] 
      },
      message: suggestions.message || "AI recommendations generated just for you",
      stats: {
        totalArtworks: (suggestions.artworks || []).length,
        totalTutorials: (suggestions.tutorials || []).length
      }
    };
    
    console.log('Sending normalized data to frontend:', JSON.stringify(result).slice(0, 500));
    res.json(result);
  } catch (error) {
    console.error('Error in AI suggestions route:', error);
    res.status(500).json({ error: 'Failed to fetch AI suggestions' });
  }
});

// Track user interaction with artwork
router.post('/interaction/artwork', (req, res) => {
  try {
    const { userId, artworkId, interactionType } = req.body;
    
    // In a real implementation, this would update the user's interaction history
    // updateInteractionHistory(userId, artworkId, interactionType);
    
    res.json({ success: true, message: 'Interaction recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record interaction' });
  }
});

// Track user interaction with tutorial
router.post('/interaction/tutorial', (req, res) => {
  try {
    const { userId, tutorialId, interactionType } = req.body;
    
    // In a real implementation, this would update the user's interaction history
    // updateTutorialInteractionHistory(userId, tutorialId, interactionType);
    
    res.json({ success: true, message: 'Tutorial interaction recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record tutorial interaction' });
  }
});

// Get AI-powered art creation suggestions
router.get('/art-creation/:userId', async (req, res) => {
  try {
    const userIdParam = req.params.userId;
    let userId;

    // Accept numeric IDs or MongoDB ObjectId strings and map to demo dataset IDs
    if (/^\d+$/.test(userIdParam)) {
      userId = parseInt(userIdParam);
    } else if (/^[0-9a-fA-F]{24}$/.test(userIdParam)) {
      const hash = userIdParam.slice(-2);
      const numericHash = parseInt(hash, 16);
      userId = (numericHash % 2) + 1; // map into available demo IDs (1 or 2)
    } else {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    if (userId < 1 || userId > 2) userId = 1;

    console.log(`Mapping user ${userIdParam} to dataset user ${userId} for art-creation`);

    // Import fetch dynamically
    const { default: fetch } = await import('node-fetch');

    // Call the Python AI service
    const aiServiceUrl = process.env.AI_SUGGESTIONS_URL || 'http://localhost:5001';
    const response = await fetch(`${aiServiceUrl}/art_creation_suggestions/${userId}`);

    if (!response.ok) {
      console.error(`AI art-creation service error: ${response.status} - ${await response.text()}`);
      return res.status(500).json({ error: 'Failed to fetch art creation suggestions from Python service' });
    }

    const suggestions = await response.json();
    res.json(suggestions);
  } catch (error) {
    console.error('Error in AI art-creation route:', error);
    res.status(500).json({ error: 'Failed to generate art creation suggestions' });
  }
});

module.exports = router;
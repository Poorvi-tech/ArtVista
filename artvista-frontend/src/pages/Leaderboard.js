import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import "./Leaderboard.css";

const medal = (idx) => (idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`);

const badgeLabel = (idx) => {
  if (idx === 0) return "Champion";
  if (idx === 1) return "Runner-up";
  if (idx === 2) return "Top 3";
  return "Competitor";
};

const formatShortTime = (isoOrDate) => {
  try {
    return new Date(isoOrDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

function pivotTrendsToChartData(trends) {
  // trends: { series: [{ player, user, points: [{t, score}]}] }
  const series = trends?.series || [];
  const allTs = new Set();
  for (const s of series) {
    for (const p of s.points || []) allTs.add(new Date(p.t).toISOString());
  }
  const tsList = Array.from(allTs).sort();
  const data = tsList.map((t) => ({ t }));

  const byT = new Map(tsList.map((t, i) => [t, i]));
  for (const s of series) {
    const key = s.player || `Player_${String(s.user).substring(0, 8)}`;
    for (const p of s.points || []) {
      const t = new Date(p.t).toISOString();
      const idx = byT.get(t);
      if (idx !== undefined) data[idx][key] = p.score;
    }
  }

  return { data, lineKeys: series.map((s) => s.player || `Player_${String(s.user).substring(0, 8)}`) };
}

const Leaderboard = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [trends, setTrends] = useState({ series: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connection, setConnection] = useState({ mode: "connecting", lastUpdateAt: null });
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("score_desc");
  const [limit, setLimit] = useState(10);
  const pollRef = useRef(null);
  const esRef = useRef(null);

  const { chartData, lineKeys } = useMemo(() => {
    const { data, lineKeys: keys } = pivotTrendsToChartData(trends);
    return { chartData: data, lineKeys: keys };
  }, [trends]);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? leaderboardData.filter((p) => (p.player || "").toLowerCase().includes(q))
      : leaderboardData.slice();

    const sorted = filtered.sort((a, b) => {
      if (sortBy === "score_desc") return (b.score || 0) - (a.score || 0);
      if (sortBy === "score_asc") return (a.score || 0) - (b.score || 0);
      if (sortBy === "name_asc") return String(a.player || "").localeCompare(String(b.player || ""));
      if (sortBy === "recent") return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
      return 0;
    });

    return sorted.slice(0, limit);
  }, [leaderboardData, limit, query, sortBy]);

  const fetchSnapshot = async () => {
    const lbRes = await fetch(`${backendUrl}/api/game/leaderboard?limit=${encodeURIComponent(limit)}`);
    if (!lbRes.ok) throw new Error("Failed to fetch leaderboard data");
    const lb = await lbRes.json();

    const trRes = await fetch(`${backendUrl}/api/game/leaderboard/trends?top=5&points=20`);
    const tr = trRes.ok ? await trRes.json() : { series: [] };

    setLeaderboardData(lb);
    setTrends(tr);
    setConnection((c) => ({ ...c, lastUpdateAt: new Date().toISOString() }));
  };

  const startPolling = () => {
    if (pollRef.current) return;
    pollRef.current = setInterval(() => {
      fetchSnapshot().catch(() => {});
    }, 30000);
  };

  const stopPolling = () => {
    if (!pollRef.current) return;
    clearInterval(pollRef.current);
    pollRef.current = null;
  };

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchSnapshot();
      } catch (e) {
        if (!mounted) return;
        setError(e.message || "Failed to load leaderboard");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    boot();

    // Real-time stream (SSE)
    try {
      const es = new EventSource(`${backendUrl}/api/game/leaderboard/stream`, { withCredentials: false });
      esRef.current = es;
      setConnection({ mode: "live", lastUpdateAt: null });

      es.addEventListener("leaderboard", (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          setLeaderboardData(payload.leaderboard || []);
          setTrends(payload.trends || { series: [] });
          setConnection({ mode: "live", lastUpdateAt: payload.sentAt || new Date().toISOString() });
          setError(null);
        } catch {
          // ignore parse errors
        }
      });

      es.addEventListener("error", () => {
        // SSE failed (host/proxy/etc). Fall back to polling.
        setConnection((c) => ({ ...c, mode: "polling" }));
        startPolling();
      });
    } catch {
      setConnection((c) => ({ ...c, mode: "polling" }));
      startPolling();
    }

    return () => {
      mounted = false;
      stopPolling();
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendUrl, limit]);

  const handleManualRefresh = async () => {
    try {
      setError(null);
      await fetchSnapshot();
    } catch (e) {
      setError(e.message || "Failed to refresh");
    }
  };

  return (
    <div className="lb-page">
      <div className="lb-container">
        <div className="lb-header">
          <div>
            <h1 className="lb-title">🏆 Leaderboard</h1>
            <p className="lb-subtitle">Real-time rankings with score trends</p>
          </div>

          <div className="lb-pillRow">
            <div className="lb-pill">
              <strong>Status:</strong>{" "}
              {connection.mode === "live" ? "Live" : connection.mode === "polling" ? "Polling" : "Connecting"}
            </div>
            <div className="lb-pill">
              <strong>Updated:</strong>{" "}
              {connection.lastUpdateAt ? formatShortTime(connection.lastUpdateAt) : "—"}
            </div>
            <button className="lb-btn" onClick={handleManualRefresh} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>

        <div className="lb-cardGrid">
          <div className="lb-card">
            <div className="lb-cardHeader">
              <h2>Rankings</h2>
              <div className="lb-muted">Top performers across games</div>
            </div>

            <div className="lb-controls">
              <div className="lb-control" style={{ minWidth: 240 }}>
                <label>Search player</label>
                <input
                  className="lb-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a name…"
                />
              </div>

              <div className="lb-control">
                <label>Sort</label>
                <select className="lb-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="score_desc">Score (high → low)</option>
                  <option value="score_asc">Score (low → high)</option>
                  <option value="recent">Most recent</option>
                  <option value="name_asc">Name (A → Z)</option>
                </select>
              </div>

              <div className="lb-control">
                <label>Show</label>
                <select className="lb-select" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                  <option value={10}>Top 10</option>
                  <option value={20}>Top 20</option>
                  <option value={50}>Top 50</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="lb-error" style={{ color: "#374151" }}>Loading…</div>
            ) : error ? (
              <div className="lb-error">⚠️ {error}</div>
            ) : filteredSorted.length === 0 ? (
              <div className="lb-error" style={{ color: "#374151" }}>
                No results. Try a different search.
              </div>
            ) : (
              <div className="lb-tableWrap">
                <table className="lb-table" role="table">
                  <thead>
                    <tr role="row">
                      <th role="columnheader">Rank</th>
                      <th role="columnheader">Player</th>
                      <th role="columnheader">Score</th>
                      <th role="columnheader">Game</th>
                      <th role="columnheader">Level</th>
                      <th role="columnheader">Updated</th>
                      <th role="columnheader">Badge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSorted.map((p, idx) => (
                      <tr key={p._id || `${p.user}-${idx}`} role="row" className={idx % 2 ? "lb-rowAlt" : ""}>
                        <td className="lb-rank">{medal(idx)}</td>
                        <td>
                          <div style={{ fontWeight: 800 }}>{p.player || "Guest"}</div>
                          <div className="lb-muted" style={{ fontSize: "0.8rem" }}>
                            {p.user ? `ID: ${String(p.user).slice(0, 10)}…` : ""}
                          </div>
                        </td>
                        <td className="lb-score">{p.score}</td>
                        <td>{p.game || "Various"}</td>
                        <td>{p.level || p.difficulty || "N/A"}</td>
                        <td className="lb-muted">{p.timestamp ? new Date(p.timestamp).toLocaleString() : "—"}</td>
                        <td>
                          <span className="lb-badge">{badgeLabel(idx)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="lb-card">
            <div className="lb-cardHeader">
              <h2>Score trends</h2>
              <div className="lb-muted">Last 20 score submissions (top 5)</div>
            </div>
            <div className="lb-chartBody" style={{ height: 360 }}>
              {chartData.length === 0 ? (
                <div className="lb-error" style={{ color: "#374151" }}>
                  No trend data yet. Play a game to generate live charts.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 18, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                    <XAxis
                      dataKey="t"
                      tickFormatter={(t) => formatShortTime(t)}
                      minTickGap={20}
                      stroke="rgba(17,24,39,0.6)"
                    />
                    <YAxis stroke="rgba(17,24,39,0.6)" />
                    <Tooltip
                      labelFormatter={(t) => new Date(t).toLocaleString()}
                      formatter={(val, name) => [val, name]}
                    />
                    <Legend />
                    {lineKeys.slice(0, 5).map((k, i) => (
                      <Line
                        key={k}
                        type="monotone"
                        dataKey={k}
                        dot={false}
                        strokeWidth={2.5}
                        stroke={["#ff4f7c", "#7c3aed", "#0ea5e9", "#16a34a", "#f59e0b"][i % 5]}
                        connectNulls
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
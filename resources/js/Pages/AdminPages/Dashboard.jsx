import axios from "axios";
import React, { useEffect, useState } from "react";

// ─── Colour palette ───────────────────────────────────────────────────────────
const COLORS = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444","#14b8a6","#f97316","#06b6d4"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isLocalhost = (url = "") => url.includes("localhost") || url.startsWith("www.");

const extractPageName = (url = "") => {
    const noProto = url.replace(/^(https?:\/\/)?(www\.)?[^/]+/, "").replace(/\/$/, "");
    if (!noProto || noProto === "") return "Home ( / )";
    const parts = noProto.split("/").filter(Boolean);
    return "/" + parts.join("/");
};

// ─── Mini SVG Donut ──────────────────────────────────────────────────────────
function Donut({ data, size = 160 }) {
    const cx = size / 2, cy = size / 2;
    const R = size / 2 - 10, r = R * 0.55;
    const total = data.reduce((s, d) => s + d.value, 0);
    if (!total) return null;

    let angle = -Math.PI / 2;
    const slices = data.map((d, i) => {
        const sweep = (d.value / total) * 2 * Math.PI;
        const x1 = cx + R * Math.cos(angle), y1 = cy + R * Math.sin(angle);
        const x2 = cx + R * Math.cos(angle + sweep), y2 = cy + R * Math.sin(angle + sweep);
        const xi1 = cx + r * Math.cos(angle), yi1 = cy + r * Math.sin(angle);
        const xi2 = cx + r * Math.cos(angle + sweep), yi2 = cy + r * Math.sin(angle + sweep);
        const large = sweep > Math.PI ? 1 : 0;
        const path = `M${xi1},${yi1} L${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${xi2},${yi2} A${r},${r} 0 ${large},0 ${xi1},${yi1}Z`;
        angle += sweep;
        return <path key={i} d={path} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth="2" />;
    });

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {slices}
            <text x={cx} y={cy - 8} textAnchor="middle" fontSize="10" fill="#9ca3af">views</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontSize="17" fontWeight="700" fill="#111827">
                {total.toLocaleString()}
            </text>
        </svg>
    );
}

// ─── Horizontal Bar ───────────────────────────────────────────────────────────
function HBar({ data }) {
    const max = data[0]?.value || 1;
    return (
        <div className="space-y-3">
            {data.map((d, i) => (
                <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-300 w-4 flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-700 truncate pr-2 font-medium" title={d.url}>
                                {d.name}
                            </span>
                            <span className="text-sm font-bold text-gray-900 tabular-nums flex-shrink-0">
                                {d.value.toLocaleString()}
                            </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{ width: `${(d.value / max) * 100}%`, backgroundColor: COLORS[i % COLORS.length] }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── SVG Sparkline ────────────────────────────────────────────────────────────
function Sparkline({ data, color, W = 160, H = 36 }) {
    if (!data || data.length < 2) return <div style={{ width: W, height: H }} />;
    const max = Math.max(...data) || 1, min = Math.min(...data);
    const pad = 3;
    const pts = data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (W - pad * 2);
        const y = pad + ((max - v) / (max - min || 1)) * (H - pad * 2);
        return [x.toFixed(1), y.toFixed(1)];
    });
    const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
    const area = `${line} L${pts[pts.length - 1][0]},${H - pad} L${pts[0][0]},${H - pad}Z`;
    const id = `sp-${color.replace("#", "")}`;
    return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#${id})`} />
            <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ─── Timeline Chart ───────────────────────────────────────────────────────────
function TimelineChart({ data }) {
    if (!data || data.length < 2) return null;
    const W = 800, H = 180, pL = 48, pR = 12, pT = 10, pB = 28;
    const cW = W - pL - pR, cH = H - pT - pB;
    const max = Math.max(...data.flatMap((d) => [d.visitors, d.pageViews])) || 1;
    const sx = (i) => pL + (i / (data.length - 1)) * cW;
    const sy = (v) => pT + cH - (v / max) * cH;
    const line = (key) => data.map((d, i) => `${i === 0 ? "M" : "L"}${sx(i).toFixed(1)},${sy(d[key]).toFixed(1)}`).join(" ");
    const area = (key, id, color) => {
        const pts = data.map((d, i) => `${sx(i).toFixed(1)},${sy(d[key]).toFixed(1)}`).join(" L ");
        return (
            <>
                <defs>
                    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.12" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={`M${sx(0)},${pT + cH} L${pts} L${sx(data.length - 1)},${pT + cH}Z`} fill={`url(#${id})`} />
            </>
        );
    };

    const yTicks = [0, 0.5, 1].map((t) => ({ y: sy(t * max), label: Math.round(t * max).toLocaleString() }));
    const step = Math.max(1, Math.floor(data.length / 7));

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible" }}>
            {yTicks.map((t, i) => (
                <g key={i}>
                    <line x1={pL} x2={W - pR} y1={t.y} y2={t.y} stroke="#f3f4f6" strokeWidth="1" />
                    <text x={pL - 6} y={t.y + 4} textAnchor="end" fontSize="10" fill="#d1d5db">{t.label}</text>
                </g>
            ))}
            {area("pageViews", "agpv", "#8b5cf6")}
            {area("visitors", "agv", "#6366f1")}
            <path d={line("pageViews")} fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d={line("visitors")} fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            {data.filter((_, i) => i % step === 0 || i === data.length - 1).map((d, _i) => {
                const idx = data.indexOf(d);
                return (
                    <text key={_i} x={sx(idx)} y={H - 4} textAnchor="middle" fontSize="10" fill="#d1d5db">{d.date}</text>
                );
            })}
        </svg>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, sparkData, sparkColor }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">{label}</p>
                    <p className="text-3xl font-bold text-gray-900 tabular-nums leading-none">{value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: accent + "18", color: accent }}>
                    {icon}
                </div>
            </div>
            {sparkData && sparkData.length > 1 && (
                <Sparkline data={sparkData} color={sparkColor} W={160} H={32} />
            )}
        </div>
    );
}



// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
    const [raw, setRaw] = useState({ totalVisitors: 0, totalPageViews: 0, mostVisitedPages: [], visitorsAndPageViews: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await axios.get(route("ourdashboard.index"));
                setRaw(res.data);
            } catch (err) {
                setError("Failed to load analytics data.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // ── Derived ──────────────────────────────────────────────────────────────
    const filtered = (raw.mostVisitedPages || [])
        .filter((p) => !isLocalhost(p.fullPageUrl))
        .map((p) => ({ name: extractPageName(p.fullPageUrl), url: p.fullPageUrl, value: p.screenPageViews }))
        .sort((a, b) => b.value - a.value);

    const pieData = filtered.slice(0, 7);
    const barData = filtered.slice(0, 10);
    const totalFiltered = filtered.reduce((s, d) => s + d.value, 0);

    const timeData = (raw.visitorsAndPageViews || []).map((d) => ({
        date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        visitors: parseInt(d.visitors) || 0,
        pageViews: parseInt(d.pageViews) || 0,
    }));

    const avgVis = timeData.length
        ? Math.round(timeData.reduce((s, d) => s + d.visitors, 0) / timeData.length) : 0;
    const avgPV = timeData.length
        ? Math.round(timeData.reduce((s, d) => s + d.pageViews, 0) / timeData.length) : 0;

    const visSpark = timeData.map((d) => d.visitors);
    const pvSpark = timeData.map((d) => d.pageViews);

    // ── Loading / Error ───────────────────────────────────────────────────────
    if (loading) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-9 h-9 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin" />
                <p className="text-sm text-gray-400">Loading analytics…</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="p-8">
            <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl text-sm">{error}</div>
        </div>
    );

    console.log("Raw data:", raw);  

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-7">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                    <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-[0.15em] mb-1">Analytics</p>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">Website Dashboard</h1>
                    <p className="text-sm text-gray-400 mt-0.5">nepalinscription.com · last 30 days</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full border border-indigo-100 self-start sm:self-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    Live
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Visitors"     value={(raw.totalVisitors || 0).toLocaleString()} icon={<IconUsers />}   accent="#6366f1" sparkData={visSpark} sparkColor="#6366f1" />
                <StatCard label="Total Page Views"   value={(raw.totalPageViews || 0).toLocaleString()} icon={<IconEye />}     accent="#8b5cf6" sparkData={pvSpark}  sparkColor="#8b5cf6" />
                <StatCard label="Avg. Visitors/Day"  value={avgVis.toLocaleString()} icon={<IconTrend />}  accent="#10b981" sparkData={visSpark} sparkColor="#10b981" />
                <StatCard label="Avg. Views/Day"     value={avgPV.toLocaleString()}  icon={<IconBar />}    accent="#f59e0b" sparkData={pvSpark}  sparkColor="#f59e0b" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Donut + Legend */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Top Pages Distribution</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Screen page views · top {pieData.length}</p>
                        </div>
                    </div>
                    {pieData.length > 0 ? (
                        <div className="flex flex-col sm:flex-row items-center gap-5">
                            <div className="flex-shrink-0"><Donut data={pieData} size={160} /></div>
                            <div className="flex-1 w-full space-y-2 min-w-0">
                                {pieData.map((d, i) => {
                                    const pct = totalFiltered ? ((d.value / totalFiltered) * 100).toFixed(1) : "0";
                                    return (
                                        <div key={i} className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                                                    style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                <span className="text-sm text-gray-600 truncate font-mono" title={d.url}>
                                                    {d.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-sm font-bold text-gray-900 tabular-nums">{d.value.toLocaleString()}</span>
                                                <span className="text-xs text-gray-300 tabular-nums w-9 text-right">{pct}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : <EmptyState />}
                </div>

                {/* Horizontal Bar Chart */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Page Views by URL</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Top {barData.length} pages ranked</p>
                        </div>
                    </div>
                    {barData.length > 0 ? <HBar data={barData} /> : <EmptyState />}
                </div>
            </div>

            {/* Timeline */}
            {timeData.length > 1 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Traffic Over Time</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Daily visitors &amp; page views</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-0.5 rounded-full bg-indigo-500" />
                                Visitors
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block w-3 h-0.5 rounded-full bg-purple-500" />
                                Page Views
                            </span>
                        </div>
                    </div>
                    <TimelineChart data={timeData} />
                </div>
            )}

            {/* Raw Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-900">All Tracked Pages</h2>
                    <span className="text-xs text-gray-400">{filtered.length} pages</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                {["#","Page / URL","Views","Share"].map((h, i) => (
                                    <th key={h} className={`px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider ${i > 1 ? "text-right" : "text-left"} ${i === 1 ? "" : ""}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((p, i) => {
                                const share = totalFiltered ? ((p.value / totalFiltered) * 100).toFixed(1) : "—";
                                const barW = filtered[0]?.value ? (p.value / filtered[0].value) * 100 : 0;
                                return (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3.5 text-xs font-mono text-gray-300">
                                            {String(i + 1).padStart(2, "0")}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <span className="w-2 h-2 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                <span className="font-mono text-xs text-gray-500 truncate max-w-xs" title={p.url}>
                                                    {p.url}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <div className="hidden sm:block w-16 h-1 rounded-full bg-gray-100 overflow-hidden">
                                                    <div className="h-full rounded-full"
                                                        style={{ width: `${barW}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                                                </div>
                                                <span className="font-bold text-gray-900 tabular-nums">
                                                    {p.value.toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-right text-gray-400 tabular-nums text-xs">
                                            {share}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-gray-300 pb-2">
                Updated {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · Google Analytics · 30-day window
            </p>
        </div>
    );
};

// ─── Small icons ──────────────────────────────────────────────────────────────
const IconUsers = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M17 20h5v-2a4 4 0 00-5-5M9 20H4v-2a4 4 0 015-5m4-4a4 4 0 110-8 4 4 0 010 8zm6 0a3 3 0 110-6 3 3 0 010 6zM3 12a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
);
const IconEye = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const IconTrend = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);
const IconBar = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);
const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
            <IconBar />
        </div>
        <p className="text-sm text-gray-400">No data available</p>
    </div>
);

export default Dashboard;
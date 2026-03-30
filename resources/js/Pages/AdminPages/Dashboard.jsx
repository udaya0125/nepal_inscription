import axios from "axios";
import React, { useEffect, useState } from "react";

// ─── Colour palette ───────────────────────────────────────────────────────────
const COLORS = [
  "#6366f1","#8b5cf6","#ec4899","#f59e0b",
  "#10b981","#3b82f6","#ef4444","#14b8a6",
  "#f97316","#06b6d4","#a855f7","#84cc16",
  "#e11d48","#0ea5e9","#d97706","#059669",
  "#7c3aed","#db2777","#65a30d","#0891b2",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isLocalhost = (url = "") =>
  url.includes("localhost") || url.startsWith("www.");

const extractPageName = (url = "") => {
  const noProto = url
    .replace(/^(https?:\/\/)?(www\.)?[^/]+/, "")
    .replace(/\/$/, "");
  if (!noProto || noProto === "") return "Home ( / )";
  const parts = noProto.split("/").filter(Boolean);
  return "/" + parts.join("/");
};

const fmt = (n) => Number(n || 0).toLocaleString();

// ─── SVG Sparkline ────────────────────────────────────────────────────────────
function Sparkline({ data, color, W = 180, H = 40 }) {
  if (!data || data.length < 2) return <div style={{ width: W, height: H }} />;
  const max = Math.max(...data) || 1,
    min = Math.min(...data);
  const pad = 4;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = pad + ((max - v) / (max - min || 1)) * (H - pad * 2);
    return [x.toFixed(1), y.toFixed(1)];
  });
  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${H - pad} L${
    pts[0][0]
  },${H - pad}Z`;
  const id = `sp-${color.replace("#", "")}`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Mini SVG Donut ───────────────────────────────────────────────────────────
function Donut({ data, size = 180 }) {
  const cx = size / 2,
    cy = size / 2;
  const R = size / 2 - 10,
    r = R * 0.58;
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return null;

  let angle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle),
      y1 = cy + R * Math.sin(angle);
    const x2 = cx + R * Math.cos(angle + sweep),
      y2 = cy + R * Math.sin(angle + sweep);
    const xi1 = cx + r * Math.cos(angle),
      yi1 = cy + r * Math.sin(angle);
    const xi2 = cx + r * Math.cos(angle + sweep),
      yi2 = cy + r * Math.sin(angle + sweep);
    const large = sweep > Math.PI ? 1 : 0;
    const path = `M${xi1},${yi1} L${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${xi2},${yi2} A${r},${r} 0 ${large},0 ${xi1},${yi1}Z`;
    angle += sweep;
    return (
      <path
        key={i}
        d={path}
        fill={COLORS[i % COLORS.length]}
        stroke="#fff"
        strokeWidth="2.5"
      />
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices}
      <text
        x={cx}
        y={cy - 9}
        textAnchor="middle"
        fontSize="11"
        fill="#9ca3af"
        fontFamily="inherit"
      >
        total
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fontSize="18"
        fontWeight="800"
        fill="#111827"
        fontFamily="inherit"
      >
        {total.toLocaleString()}
      </text>
    </svg>
  );
}

// ─── Timeline Chart ───────────────────────────────────────────────────────────
function TimelineChart({ data }) {
  if (!data || data.length < 2) return null;
  const W = 900,
    H = 200,
    pL = 52,
    pR = 16,
    pT = 12,
    pB = 32;
  const cW = W - pL - pR,
    cH = H - pT - pB;
  const maxV = Math.max(...data.map((d) => d.visitors)) || 1;
  const maxP = Math.max(...data.map((d) => d.pageViews)) || 1;
  const max = Math.max(maxV, maxP);

  const sx = (i) => pL + (i / (data.length - 1)) * cW;
  const sy = (v) => pT + cH - (v / max) * cH;

  const makeLine = (key) =>
    data
      .map((d, i) => `${i === 0 ? "M" : "L"}${sx(i).toFixed(1)},${sy(d[key]).toFixed(1)}`)
      .join(" ");

  const makeArea = (key, color, id) => {
    const pts = data
      .map((d, i) => `${sx(i).toFixed(1)},${sy(d[key]).toFixed(1)}`)
      .join(" L ");
    return (
      <>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M${sx(0)},${pT + cH} L${pts} L${sx(data.length - 1)},${pT + cH}Z`}
          fill={`url(#${id})`}
        />
      </>
    );
  };

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: sy(t * max),
    label: Math.round(t * max).toLocaleString(),
  }));
  const step = Math.max(1, Math.floor(data.length / 8));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ overflow: "visible" }}>
      {yTicks.map((t, i) => (
        <g key={i}>
          <line
            x1={pL} x2={W - pR}
            y1={t.y} y2={t.y}
            stroke="#f3f4f6" strokeWidth="1"
          />
          <text
            x={pL - 8} y={t.y + 4}
            textAnchor="end" fontSize="9.5" fill="#d1d5db"
          >
            {t.label}
          </text>
        </g>
      ))}
      {makeArea("pageViews", "#8b5cf6", "agpv2")}
      {makeArea("visitors", "#6366f1", "agv2")}
      <path
        d={makeLine("pageViews")}
        fill="none" stroke="#8b5cf6" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d={makeLine("visitors")}
        fill="none" stroke="#6366f1" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Dots on last point */}
      {data.length > 0 && (
        <>
          <circle cx={sx(data.length - 1)} cy={sy(data[data.length - 1].visitors)} r="4" fill="#6366f1" />
          <circle cx={sx(data.length - 1)} cy={sy(data[data.length - 1].pageViews)} r="4" fill="#8b5cf6" />
        </>
      )}
      {data
        .filter((_, i) => i % step === 0 || i === data.length - 1)
        .map((d) => {
          const idx = data.indexOf(d);
          return (
            <text
              key={idx}
              x={sx(idx)} y={H - 4}
              textAnchor="middle" fontSize="9.5" fill="#d1d5db"
            >
              {d.date}
            </text>
          );
        })}
    </svg>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, sparkData, sparkColor, sub }) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
      style={{ borderTop: `3px solid ${accent}` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            {label}
          </p>
          <p className="text-3xl font-black text-gray-900 tabular-nums leading-none">
            {value}
          </p>
          {sub && (
            <p className="text-xs text-gray-400 mt-1.5">{sub}</p>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
          style={{ backgroundColor: accent + "15", color: accent }}
        >
          {icon}
        </div>
      </div>
      {sparkData && sparkData.length > 1 && (
        <Sparkline data={sparkData} color={sparkColor} W={200} H={38} />
      )}
    </div>
  );
}

// ─── Page Views Detail Table ──────────────────────────────────────────────────
function PageViewsTable({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const max = data[0]?.value || 1;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50/80">
            {["#", "Page URL", "Views", "% Share", "Trend"].map((h, i) => (
              <th
                key={h}
                className={`px-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap
                  ${i >= 2 ? "text-right" : "text-left"}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((p, i) => {
            const share = total ? ((p.value / total) * 100).toFixed(2) : "—";
            const barW = ((p.value / max) * 100).toFixed(1);
            const color = COLORS[i % COLORS.length];
            return (
              <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="px-5 py-3.5 text-xs font-mono text-gray-300 font-bold">
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td className="px-5 py-3.5 max-w-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="min-w-0">
                      <p
                        className="text-xs font-bold text-gray-800 truncate"
                        title={p.url}
                      >
                        {p.name}
                      </p>
                      <p
                        className="text-[10px] text-gray-400 font-mono truncate"
                        title={p.url}
                      >
                        {p.url}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-sm font-black text-gray-900 tabular-nums">
                    {p.value.toLocaleString()}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden hidden sm:block">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${barW}%`, backgroundColor: color }}
                      />
                    </div>
                    <span
                      className="text-xs font-bold tabular-nums"
                      style={{ color }}
                    >
                      {share}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex justify-end">
                    <div
                      className="h-6 rounded"
                      style={{ width: 80 }}
                    >
                      {/* Mini bar visual */}
                      <svg width="80" height="24" viewBox="0 0 80 24">
                        <rect
                          x={80 - barW * 0.8}
                          y={4}
                          width={barW * 0.8}
                          height={16}
                          rx={3}
                          fill={color}
                          opacity="0.2"
                        />
                        <rect
                          x={80 - barW * 0.8}
                          y={4}
                          width={Math.min(barW * 0.8 * (p.value / max), barW * 0.8)}
                          height={16}
                          rx={3}
                          fill={color}
                          opacity="0.7"
                        />
                      </svg>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-50/80 border-t-2 border-gray-100">
            <td className="px-5 py-3.5" colSpan={2}>
              <span className="text-xs font-bold text-gray-500">
                Total ({data.length} pages)
              </span>
            </td>
            <td className="px-5 py-3.5 text-right">
              <span className="text-sm font-black text-indigo-600 tabular-nums">
                {total.toLocaleString()}
              </span>
            </td>
            <td className="px-5 py-3.5 text-right">
              <span className="text-xs font-bold text-gray-400">100.00%</span>
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [raw, setRaw] = useState({
    totalVisitors: 0,
    totalPageViews: 0,
    mostVisitedPages: [],
    visitorsAndPageViews: [],
  });
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

  // ── Derived ───────────────────────────────────────────────────────────────
  const filtered = (raw.mostVisitedPages || [])
    .filter((p) => !isLocalhost(p.fullPageUrl))
    .map((p) => ({
      name: extractPageName(p.fullPageUrl),
      url: p.fullPageUrl,
      value: parseInt(p.screenPageViews) || 0,
    }))
    .sort((a, b) => b.value - a.value);

  const pieData = filtered.slice(0, 8);
  const totalFiltered = filtered.reduce((s, d) => s + d.value, 0);

  const timeData = (raw.visitorsAndPageViews || []).map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    visitors: parseInt(d.visitors) || 0,
    pageViews: parseInt(d.pageViews) || 0,
  }));

  const avgVis = timeData.length
    ? Math.round(timeData.reduce((s, d) => s + d.visitors, 0) / timeData.length)
    : 0;
  const avgPV = timeData.length
    ? Math.round(timeData.reduce((s, d) => s + d.pageViews, 0) / timeData.length)
    : 0;

  const visSpark = timeData.map((d) => d.visitors);
  const pvSpark = timeData.map((d) => d.pageViews);

  // Peak day
  const peakDay = timeData.reduce(
    (best, d) => (d.visitors > (best?.visitors || 0) ? d : best),
    null
  );

  // ── Loading / Error ──────────────────────────────────────────────────────
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
            <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
          </div>
          <p className="text-sm text-gray-400 font-medium">
            Loading analytics…
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      </div>
    );


    console.log("Raw data:", raw);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1.5">
            Analytics · Last 30 Days
          </p>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            Website Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {peakDay && (
            <div className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-100">
              Peak: {peakDay.date} · {peakDay.visitors.toLocaleString()} visitors
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Live
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Visitors"
          value={fmt(raw.totalVisitors)}
          icon={<IconUsers />}
          accent="#6366f1"
          sparkData={visSpark}
          sparkColor="#6366f1"
          sub={`Avg ${fmt(avgVis)}/day`}
        />
        <StatCard
          label="Total Page Views"
          value={fmt(raw.totalPageViews)}
          icon={<IconEye />}
          accent="#8b5cf6"
          sparkData={pvSpark}
          sparkColor="#8b5cf6"
          sub={`Avg ${fmt(avgPV)}/day`}
        />
        <StatCard
          label="Avg Visitors / Day"
          value={fmt(avgVis)}
          icon={<IconTrend />}
          accent="#10b981"
          sparkData={visSpark}
          sparkColor="#10b981"
          sub="Over 30 days"
        />
        <StatCard
          label="Avg Page Views / Day"
          value={fmt(avgPV)}
          icon={<IconBar />}
          accent="#f59e0b"
          sparkData={pvSpark}
          sparkColor="#f59e0b"
          sub="Over 30 days"
        />
      </div>

      {/* ── Donut + Top Pages Legend ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-gray-900">
              Page Views Distribution
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Top {pieData.length} pages · screen page views
            </p>
          </div>
          {pieData.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <Donut data={pieData} size={180} />
              </div>
              <div className="flex-1 w-full space-y-2.5 min-w-0">
                {pieData.map((d, i) => {
                  const pct = totalFiltered
                    ? ((d.value / totalFiltered) * 100).toFixed(1)
                    : "0";
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span
                          className="text-xs text-gray-600 truncate font-mono"
                          title={d.url}
                        >
                          {d.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-black text-gray-900 tabular-nums">
                          {d.value.toLocaleString()}
                        </span>
                        <span
                          className="text-[10px] font-bold tabular-nums w-9 text-right"
                          style={{ color: COLORS[i % COLORS.length] }}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>

        {/* Top 5 summary cards */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-gray-900">Top 5 Pages</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Highest traffic pages this period
            </p>
          </div>
          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.slice(0, 5).map((p, i) => {
                const pct = totalFiltered
                  ? ((p.value / totalFiltered) * 100).toFixed(1)
                  : "0";
                const color = COLORS[i % COLORS.length];
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 hover:bg-indigo-50/40 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-bold text-gray-800 truncate"
                        title={p.url}
                      >
                        {p.name}
                      </p>
                      <div className="mt-1 h-1 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className="text-sm font-black tabular-nums"
                        style={{ color }}
                      >
                        {p.value.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-400 tabular-nums">
                        {pct}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <p className="text-center text-xs text-gray-300 pb-2">
        Updated{" "}
        {new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        · Powered by Google Analytics · 30-day window
      </p>
    </div>
  );
};

// ─── Icons ────────────────────────────────────────────────────────────────────
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
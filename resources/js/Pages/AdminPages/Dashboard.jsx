import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// ─── Colour palette ───────────────────────────────────────────────────────────
const COLORS = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#ef4444",
    "#14b8a6",
    "#f97316",
    "#06b6d4",
    "#a855f7",
    "#84cc16",
    "#e11d48",
    "#0ea5e9",
    "#d97706",
    "#059669",
    "#7c3aed",
    "#db2777",
    "#65a30d",
    "#0891b2",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isLocalhost = (url = "") => {
    if (!url) return false;
    return url.includes("localhost") || url.startsWith("www.");
};

const extractPageName = (url = "") => {
    if (!url) return "Unknown";
    try {
        const noProto = url
            .replace(/^(https?:\/\/)?(www\.)?[^/]+/, "")
            .replace(/\/$/, "");
        if (!noProto || noProto === "") return "Home ( / )";
        const parts = noProto.split("/").filter(Boolean);
        return "/" + parts.join("/");
    } catch (e) {
        return url;
    }
};

const fmt = (n) => {
    const num = Number(n || 0);
    return num.toLocaleString();
};

// ─── Custom Tooltip for Charts ───────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                <p className="text-xs font-bold text-gray-600 mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p
                        key={index}
                        className="text-sm"
                        style={{ color: entry.color }}
                    >
                        {entry.name}: {fmt(entry.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent, trend }) {
    return (
        <div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 transition-all hover:shadow-md"
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
                    {trend !== undefined && trend !== 0 && (
                        <p
                            className={`text-xs mt-1.5 font-medium ${trend > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from
                            previous period
                        </p>
                    )}
                </div>
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
                    style={{ backgroundColor: accent + "15", color: accent }}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

// ─── Page Views Detail Table ──────────────────────────────────────────────────
function PageViewsTable({ data }) {
    if (!data || data.length === 0) return null;

    const total = data.reduce((s, d) => s + d.value, 0);
    const max = data[0]?.value || 1;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200">
                        <th className="px-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">
                            S.N.
                        </th>
                        <th className="px-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">
                            Page URL
                        </th>
                        <th className="px-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">
                            Views
                        </th>
                        <th className="px-5 py-3.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">
                            % Share
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {data.map((p, i) => {
                        const share = total
                            ? ((p.value / total) * 100).toFixed(2)
                            : "0";
                        const barW = ((p.value / max) * 100).toFixed(1);
                        const color = COLORS[i % COLORS.length];
                        return (
                            <tr
                                key={i}
                                className="hover:bg-indigo-50/30 transition-colors group"
                            >
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
                                                style={{
                                                    width: `${barW}%`,
                                                    backgroundColor: color,
                                                }}
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
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-50/80 border-t-2 border-gray-200">
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
                            <span className="text-xs font-bold text-gray-400">
                                100.00%
                            </span>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

// ─── Loading Component ────────────────────────────────────────────────────────
const DashboardLoading = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
            </div>
            <p className="text-sm text-gray-500 font-medium">
                Loading analytics data...
            </p>
        </div>
    </div>
);

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
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.get(route("ourdashboard.index"));

            // Add this temporarily to debug
            console.log("totalVisitors from API:", res.data.totalVisitors);
            console.log("totalPageViews from API:", res.data.totalPageViews);
            console.log("Full response:", res.data);

            let visitorsAndPageViews = [];
            if (Array.isArray(res.data.visitorsAndPageViews)) {
                visitorsAndPageViews = res.data.visitorsAndPageViews.map(
                    (item) => {
                        let formattedDate = "Unknown";
                        if (item.date) {
                            try {
                                const dateObj = new Date(item.date);
                                formattedDate = !isNaN(dateObj.getTime())
                                    ? dateObj.toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                      })
                                    : String(item.date);
                            } catch {
                                formattedDate = String(item.date);
                            }
                        }
                        return {
                            date: formattedDate,
                            visitors: parseInt(item.visitors) || 0,
                            pageViews: parseInt(item.pageViews) || 0,
                        };
                    },
                );
            }

            setRaw({
                totalVisitors: parseInt(res.data.totalVisitors) || 0,
                totalPageViews: parseInt(res.data.totalPageViews) || 0,
                mostVisitedPages: Array.isArray(res.data.mostVisitedPages)
                    ? res.data.mostVisitedPages
                    : [],
                visitorsAndPageViews: visitorsAndPageViews,
            });
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError(
                err.response?.data?.message || "Failed to load analytics data.",
            );
        } finally {
            setLoading(false);
        }
    };

    // ─── Derived Data ───────────────────────────────────────────────────────────

    const filtered = (raw.mostVisitedPages || [])
        .filter((p) => p && p.fullPageUrl && !isLocalhost(p.fullPageUrl))
        .map((p) => ({
            name: extractPageName(p.fullPageUrl),
            url: p.fullPageUrl,
            value: parseInt(p.screenPageViews) || 0,
        }))
        .sort((a, b) => b.value - a.value);

    const pieData = filtered.slice(0, 8);
    const totalFiltered = filtered.reduce((s, d) => s + d.value, 0);

    const timeData = raw.visitorsAndPageViews;

    // Calculate averages
    const avgVis = timeData.length
        ? Math.round(
              timeData.reduce((s, d) => s + d.visitors, 0) / timeData.length,
          )
        : 0;
    const avgPV = timeData.length
        ? Math.round(
              timeData.reduce((s, d) => s + d.pageViews, 0) / timeData.length,
          )
        : 0;

    // Calculate trend (compare last 7 days with previous 7 days)
    const getTrend = (data, key) => {
        if (!data || data.length < 14) return 0;
        const recent7 = data.slice(-7).reduce((s, d) => s + d[key], 0) / 7;
        const previous7 =
            data.slice(-14, -7).reduce((s, d) => s + d[key], 0) / 7;
        return previous7
            ? Math.round(((recent7 - previous7) / previous7) * 100)
            : 0;
    };

    const visitorsTrend = getTrend(timeData, "visitors");
    const pageViewsTrend = getTrend(timeData, "pageViews");

    // Peak day
    const peakDay =
        timeData.length > 0
            ? timeData.reduce(
                  (best, d) => (d.visitors > (best?.visitors || 0) ? d : best),
                  timeData[0],
              )
            : null;

    // ─── Loading / Error States ──────────────────────────────────────────────
    if (loading) {
        return (
            <AdminWrapper>
                <DashboardLoading />
            </AdminWrapper>
        );
    }

    if (error) {
        return (
            <AdminWrapper>
                <div className="min-h-screen bg-gray-50 p-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-8 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-red-800 mb-2">
                                Unable to Load Dashboard
                            </h3>
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={fetchDashboardData}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </AdminWrapper>
        );
    }

    return (
        <AdminWrapper>
            <div className="">
                <div className=" space-y-6">
                    {/* ── Header ── */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1.5">
                                Analytics · Last 30 Days
                            </p>
                            <h1 className="text-2xl font-black text-gray-900 leading-tight">
                                Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            {/* {peakDay && peakDay.visitors > 0 && (
                                <div className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-100">
                                    Peak: {peakDay.date} ·{" "}
                                    {peakDay.visitors.toLocaleString()} visitors
                                </div>
                            )} */}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                Live
                            </div>
                        </div>
                    </div>

                    {/* ── Stat Cards ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Visitors"
                            value={fmt(raw.totalVisitors)}
                            icon={<IconUsers />}
                            accent="#6366f1"
                            trend={visitorsTrend}
                        />
                        <StatCard
                            label="Total Page Views"
                            value={fmt(raw.totalPageViews)}
                            icon={<IconEye />}
                            accent="#8b5cf6"
                            trend={pageViewsTrend}
                        />
                        <StatCard
                            label="Avg Visitors / Day"
                            value={fmt(avgVis)}
                            icon={<IconTrend />}
                            accent="#10b981"
                        />
                        <StatCard
                            label="Avg Page Views / Day"
                            value={fmt(avgPV)}
                            icon={<IconBar />}
                            accent="#f59e0b"
                        />
                    </div>

                    {/* ── Pie Chart + Top Pages ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Pie Chart Section */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="mb-5">
                                <h2 className="text-sm font-bold text-gray-900">
                                    Page Views Distribution
                                </h2>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Top {pieData.length} pages by screen page
                                    views
                                </p>
                            </div>
                            {pieData.length > 0 ? (
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="flex-shrink-0">
                                        <ResponsiveContainer
                                            width={200}
                                            height={200}
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {pieData.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    COLORS[
                                                                        index %
                                                                            COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex-1 w-full space-y-2.5 min-w-0">
                                        {pieData.map((d, i) => {
                                            const pct = totalFiltered
                                                ? (
                                                      (d.value /
                                                          totalFiltered) *
                                                      100
                                                  ).toFixed(1)
                                                : "0";
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex items-center justify-between gap-2 hover:bg-gray-50 p-1 rounded-lg transition-colors"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                                        <span
                                                            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                                                            style={{
                                                                backgroundColor:
                                                                    COLORS[
                                                                        i %
                                                                            COLORS.length
                                                                    ],
                                                            }}
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
                                                            style={{
                                                                color: COLORS[
                                                                    i %
                                                                        COLORS.length
                                                                ],
                                                            }}
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
                                <EmptyState message="No page view data available" />
                            )}
                        </div>

                        {/* Top 5 Pages */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="mb-5">
                                <h2 className="text-sm font-bold text-gray-900">
                                    Top 5 Pages
                                </h2>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Highest traffic pages this period
                                </p>
                            </div>
                            {filtered.length > 0 ? (
                                <div className="space-y-3">
                                    {filtered.slice(0, 5).map((p, i) => {
                                        const pct = totalFiltered
                                            ? (
                                                  (p.value / totalFiltered) *
                                                  100
                                              ).toFixed(1)
                                            : "0";
                                        const color = COLORS[i % COLORS.length];
                                        return (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 hover:bg-indigo-50/40 transition-all"
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                                                    style={{
                                                        backgroundColor: color,
                                                    }}
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
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${Math.min(100, parseFloat(pct))}%`,
                                                                backgroundColor:
                                                                    color,
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
                                <EmptyState message="No page data available" />
                            )}
                        </div>
                    </div>

                    {/* ── Full Page Views Table ── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="mb-5">
                            <h2 className="text-sm font-bold text-gray-900">
                                All Pages
                            </h2>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Complete list of tracked pages with view counts
                            </p>
                        </div>
                        {filtered.length > 0 ? (
                            <PageViewsTable data={filtered} />
                        ) : (
                            <EmptyState message="No page data available" />
                        )}
                    </div>

                    {/* ── Footer ── */}
                    <div className="flex justify-center items-center text-xs text-gray-500 pt-4">
                        <p>
                            Data updates in real-time • Last updated:{" "}
                            {new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>

                        {/* <button
                            onClick={fetchDashboardData}
                            className="text-indigo-500 hover:text-indigo-600 font-medium"
                        >
                            Refresh
                        </button> */}
                    </div>
                </div>
            </div>
        </AdminWrapper>
    );
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconUsers = () => (
    <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a4 4 0 00-5-5M9 20H4v-2a4 4 0 015-5m4-4a4 4 0 110-8 4 4 0 010 8zm6 0a3 3 0 110-6 3 3 0 010 6zM3 12a3 3 0 110-6 3 3 0 010 6z"
        />
    </svg>
);

const IconEye = () => (
    <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
    </svg>
);

const IconTrend = () => (
    <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
    </svg>
);

const IconBar = () => (
    <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
    </svg>
);

const EmptyState = ({ message = "No data available" }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
            </svg>
        </div>
        <p className="text-sm text-gray-500">{message}</p>
    </div>
);

export default Dashboard;

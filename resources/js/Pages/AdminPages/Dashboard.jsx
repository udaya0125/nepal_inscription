import AdminWrapper from '@/AdminWrapper/AdminWrapper';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { useState, useEffect } from "react";

export default function Dashboard({
    pieData = [],  
    barData = [],
    visitors = { visitors: 0, pageviews: 0, activeUsers: 0, summary: {} },
}) {
    const COLORS = [
        "#3b82f6",
        "#8b5cf6",
        "#ec4899",
        "#f59e0b",
        "#10b981",
        "#ef4444",
    ];
    
    const [isMobile, setIsMobile] = useState(false);
    const [realtimeUsers, setRealtimeUsers] = useState(visitors.activeUsers || 0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        
        // Fetch real-time data every 30 seconds
        const interval = setInterval(fetchRealtimeData, 30000);
        
        return () => {
            window.removeEventListener("resize", handleResize);
            clearInterval(interval);
        };
    }, []);

    const fetchRealtimeData = async () => {
        try {
            const response = await fetch('/dashboard/realtime-data');
            const data = await response.json();
            if (data.success) {
                setRealtimeUsers(data.activeUsers);
            }
        } catch (error) {
            console.error('Failed to fetch real-time data:', error);
        }
    };

    const total = pieData.reduce((sum, item) => sum + (item.value || 0), 0);
    const dataWithPercentage = pieData.map((item) => ({
        ...item,
        percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) + "%" : "0%",
    }));

    // Custom Tooltip for Pie Chart
    const PieCustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-900/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-2xl border border-gray-800 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: payload[0].color }}
                        />
                        <p className="font-semibold text-white truncate max-w-[200px]">
                            {data.name}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Views</span>
                            <span className="font-semibold text-white">
                                {data.value.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Share</span>
                            <span className="font-semibold text-white">
                                {data.percentage}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Custom Tooltip for Bar Chart
    const BarCustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-2xl border border-gray-800 text-sm">
                    <p className="font-semibold text-white mb-3 pb-2 border-b border-gray-800">
                        {label}
                    </p>
                    <div className="space-y-2">
                        {payload.map((entry, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-gray-300 capitalize">
                                        {entry.dataKey}
                                    </span>
                                </div>
                                <span className="font-semibold text-white">
                                    {entry.value.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    // Calculate averages
    const avgVisitors = barData.length > 0
        ? Math.round(
            barData.reduce((sum, item) => sum + (item.visitors || 0), 0) / barData.length
        ).toLocaleString()
        : "0";

    const avgPageViews = barData.length > 0
        ? Math.round(
            barData.reduce((sum, item) => sum + (item.pageviews || 0), 0) / barData.length
        ).toLocaleString()
        : "0";

    return (
        <AdminWrapper>
            <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Analytics Dashboard
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Monitor your website performance in real-time
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                                Last 30 days
                            </span>
                            {realtimeUsers > 0 && (
                                <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full font-medium flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    {realtimeUsers} Active Now
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Cards - 4 Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Visitors */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13.5 21a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Total Visitors (7 days)
                                    </p>
                                </div>
                                <p className="text-4xl font-bold text-gray-900 mb-2">
                                    {visitors?.visitors?.toLocaleString() || "0"}
                                </p>
                                {visitors.summary?.totalUsers > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {visitors.summary.totalUsers.toLocaleString()} total users (30 days)
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Page Views */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Page Views (7 days)
                                    </p>
                                </div>
                                <p className="text-4xl font-bold text-gray-900 mb-2">
                                    {visitors?.pageviews?.toLocaleString() || "0"}
                                </p>
                                {visitors.summary?.pageViews > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {visitors.summary.pageViews.toLocaleString()} total views (30 days)
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Avg. Visitors */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Avg. Daily Visitors
                                    </p>
                                </div>
                                <p className="text-4xl font-bold text-gray-900 mb-2">
                                    {avgVisitors}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Last {barData.length} days
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Avg. Page Views */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Avg. Daily Page Views
                                    </p>
                                </div>
                                <p className="text-4xl font-bold text-gray-900 mb-2">
                                    {avgPageViews}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Last {barData.length} days
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats Row */}
                {visitors.summary && Object.keys(visitors.summary).length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {visitors.summary.sessions > 0 && (
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 shadow-lg border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1">Total Sessions (30 days)</p>
                                <p className="text-2xl font-bold text-gray-900">{visitors.summary.sessions.toLocaleString()}</p>
                            </div>
                        )}
                        {visitors.summary.newUsers > 0 && (
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 shadow-lg border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1">New Users (30 days)</p>
                                <p className="text-2xl font-bold text-gray-900">{visitors.summary.newUsers.toLocaleString()}</p>
                            </div>
                        )}
                        {visitors.summary.avgSessionDuration > 0 && (
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 shadow-lg border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1">Avg. Session Duration</p>
                                <p className="text-2xl font-bold text-gray-900">{Math.floor(visitors.summary.avgSessionDuration / 60)}m {Math.floor(visitors.summary.avgSessionDuration % 60)}s</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Chart Section */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Chart Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Performance Overview
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    Last {barData.length} days analytics
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm text-gray-600">Visitors</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                    <span className="text-sm text-gray-600">Page Views</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Side: Pie Chart */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Top Pages Distribution (30 days)
                                    </h3>

                                    {pieData.length > 0 ? (
                                        <>
                                            <div className="h-64">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={dataWithPercentage}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={isMobile ? 50 : 70}
                                                            outerRadius={isMobile ? 80 : 100}
                                                            paddingAngle={1}
                                                            dataKey="value"
                                                            strokeWidth={0}
                                                        >
                                                            {dataWithPercentage.map((entry, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={COLORS[index % COLORS.length]}
                                                                    stroke="#fff"
                                                                    strokeWidth={2}
                                                                    className="hover:opacity-90 transition-opacity"
                                                                />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip content={<PieCustomTooltip />} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>

                                            {/* Legend List */}
                                            <div className="space-y-3 mt-6 max-h-96 overflow-y-auto">
                                                {dataWithPercentage.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                                                    >
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div
                                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                            />
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {item.name}
                                                                </p>
                                                                {item.url && (
                                                                    <p className="text-xs text-gray-500 truncate">
                                                                        {item.url}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <p className="text-sm font-bold text-gray-900">
                                                                {item.value.toLocaleString()}
                                                            </p>
                                                            <p className="text-xs font-medium text-gray-500">
                                                                {item.percentage}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="h-64 flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-900 font-semibold mb-2">No page data available</p>
                                            <p className="text-sm text-gray-500 max-w-sm">Start tracking your website to see page performance insights</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Side: Bar Chart */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Traffic Trends
                                    </h3>

                                    {barData.length > 0 ? (
                                        <div className="h-72">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={barData}
                                                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                                    <XAxis
                                                        dataKey="name"
                                                        stroke="#666"
                                                        fontSize={12}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
                                                    <YAxis
                                                        stroke="#666"
                                                        fontSize={12}
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tickFormatter={(value) => value.toLocaleString()}
                                                    />
                                                    <Tooltip content={<BarCustomTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.05)" }} />
                                                    <Bar
                                                        dataKey="visitors"
                                                        name="Visitors"
                                                        fill="#3b82f6"
                                                        radius={[6, 6, 0, 0]}
                                                        maxBarSize={40}
                                                    />
                                                    <Bar
                                                        dataKey="pageviews"
                                                        name="Page Views"
                                                        fill="#8b5cf6"
                                                        radius={[6, 6, 0, 0]}
                                                        maxBarSize={40}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="h-72 flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-900 font-semibold mb-2">No trend data available</p>
                                            <p className="text-sm text-gray-500 max-w-sm">Collect data over time to visualize traffic trends</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Data updates in real-time • Last updated: {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>
            </div>
        </AdminWrapper>
    );
}
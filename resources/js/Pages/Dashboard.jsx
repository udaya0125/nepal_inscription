// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
// import { Head } from '@inertiajs/react';

// export default function Dashboard() {
//     return (
//         <AuthenticatedLayout
//             header={
//                 <h2 className="text-xl font-semibold leading-tight text-gray-800">
//                     Dashboard
//                 </h2>
//             }
//         >
//             <Head title="Dashboard" />

//             <div className="py-12">
//                 <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
//                     <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
//                         <div className="p-6 text-gray-900">
//                             You're logged in!
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AuthenticatedLayout>
//     );
// }

import AdminWrapper from '@/AdminWrapper/AdminWrapper'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const StatCard = ({ label, value, accent }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 flex flex-col gap-1 border-l-4 ${accent}`}>
    <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">{label}</span>
    <span className="text-3xl font-bold text-gray-800 dark:text-white">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </span>
  </div>
)

const Dashboard = () => {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    axios.get('/dashboard/analytics')
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.response?.data?.message ?? err.message)
        setLoading(false)
      })
  }, [])

  return (
    <AdminWrapper>
      <div className="px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
              Analytics Dashboard
            </h2>
            <p className="text-sm text-gray-400 mt-1">Last 30 days · Google Analytics</p>
          </div>
          {data && (
            <div className="flex items-center gap-2 text-sm text-emerald-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              {data.activeUsers} active now
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl p-4 text-sm">
            ⚠ {error}
          </div>
        )}

        {data && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Page Views"  value={data.totalPageViews}           accent="border-l-indigo-500" />
              <StatCard label="Sessions"    value={data.totalSessions}             accent="border-l-emerald-500" />
              <StatCard label="Top Pages"   value={data.topPages?.length ?? 0}     accent="border-l-violet-500" />
              <StatCard label="Referrers"   value={data.topReferrers?.length ?? 0} accent="border-l-amber-500" />
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-sm uppercase tracking-widest text-gray-400 font-medium mb-6">
                Daily Traffic — Last 30 Days
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.chartData ?? []} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={false}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f9fafb',
                      fontSize: '13px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
                  <Line
                    type="monotone" dataKey="pageViews" name="Page Views"
                    stroke="#6366f1" strokeWidth={2} dot={false} activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone" dataKey="visitors" name="Visitors"
                    stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Top Pages */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-sm uppercase tracking-widest text-gray-400 font-medium mb-4">
                  Top Pages
                </h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <th className="text-left text-xs text-gray-400 pb-2 font-medium">Page</th>
                      <th className="text-right text-xs text-gray-400 pb-2 font-medium">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.topPages ?? []).map((page, i) => (
                      <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                        <td className="py-2.5 text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
                          {page.url}
                        </td>
                        <td className="py-2.5 text-right font-semibold text-indigo-500">
                          {page.pageViews.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Traffic Sources */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-sm uppercase tracking-widest text-gray-400 font-medium mb-4">
                  Traffic Sources
                </h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <th className="text-left text-xs text-gray-400 pb-2 font-medium">Referrer</th>
                      <th className="text-right text-xs text-gray-400 pb-2 font-medium">Sessions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.topReferrers ?? []).map((ref, i) => (
                      <tr key={i} className="border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                        <td className="py-2.5 text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
                          {ref.url}
                        </td>
                        <td className="py-2.5 text-right font-semibold text-emerald-500">
                          {ref.pageViews.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </>
        )}
      </div>
    </AdminWrapper>
  )
}

export default Dashboard
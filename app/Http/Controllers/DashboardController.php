<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Spatie\Analytics\Facades\Analytics;
use Spatie\Analytics\Period;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $period = Period::days(30);

            // ── Fetch totals ───────────────────────────────────────────────
            $totals = Analytics::fetchTotalVisitorsAndPageViews($period);

            $totalVisitors  = 0;
            $totalPageViews = 0;

            foreach ($totals as $item) {
                $totalVisitors  += (int) ($item['activeUsers']      ?? 0);
                $totalPageViews += (int) ($item['screenPageViews']  ?? 0);
            }

            Log::info('Log info', $totals->toArray());

            // ── Fetch daily breakdown for the chart ────────────────────────
            $visitorsAndPageViews = Analytics::fetchVisitorsAndPageViews($period);

            $formattedData = [];
            foreach ($visitorsAndPageViews as $item) {
                $formattedData[] = [
                    'date'      => $item['date']             ?? null,
                    'visitors'  => (int) ($item['activeUsers']      ?? 0),
                    'pageViews' => (int) ($item['screenPageViews']  ?? 0),
                ];
            }

            // ── Fetch most visited pages ───────────────────────────────────
            $mostVisitedPages = Analytics::fetchMostVisitedPages($period, 20);

            $formattedPages = [];
            foreach ($mostVisitedPages as $page) {
                $formattedPages[] = [
                    'pageTitle'       => $page['pageTitle']       ?? 'Unknown',
                    'fullPageUrl'     => $page['fullPageUrl']      ?? '',
                    'screenPageViews' => (int) ($page['screenPageViews'] ?? 0),
                ];
            }

            return response()->json([
                'totalVisitors'        => $totalVisitors,
                'totalPageViews'       => $totalPageViews,
                'visitorsAndPageViews' => $formattedData,
                'mostVisitedPages'     => $formattedPages,
            ]);

        } catch (\Exception $e) {
            Log::error('Dashboard Error: ' . $e->getMessage());

            return response()->json([
                'totalVisitors'        => 0,
                'totalPageViews'       => 0,
                'visitorsAndPageViews' => [],
                'mostVisitedPages'     => [],
                'error'                => $e->getMessage(),
            ], 500);
        }
    }
}
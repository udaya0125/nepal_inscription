<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Spatie\Analytics\Period;
use Spatie\Analytics\Facades\Analytics;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $period30 = Period::days(30);
            $period7  = Period::days(7);

            // Daily visitors + page views (for sparkline / timeline)
            $visitorsAndPageViews = Analytics::fetchVisitorsAndPageViews($period30);

            // Totals
            $totalVisitors  = $visitorsAndPageViews->sum('visitors');
            $totalPageViews = $visitorsAndPageViews->sum('pageViews');

            // Daily array for charts
            $timelineData = $visitorsAndPageViews->map(fn($row) => [
                'date'      => $row['date']->format('Y-m-d'),
                'visitors'  => (int) $row['visitors'],
                'pageViews' => (int) $row['pageViews'],
            ])->values()->toArray();

            // Most visited pages (top 20)
            $mostVisitedPages = Analytics::fetchMostVisitedPages($period30, 20);

        } catch (\Exception $e) {
            Log::error('Analytics error: ' . $e->getMessage());

            $totalVisitors    = 0;
            $totalPageViews   = 0;
            $timelineData     = [];
            $mostVisitedPages = collect();
        }

        return Inertia::render('AdminPages/Dashboard', [
            'totalVisitors'        => $totalVisitors,
            'totalPageViews'       => $totalPageViews,
            'visitorsAndPageViews' => $timelineData,
            'mostVisitedPages'     => $mostVisitedPages->toArray(),
        ]);
    }
}
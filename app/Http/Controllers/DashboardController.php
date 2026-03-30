<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Analytics\Period;
use Spatie\Analytics\Facades\Analytics;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $period = Period::days(30);

            // Fetch visitors and page views
            $visitorsAndPageViews = Analytics::fetchVisitorsAndPageViews($period);

            $totalVisitors = 0;
            $totalPageViews = 0;
            $formattedData = [];

            if ($visitorsAndPageViews) {
                foreach ($visitorsAndPageViews as $item) {
                    $visitors  = (int) ($item['visitors']  ?? 0);
                    $pageViews = (int) ($item['pageViews'] ?? 0);
                    $date      = $item['date'] ?? null;

                    $totalVisitors  += $visitors;
                    $totalPageViews += $pageViews;

                    $formattedData[] = [
                        'date'      => $date,
                        'visitors'  => $visitors,
                        'pageViews' => $pageViews,
                    ];
                }
            }

            // Fetch most visited pages
            $mostVisitedPages = Analytics::fetchMostVisitedPages($period, 20);

            $formattedPages = [];
            if ($mostVisitedPages) {
                foreach ($mostVisitedPages as $page) {
                    $formattedPages[] = [
                        'pageTitle'       => $page['pageTitle']       ?? 'Unknown',
                        'fullPageUrl'     => $page['fullPageUrl']     ?? '',
                        'screenPageViews' => (int) ($page['screenPageViews'] ?? 0),
                    ];
                }
            }

            return response()->json([
                'totalVisitors'        => $totalVisitors,
                'totalPageViews'       => $totalPageViews,
                'visitorsAndPageViews' => $formattedData,
                'mostVisitedPages'     => $formattedPages,
            ]);

        } catch (\Exception $e) {
            \Log::error('Dashboard Error: ' . $e->getMessage());

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
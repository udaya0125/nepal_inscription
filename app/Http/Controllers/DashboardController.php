<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Analytics\Period;
use Spatie\Analytics\Facades\Analytics;

class DashboardController extends Controller
{
    public function index()
    {
        $period = Period::days(30);

        $visitorsAndPageViews = Analytics::fetchVisitorsAndPageViews($period);
        $totalVisitors = $visitorsAndPageViews->sum('visitors');
        $totalPageViews = $visitorsAndPageViews->sum('pageViews');

        $mostVisitedPages = Analytics::fetchMostVisitedPages($period, 20);

        return response()->json([
            'totalVisitors'        => $totalVisitors,
            'totalPageViews'       => $totalPageViews,
            'visitorsAndPageViews' => $visitorsAndPageViews,
            'mostVisitedPages'     => $mostVisitedPages,
        ]);
    }
}
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
            
            // Debug: Return the raw data to see structure
            if (request()->has('debug')) {
                return response()->json([
                    'raw_visitors_data' => $visitorsAndPageViews,
                    'raw_visitors_type' => gettype($visitorsAndPageViews),
                    'visitors_count' => count($visitorsAndPageViews),
                ]);
            }
            
            $totalVisitors = 0;
            $totalPageViews = 0;
            $formattedData = [];
            
            // Try to access data using different methods
            if ($visitorsAndPageViews) {
                foreach ($visitorsAndPageViews as $index => $item) {
                    // Try to convert to array if it's an object
                    $itemArray = is_object($item) ? (array) $item : $item;
                    
                    // Try different possible keys
                    $visitors = 0;
                    $pageViews = 0;
                    $date = null;
                    
                    if (isset($itemArray['visitors'])) {
                        $visitors = (int) $itemArray['visitors'];
                    } elseif (isset($itemArray['visitor'])) {
                        $visitors = (int) $itemArray['visitor'];
                    }
                    
                    if (isset($itemArray['pageViews'])) {
                        $pageViews = (int) $itemArray['pageViews'];
                    } elseif (isset($itemArray['pageView'])) {
                        $pageViews = (int) $itemArray['pageView'];
                    }
                    
                    if (isset($itemArray['date'])) {
                        $date = $itemArray['date'];
                    }
                    
                    $totalVisitors += $visitors;
                    $totalPageViews += $pageViews;
                    
                    $formattedData[] = [
                        'date' => $date,
                        'visitors' => $visitors,
                        'pageViews' => $pageViews,
                    ];
                }
            }

            // Fetch most visited pages
            $mostVisitedPages = Analytics::fetchMostVisitedPages($period, 20);
            
            $formattedPages = [];
            if ($mostVisitedPages) {
                foreach ($mostVisitedPages as $page) {
                    $pageArray = is_object($page) ? (array) $page : $page;
                    
                    $formattedPages[] = [
                        'pageTitle' => $pageArray['pageTitle'] ?? $pageArray['title'] ?? 'Unknown',
                        'fullPageUrl' => $pageArray['fullPageUrl'] ?? $pageArray['url'] ?? '',
                        'screenPageViews' => (int) ($pageArray['screenPageViews'] ?? $pageArray['pageViews'] ?? 0),
                    ];
                }
            }

            return response()->json([
                'visitors' => $totalVisitors,
                'pageViews' => $totalPageViews,
                'visitorsAndPageViews' => $formattedData,
                'mostVisitedPages' => $formattedPages,
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Dashboard Error: ' . $e->getMessage());
            
            return response()->json([
                'visitors' => 0,
                'pageViews' => 0,
                'visitorsAndPageViews' => [],
                'mostVisitedPages' => [],
                'error' => $e->getMessage()
            ]);
        }
    }
}
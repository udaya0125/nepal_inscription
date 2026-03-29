<?php

namespace App\Services;

use Google\Client;
use Google\Service\AnalyticsData;
use Google\Service\AnalyticsData\DateRange;
use Google\Service\AnalyticsData\Dimension;
use Google\Service\AnalyticsData\Metric;
use Google\Service\AnalyticsData\RunReportRequest;
use Google\Service\AnalyticsData\OrderBy;
use Google\Service\AnalyticsData\MetricOrderBy;
use Illuminate\Support\Facades\Log;

class GoogleAnalyticsService
{
    private $analytics;
    private $propertyId;

    public function __construct()
    {
        try {
            $credentialsPath = storage_path('app/analytics/nepalinscription.json');

            if (!file_exists($credentialsPath)) {
                throw new \Exception("Google Analytics credentials file not found at: " . $credentialsPath);
            }

            $client = new Client();
            $client->setAuthConfig($credentialsPath);
            $client->addScope(AnalyticsData::ANALYTICS_READONLY);

            $this->analytics = new AnalyticsData($client);

            $this->propertyId = config('services.google_analytics.property_id', env('ANALYTICS_PROPERTY_ID'));

            if (!$this->propertyId) {
                throw new \Exception("Google Analytics property ID is not configured");
            }

            Log::info('Google Analytics Service initialized', [
                'property_id' => $this->propertyId,
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to initialize Google Analytics service: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get total visitors and page views for a given number of days
     */
    public function getTotalVisitorsAndPageViews($days = 7): array
    {
        try {
            Log::info("Fetching total visitors and page views for {$days} days");

            $request = new RunReportRequest();
            $request->setDateRanges([
                new DateRange([
                    'start_date' => $days . 'daysAgo',
                    'end_date'   => 'today',
                ]),
            ]);

            $request->setDimensions([
                new Dimension(['name' => 'date']),
            ]);

            $request->setMetrics([
                new Metric(['name' => 'totalUsers']),
                new Metric(['name' => 'screenPageViews']),
            ]);

            $request->setOrderBys([
                new OrderBy([
                    'dimension' => ['dimension_name' => 'date'],
                ]),
            ]);

            $response = $this->analytics->properties->runReport(
                'properties/' . $this->propertyId,
                $request
            );

            $formattedData = $this->formatVisitorsResponse($response);
            Log::info('Fetched visitors data', ['count' => count($formattedData)]);

            return $formattedData;

        } catch (\Exception $e) {
            Log::error('Error fetching visitors data: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get most visited pages
     */
    public function getMostVisitedPages($days = 30, $limit = 10): array
    {
        try {
            Log::info("Fetching most visited pages for {$days} days");

            $request = new RunReportRequest();
            $request->setDateRanges([
                new DateRange([
                    'start_date' => $days . 'daysAgo',
                    'end_date'   => 'today',
                ]),
            ]);

            $request->setDimensions([
                new Dimension(['name' => 'pageTitle']),
                new Dimension(['name' => 'pagePath']),
            ]);

            $request->setMetrics([
                new Metric(['name' => 'screenPageViews']),
            ]);

            $request->setOrderBys([
                new OrderBy([
                    'metric' => new MetricOrderBy(['metric_name' => 'screenPageViews']),
                    'desc'   => true,
                ]),
            ]);

            $request->setLimit($limit);

            $response = $this->analytics->properties->runReport(
                'properties/' . $this->propertyId,
                $request
            );

            $formattedData = $this->formatPagesResponse($response);
            Log::info('Fetched pages data', ['count' => count($formattedData)]);

            return $formattedData;

        } catch (\Exception $e) {
            Log::error('Error fetching pages data: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get real-time active users (today's active users)
     */
    public function getRealtimeActiveUsers(): int
    {
        try {
            Log::info('Fetching real-time active users');

            $request = new RunReportRequest();
            $request->setDateRanges([
                new DateRange([
                    'start_date' => 'today',
                    'end_date'   => 'today',
                ]),
            ]);

            $request->setMetrics([
                new Metric(['name' => 'activeUsers']),
            ]);

            $response = $this->analytics->properties->runReport(
                'properties/' . $this->propertyId,
                $request
            );

            $rows = $response->getRows();
            if ($rows && count($rows) > 0) {
                return (int) $rows[0]->getMetricValues()[0]->getValue();
            }

            return 0;

        } catch (\Exception $e) {
            Log::error('Error fetching real-time data: ' . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get summary statistics
     */
    public function getSummaryStats($days = 30): array
    {
        try {
            Log::info("Fetching summary statistics for {$days} days");

            $request = new RunReportRequest();
            $request->setDateRanges([
                new DateRange([
                    'start_date' => $days . 'daysAgo',
                    'end_date'   => 'today',
                ]),
            ]);

            $request->setMetrics([
                new Metric(['name' => 'screenPageViews']),
                new Metric(['name' => 'sessions']),
                new Metric(['name' => 'totalUsers']),
                new Metric(['name' => 'newUsers']),
                new Metric(['name' => 'averageSessionDuration']),
                new Metric(['name' => 'bounceRate']),
            ]);

            $response = $this->analytics->properties->runReport(
                'properties/' . $this->propertyId,
                $request
            );

            $rows = $response->getRows();
            if ($rows && count($rows) > 0) {
                $metrics = $rows[0]->getMetricValues();

                return [
                    'pageViews'          => (int) $metrics[0]->getValue(),
                    'sessions'           => (int) $metrics[1]->getValue(),
                    'totalUsers'         => (int) $metrics[2]->getValue(),
                    'newUsers'           => (int) $metrics[3]->getValue(),
                    'avgSessionDuration' => round((float) $metrics[4]->getValue(), 2),
                    'bounceRate'         => round((float) $metrics[5]->getValue(), 2),
                ];
            }

        } catch (\Exception $e) {
            Log::error('Error fetching summary statistics: ' . $e->getMessage());
        }

        return [
            'pageViews'          => 0,
            'sessions'           => 0,
            'totalUsers'         => 0,
            'newUsers'           => 0,
            'avgSessionDuration' => 0,
            'bounceRate'         => 0,
        ];
    }

    /**
     * Get users by country
     */
    public function getUsersByCountry($days = 30, $limit = 10): array
    {
        try {
            $request = new RunReportRequest();
            $request->setDateRanges([
                new DateRange([
                    'start_date' => $days . 'daysAgo',
                    'end_date'   => 'today',
                ]),
            ]);

            $request->setDimensions([
                new Dimension(['name' => 'country']),
            ]);

            $request->setMetrics([
                new Metric(['name' => 'totalUsers']),
            ]);

            $request->setOrderBys([
                new OrderBy([
                    'metric' => new MetricOrderBy(['metric_name' => 'totalUsers']),
                    'desc'   => true,
                ]),
            ]);

            $request->setLimit($limit);

            $response = $this->analytics->properties->runReport(
                'properties/' . $this->propertyId,
                $request
            );

            $formattedData = [];
            $rows          = $response->getRows();

            if ($rows) {
                foreach ($rows as $row) {
                    $dimensions      = $row->getDimensionValues();
                    $metrics         = $row->getMetricValues();
                    $formattedData[] = [
                        'country' => $dimensions[0]->getValue(),
                        'users'   => (int) $metrics[0]->getValue(),
                    ];
                }
            }

            return $formattedData;

        } catch (\Exception $e) {
            Log::error('Error fetching country data: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Format the visitors API response into a flat array
     */
    private function formatVisitorsResponse($response): array
    {
        $formattedData = [];
        $rows          = $response->getRows();

        if (!$rows) {
            return $formattedData;
        }

        foreach ($rows as $row) {
            $dimensions = $row->getDimensionValues();
            $metrics    = $row->getMetricValues();

            // GA4 returns dates as YYYYMMDD
            $dateStr = $dimensions[0]->getValue();
            $date    = \DateTime::createFromFormat('Ymd', $dateStr);

            $formattedData[] = [
                'date'      => $date ? $date->format('Y-m-d') : $dateStr,
                'visitors'  => (int) $metrics[0]->getValue(),
                'pageViews' => (int) $metrics[1]->getValue(),
            ];
        }

        return $formattedData;
    }

    /**
     * Format the pages API response into a flat array
     */
    private function formatPagesResponse($response): array
    {
        $formattedData = [];
        $rows          = $response->getRows();

        if (!$rows) {
            return $formattedData;
        }

        foreach ($rows as $row) {
            $dimensions = $row->getDimensionValues();
            $metrics    = $row->getMetricValues();

            $pageTitle = $dimensions[0]->getValue();
            $pagePath  = $dimensions[1]->getValue();

            if (empty($pageTitle) || $pageTitle === '(not set)') {
                $pageTitle = 'Unknown Page';
            }

            $formattedData[] = [
                'pageTitle'        => $pageTitle,
                'fullPageUrl'      => $pagePath,
                'screenPageViews'  => (int) $metrics[0]->getValue(),
            ];
        }

        return $formattedData;
    }

    /**
     * Test connection to the GA4 API
     */
    public function testConnection(): array
    {
        try {
            $request = new RunReportRequest();
            $request->setDateRanges([
                new DateRange([
                    'start_date' => '1daysAgo',
                    'end_date'   => 'today',
                ]),
            ]);

            $request->setMetrics([
                new Metric(['name' => 'activeUsers']),
            ]);

            $response = $this->analytics->properties->runReport(
                'properties/' . $this->propertyId,
                $request
            );

            return [
                'success'     => true,
                'message'     => 'Successfully connected to Google Analytics API',
                'property_id' => $this->propertyId,
                'test_data'   => $response->getRows() ? 'Data retrieved successfully' : 'No data available',
            ];

        } catch (\Exception $e) {
            return [
                'success'     => false,
                'message'     => 'Failed to connect to Google Analytics API',
                'error'       => $e->getMessage(),
                'property_id' => $this->propertyId,
            ];
        }
    }
}
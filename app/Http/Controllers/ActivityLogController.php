<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of the activity logs.
     */
    // public function index(Request $request)
    // {
    //     $query = ActivityLog::query();

    //     // Search filter
    //     if ($request->filled('search')) {
    //         $search = $request->search;

    //         $query->where('name', 'like', "%{$search}%")
    //               ->orWhere('title', 'like', "%{$search}%")
    //               ->orWhere('ip_address', 'like', "%{$search}%");
    //     }

    //     $activityLogs = $query
    //         ->latest()
    //         ->paginate(10)
    //         ->withQueryString();

    //     return view('activity-logs.index', compact('activityLogs'));
    // }

    public function index()
    {
        // Fetch all logs, latest first
        $logs = ActivityLog::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }
}

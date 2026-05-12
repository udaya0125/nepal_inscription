<?php

namespace App\Http\Controllers;

use App\Models\ChildCategory;
use App\Models\SubCategory;
use App\Models\Category;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ChildCategoryController extends Controller
{
    /**
     * Display a listing of child categories
     */
    public function index()
    {
        $childCategories = ChildCategory::with(['category', 'subCategory'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $childCategories
        ]);
    }

    /**
     * Store a newly created child category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'required|exists:sub_categories,id',
        ]);

        // ✅ Check if category allows subcategories
        $category = Category::findOrFail($validated['category_id']);

        if (!$category->has_sub_category) {
            return response()->json([
                'success' => false,
                'message' => 'Selected category does not allow subcategories'
            ], 422);
        }

        // ✅ Check if subcategory allows child categories
        $subCategory = SubCategory::findOrFail($validated['sub_category_id']);

        if (!$subCategory->has_child_category) {
            return response()->json([
                'success' => false,
                'message' => 'Selected subcategory does not allow child categories'
            ], 422);
        }

        $childCategory = ChildCategory::create($validated);

        // 📝 Log activity
        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created child category: {$childCategory->name}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Child category created successfully',
            'data' => $childCategory
        ], 201);
    }

    /**
     * Update the specified child category
     */
    public function update(Request $request, $id)
    {
        $childCategory = ChildCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'required|exists:sub_categories,id',
        ]);

        // ✅ Check if category allows subcategories
        $category = Category::findOrFail($validated['category_id']);

        if (!$category->has_sub_category) {
            return response()->json([
                'success' => false,
                'message' => 'Selected category does not allow subcategories'
            ], 422);
        }

        // ✅ Check if subcategory allows child categories
        $subCategory = SubCategory::findOrFail($validated['sub_category_id']);

        if (!$subCategory->has_child_category) {
            return response()->json([
                'success' => false,
                'message' => 'Selected subcategory does not allow child categories'
            ], 422);
        }

        $childCategory->update($validated);

        // 📝 Log activity
        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated child category: {$childCategory->name}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Child category updated successfully',
            'data' => $childCategory
        ]);
    }

    /**
     * Remove the specified child category
     */
    public function destroy(Request $request, $id)
    {
        $childCategory = ChildCategory::findOrFail($id);

        $childCategoryName = $childCategory->name;

        $childCategory->delete();

        // 📝 Log activity
        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Deleted child category: {$childCategoryName}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Child category deleted successfully'
        ]);
    }
}
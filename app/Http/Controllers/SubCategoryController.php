<?php

namespace App\Http\Controllers;

use App\Models\SubCategory;
use App\Models\Category;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{
    /**
     * Display a listing of subcategories
     */
    public function index()
    {
        $subCategories = SubCategory::with('category')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $subCategories
        ]);
    }

    /**
     * Store a newly created subcategory
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        // ✅ Check if category allows subcategories
        $category = Category::findOrFail($validated['category_id']);

        if (!$category->has_sub_category) {
            return response()->json([
                'success' => false,
                'message' => 'Selected category does not allow subcategories'
            ], 422);
        }

        $subCategory = SubCategory::create($validated);

        // 📝 Log activity
        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created subcategory: {$subCategory->name}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'SubCategory created successfully',
            'data' => $subCategory
        ], 201);
    }

    /**
     * Update the specified subcategory
     */
    public function update(Request $request, $id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        // ✅ Check if category allows subcategories
        $category = Category::findOrFail($validated['category_id']);

        if (!$category->has_sub_category) {
            return response()->json([
                'success' => false,
                'message' => 'Selected category does not allow subcategories'
            ], 422);
        }

        $subCategory->update($validated);

        // 📝 Log activity
        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated subcategory: {$subCategory->name}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'SubCategory updated successfully',
            'data' => $subCategory
        ]);
    }

    /**
     * Remove the specified subcategory
     */
    public function destroy(Request $request, $id)
    {
        $subCategory = SubCategory::findOrFail($id);
        $subCategoryName = $subCategory->name;
        $categoryName = $subCategory->category->name ?? 'Unknown';

        $subCategory->delete();

        // 📝 Log activity
        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Deleted subcategory: {$subCategoryName}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'SubCategory deleted successfully'
        ]);
    }
}
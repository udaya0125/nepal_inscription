<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // 📌 Get all categories
    public function index()
    {
        $categories = Category::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function indexWithSubCategory()
    {
        $categories = Category::with('subCategories')->get();
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    // 📌 Store new category
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'has_sub_category' => 'required|boolean',
        ]);

        $category = Category::create($validated);

        // 📝 Log activity
        ActivityLog::create([
            'name' => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title' => "Created category: {$category->name}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully',
            'data' => $category
        ]);
    }

    // 📌 Update category
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'has_sub_category' => 'required|boolean',
        ]);

        $category->update($validated);

        // 📝 Log activity
        ActivityLog::create([
            'name' => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title' => "Updated category: {$category->name}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully',
            'data' => $category
        ]);
    }

    // 📌 Delete category
    public function destroy(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $categoryName = $category->name;

        $category->delete();

        // 📝 Log activity
        ActivityLog::create([
            'name' => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title' => "Deleted category: {$categoryName}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully'
        ]);
    }
}
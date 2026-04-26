<?php

namespace App\Http\Controllers;

use App\Models\Palaeographical;
use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\Request;

class PalaeographicalController extends Controller
{
    /**
     * Display a listing
     */
    public function index()
    {
        $data = Palaeographical::with(['category', 'subCategory'])->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Store new record
     */
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image_name' => 'nullable|string|max:255',
            'url' => 'nullable|string',
            'period' => 'nullable|string',
            'script' => 'nullable|string',
            'varna' => 'nullable|string',
            'symbols' => 'nullable|string',
            'citra' => 'nullable|string',
        ]);

        // Validate category allows subcategory
        $category = Category::findOrFail($request->category_id);

        if (!$category->has_sub_category && $request->sub_category_id) {
            return response()->json([
                'success' => false,
                'message' => 'Selected category does not allow subcategories'
            ], 422);
        }

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('palaeographical', 'public');
        }

        $data = Palaeographical::create([
            'category_id' => $request->category_id,
            'sub_category_id' => $request->sub_category_id,
            'image' => $imagePath,
            'image_name' => $request->image_name,
            'url' => $request->url,
            'period' => $request->period,
            'script' => $request->script,
            'varna' => $request->varna,
            'symbols' => $request->symbols,
            'citra' => $request->citra,
        ]);

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Update record
     */
    public function update(Request $request, $id)
    {
        $data = Palaeographical::findOrFail($id);

        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image_name' => 'nullable|string|max:255',
            'url' => 'nullable|string',
            'period' => 'nullable|string',
            'script' => 'nullable|string',
            'varna' => 'nullable|string',
            'symbols' => 'nullable|string',
            'citra' => 'nullable|string',
        ]);

        // Validate category logic
        $category = Category::findOrFail($request->category_id);

        if (!$category->has_sub_category && $request->sub_category_id) {
            return response()->json([
                'success' => false,
                'message' => 'Selected category does not allow subcategories'
            ], 422);
        }

        // Handle image update
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('palaeographical', 'public');
            $data->image = $imagePath;
        }

        $data->update([
            'category_id' => $request->category_id,
            'sub_category_id' => $request->sub_category_id,
            'image_name' => $request->image_name,
            'url' => $request->url,
            'period' => $request->period,
            'script' => $request->script,
            'varna' => $request->varna,
            'symbols' => $request->symbols,
            'citra' => $request->citra,
        ]);

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Delete record
     */
    public function destroy($id)
    {
        $data = Palaeographical::findOrFail($id);
        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Deleted successfully'
        ]);
    }
}
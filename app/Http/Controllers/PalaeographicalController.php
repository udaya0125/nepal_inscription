<?php

namespace App\Http\Controllers;

use App\Models\Palaeographical;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\ChildCategory;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class PalaeographicalController extends Controller
{
    /**
     * Display a listing
     */
    // public function index()
    // {
    //     $data = Palaeographical::with(['category', 'subCategory', 'childCategory'])->latest()->get();

    //     return response()->json([
    //         'success' => true,
    //         'data' => $data
    //     ]);
    // }

    public function index()
{
    $data = Palaeographical::with(['category', 'subCategory', 'childCategory'])
        ->orderBy('category_id')
        ->orderBy('sub_category_id')
        ->orderBy('child_category_id')
        ->orderBy('created_at', 'desc')
        ->get();

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
            'category_id'    => 'required|exists:categories,id',
            'sub_category_id'=> 'nullable|exists:sub_categories,id',
            'child_category_id'=> 'nullable|exists:child_categories,id',
            'image'          => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image_name'     => 'nullable|string|max:255',
            'url'            => 'nullable|string',
            'period'         => 'nullable|string',
            'script'         => 'nullable|string',
            'varna'          => 'nullable|string',
            'symbols'        => 'nullable|string',
            'citra'          => 'nullable|string',
            'order'          => 'nullable|integer',
        ]);

        // Validate category allows subcategory
        $category = Category::findOrFail($request->category_id);

        if (!$category->has_sub_category && $request->sub_category_id) {
            return response()->json([
                'success' => false,
                'message' => 'Selected category does not allow subcategories'
            ], 422);
        }

        if ($request->sub_category_id) {
            $subCategory = SubCategory::findOrFail($request->sub_category_id);

            if ((int) $subCategory->category_id !== (int) $category->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Selected subcategory does not belong to the selected category'
                ], 422);
            }

            if (!$subCategory->has_child_category && $request->child_category_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Selected subcategory does not allow child categories'
                ], 422);
            }

            if ($request->child_category_id) {
                $childCategory = ChildCategory::findOrFail($request->child_category_id);

                if ((int) $childCategory->sub_category_id !== (int) $subCategory->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Selected child category does not belong to the selected subcategory'
                    ], 422);
                }
            }
        } elseif ($request->child_category_id) {
            return response()->json([
                'success' => false,
                'message' => 'Please select a subcategory before selecting a child category'
            ], 422);
        }

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('palaeographical', 'public');
        }

        $data = Palaeographical::create([
            'category_id'    => $request->category_id,
            'sub_category_id'=> $request->sub_category_id,
            'child_category_id'=> $request->child_category_id,
            'image'          => $imagePath,
            'image_name'     => $request->image_name,
            'url'            => $request->url,
            'period'         => $request->period,
            'script'         => $request->script,
            'varna'          => $request->varna,
            'symbols'        => $request->symbols,
            'citra'          => $request->citra,
            'order'          => $request->order,
        ]);

        // 📝 Log activity
        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created Palaeographical: {$category->name}",
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
            'category_id'    => 'required|exists:categories,id',
            'sub_category_id'=> 'nullable|exists:sub_categories,id',
            'child_category_id'=> 'nullable|exists:child_categories,id',
            'image'          => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image_name'     => 'nullable|string|max:255',
            'url'            => 'nullable|string',
            'period'         => 'nullable|string',
            'script'         => 'nullable|string',
            'varna'          => 'nullable|string',
            'symbols'        => 'nullable|string',
            'citra'          => 'nullable|string',
            'order'          => 'nullable|integer',
        ]);

        // Validate category logic
        $category = Category::findOrFail($request->category_id);

        if (!$category->has_sub_category && $request->sub_category_id) {
            return response()->json([
                'success' => false,
                'message' => 'Selected category does not allow subcategories'
            ], 422);
        }

        if ($request->sub_category_id) {
            $subCategory = SubCategory::findOrFail($request->sub_category_id);

            if ((int) $subCategory->category_id !== (int) $category->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Selected subcategory does not belong to the selected category'
                ], 422);
            }

            if (!$subCategory->has_child_category && $request->child_category_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Selected subcategory does not allow child categories'
                ], 422);
            }

            if ($request->child_category_id) {
                $childCategory = ChildCategory::findOrFail($request->child_category_id);

                if ((int) $childCategory->sub_category_id !== (int) $subCategory->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Selected child category does not belong to the selected subcategory'
                    ], 422);
                }
            }
        } elseif ($request->child_category_id) {
            return response()->json([
                'success' => false,
                'message' => 'Please select a subcategory before selecting a child category'
            ], 422);
        }

        // Handle image update
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('palaeographical', 'public');
            $data->image = $imagePath;
        }

        $data->update([
            'category_id'    => $request->category_id,
            'sub_category_id'=> $request->sub_category_id,
            'child_category_id'=> $request->child_category_id,
            'image_name'     => $request->image_name,
            'url'            => $request->url,
            'period'         => $request->period,
            'script'         => $request->script,
            'varna'          => $request->varna,
            'symbols'        => $request->symbols,
            'citra'          => $request->citra,
            'order'          => $request->order,
        ]);

        // 📝 Log activity
        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated Palaeographical: {$category->name}",
        ]);

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Delete record
     */
    public function destroy(Request $request, $id)
    {
        $data = Palaeographical::findOrFail($id);
        $recordId = $data->id;
        $categoryName = $data->category->name ?? 'Unknown';

        $data->delete();

        // 📝 Log activity
        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Deleted Palaeographical:{$categoryName}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Deleted successfully'
        ]);
    }
}

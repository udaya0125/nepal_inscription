<?php

namespace App\Http\Controllers;

use App\Models\Inscription;
use App\Models\InscriptionImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class InscriptionController extends Controller
{
    /**
     * Display a listing of inscriptions
     */
    public function index()
    {
        $inscriptions = Inscription::with('images')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $inscriptions,
        ]);
    }

    /**
     * Store a newly created inscription
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'banner_image' => 'nullable|image|max:2048',
            'video' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,mkv|max:102400', // 100MB max
            'description' => 'required|string',
            'background' => 'nullable|string',
            'text' => 'nullable|string',
            'translation' => 'nullable|string',
            'references' => 'nullable|string',
            'glossary' => 'nullable|string',
            'images.*' => 'nullable|image|max:2048',
        ]);

        DB::beginTransaction();

        try {
            // Banner image upload
            $bannerPath = null;
            if ($request->hasFile('banner_image')) {
                $bannerPath = $request->file('banner_image')
                    ->store('inscriptions/banners', 'public');
            }

            // Video upload
            $videoPath = null;
            if ($request->hasFile('video')) {
                $videoPath = $request->file('video')
                    ->store('inscriptions/videos', 'public');
            }

            $inscription = Inscription::create([
                'title' => $request->title,
                'banner_image' => $bannerPath,
                'video' => $videoPath, // Store file path instead of URL
                'description' => $request->description,
                'background' => $request->background,
                'text' => $request->text,
                'translation' => $request->translation,
                'refrences' => $request->references,
                'glossary' => $request->glossary,
                'slug' => Str::slug($request->title).'-'.time(),
            ]);

            // Multiple images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $path = $image->store('inscriptions/images', 'public');

                    InscriptionImage::create([
                        'inscription_id' => $inscription->id,
                        'image_path' => $path,
                        'alt_text' => $request->title.' - Image '.($index + 1),
                        'sort_order' => $index + 1,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Inscription created successfully',
                'data' => $inscription->load('images'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create inscription: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update an existing inscription
     */
    public function update(Request $request, $id)
    {
        $inscription = Inscription::with('images')->findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'banner_image' => 'nullable|image|max:2048',
            'video' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,mkv|max:102400', // 100MB max
            'description' => 'sometimes|required|string',
            'background' => 'nullable|string',
            'text' => 'nullable|string',
            'translation' => 'nullable|string',
            'references' => 'nullable|string',
            'glossary' => 'nullable|string',
            'images.*' => 'nullable|image|max:2048',
        ]);

        DB::beginTransaction();

        try {
            // Update banner image
            if ($request->hasFile('banner_image')) {
                if ($inscription->banner_image) {
                    Storage::disk('public')->delete($inscription->banner_image);
                }

                $inscription->banner_image = $request->file('banner_image')
                    ->store('inscriptions/banners', 'public');
            }

            // Update video
            if ($request->hasFile('video')) {
                if ($inscription->video) {
                    Storage::disk('public')->delete($inscription->video);
                }

                $inscription->video = $request->file('video')
                    ->store('inscriptions/videos', 'public');
            }

            // Update other fields
            $inscription->update([
                'title' => $request->title ?? $inscription->title,
                'description' => $request->description ?? $inscription->description,
                'background' => $request->background ?? $inscription->background,
                'text' => $request->text ?? $inscription->text,
                'translation' => $request->translation ?? $inscription->translation,
                'refrences' => $request->references ?? $inscription->refrences,
                'glossary' => $request->glossary ?? $inscription->glossary,
                'slug' => $request->title ? Str::slug($request->title).'-'.time() : $inscription->slug,
            ]);

            // Add new images (does not delete old ones)
            if ($request->hasFile('images')) {
                $currentCount = $inscription->images()->count();

                foreach ($request->file('images') as $index => $image) {
                    $path = $image->store('inscriptions/images', 'public');

                    InscriptionImage::create([
                        'inscription_id' => $inscription->id,
                        'image_path' => $path,
                        'alt_text' => $request->title.' - Image '.($currentCount + $index + 1),
                        'sort_order' => $currentCount + $index + 1,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Inscription updated successfully',
                'data' => $inscription->load('images'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update inscription: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an inscription
     */
    public function destroy($id)
    {
        $inscription = Inscription::with('images')->findOrFail($id);

        DB::beginTransaction();

        try {
            // Delete banner image
            if ($inscription->banner_image) {
                Storage::disk('public')->delete($inscription->banner_image);
            }

            // Delete video
            if ($inscription->video) {
                Storage::disk('public')->delete($inscription->video);
            }

            // Delete related images
            foreach ($inscription->images as $image) {
                Storage::disk('public')->delete($image->image_path);
                $image->delete();
            }

            $inscription->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Inscription deleted successfully',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete inscription: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a single image of an inscription
     */
    public function destroyImage($imageId)
    {
        $image = InscriptionImage::findOrFail($imageId);

        DB::beginTransaction();

        try {
            // Delete image file from storage
            if ($image->image_path) {
                Storage::disk('public')->delete($image->image_path);
            }

            // Delete DB record
            $image->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image: '.$e->getMessage(),
            ], 500);
        }
    }
}

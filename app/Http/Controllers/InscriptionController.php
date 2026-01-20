<?php

namespace App\Http\Controllers;

use App\Models\Inscription;
use App\Models\InscriptionImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class InscriptionController extends Controller
{
    /**
     * Display a listing of inscriptions with pagination.
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->get('per_page', 10);
            $page = $request->get('page', 1);

            $query = Inscription::with('images')->latest();

            $paginated = $query->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $paginated->items(),
                'meta' => [
                    'total' => $paginated->total(),
                    'per_page' => $paginated->perPage(),
                    'current_page' => $paginated->currentPage(),
                    'last_page' => $paginated->lastPage(),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching inscriptions: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch inscriptions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created inscription.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'inscription_number' => 'required|string|unique:inscriptions,inscription_number',
            'banner_image' => 'nullable|image|max:307200',
            'video' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,mkv,webm,mpg,mpeg|max:307200',
            'description' => 'required|string',
            'background' => 'nullable|string',
            'text' => 'nullable|string',
            'translation' => 'nullable|string',
            'references' => 'nullable|string',
            'glossary' => 'nullable|string',
            'status' => 'nullable|in:draft,published,archived',
            'images.*' => 'nullable|image|max:307200',
        ]);

        DB::beginTransaction();

        try {
            // Banner image
            $bannerPath = $request->file('banner_image')
                ? $request->file('banner_image')->store('inscriptions/banners', 'public')
                : null;

            // Video
            $videoPath = $request->file('video')
                ? $request->file('video')->store('inscriptions/videos', 'public')
                : null;

            $inscription = Inscription::create([
                'title' => $request->title,
                'inscription_number' => $request->inscription_number,
                'banner_image' => $bannerPath,
                'video' => $videoPath,
                'description' => $request->description,
                'background' => $request->background,
                'text' => $request->text,
                'translation' => $request->translation,
                'references' => $request->references,
                'glossary' => $request->glossary,
                'status' => $request->status ?? 'draft',
                // ❌ NO SLUG HERE – MODEL HANDLES IT
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
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update an existing inscription.
     */
    public function update(Request $request, $id)
    {
        $inscription = Inscription::with('images')->findOrFail($id);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'inscription_number' => 'sometimes|string|unique:inscriptions,inscription_number,'.$id,
            'banner_image' => 'nullable|image|max:307200',
            'video' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,mkv,webm,mpg,mpeg|max:307200',
            'description' => 'sometimes|string',
            'background' => 'nullable|string',
            'text' => 'nullable|string',
            'translation' => 'nullable|string',
            'references' => 'nullable|string',
            'glossary' => 'nullable|string',
            'status' => 'nullable|in:draft,published,archived',
            'removed_image_ids' => 'nullable|array',
            'removed_image_ids.*' => 'exists:inscription_images,id',
        ]);

        DB::beginTransaction();

        try {
            if ($request->hasFile('banner_image')) {
                Storage::disk('public')->delete($inscription->banner_image);
                $inscription->banner_image = $request->file('banner_image')
                    ->store('inscriptions/banners', 'public');
            }

            if ($request->hasFile('video')) {
                Storage::disk('public')->delete($inscription->video);
                $inscription->video = $request->file('video')
                    ->store('inscriptions/videos', 'public');
            }

            $inscription->update($request->only([
                'title',
                'inscription_number',
                'description',
                'background',
                'text',
                'translation',
                'references',
                'glossary',
                'status',
            ]));

            // Remove images
            if ($request->filled('removed_image_ids')) {
                $images = $inscription->images()
                    ->whereIn('id', $request->removed_image_ids)
                    ->get();

                foreach ($images as $image) {
                    Storage::disk('public')->delete($image->image_path);
                    $image->delete();
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
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an inscription.
     */
    public function destroy($id)
    {
        Log::info('Deleting inscription ID: '.$id);

        $inscription = Inscription::with('images')->findOrFail($id);

        DB::beginTransaction();

        try {
            // Delete banner image
            if ($inscription->banner_image) {
                Storage::disk('public')->delete($inscription->banner_image);
                Log::info('Deleted banner image: '.$inscription->banner_image);
            }

            // Delete video
            if ($inscription->video) {
                Storage::disk('public')->delete($inscription->video);
                Log::info('Deleted video: '.$inscription->video);
            }

            // Delete related images
            $imageCount = 0;
            foreach ($inscription->images as $image) {
                Storage::disk('public')->delete($image->image_path);
                $image->delete();
                $imageCount++;
            }

            Log::info('Deleted '.$imageCount.' gallery images');

            $inscription->delete();

            DB::commit();

            Log::info('Inscription deleted successfully');

            return response()->json([
                'success' => true,
                'message' => 'Inscription deleted successfully',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error deleting inscription: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete inscription: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a single image of an inscription.
     */
    public function destroyImage($imageId)
    {
        Log::info('Deleting image ID: '.$imageId);

        $image = InscriptionImage::findOrFail($imageId);

        DB::beginTransaction();

        try {
            // Delete image file from storage
            if ($image->image_path) {
                Storage::disk('public')->delete($image->image_path);
                Log::info('Deleted image file: '.$image->image_path);
            }

            // Delete DB record
            $image->delete();

            DB::commit();

            Log::info('Image deleted successfully');

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error deleting image: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Test endpoint to check current PHP upload limits.
     */
    public function testUploadLimits()
    {
        $currentUploadLimit = ini_get('upload_max_filesize');
        $currentPostLimit = ini_get('post_max_size');

        return response()->json([
            'success' => true,
            'limits' => [
                'upload_max_filesize' => $currentUploadLimit,
                'post_max_size' => $currentPostLimit,
                'max_execution_time' => ini_get('max_execution_time'),
                'max_input_time' => ini_get('max_input_time'),
                'memory_limit' => ini_get('memory_limit'),
                'upload_max_filesize_bytes' => $this->sizeToBytes($currentUploadLimit),
                'post_max_size_bytes' => $this->sizeToBytes($currentPostLimit),
                'required_bytes' => 300 * 1024 * 1024, // 300MB
            ],
            'server_info' => [
                'php_version' => PHP_VERSION,
                'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
                'is_cli' => PHP_SAPI === 'cli',
                'laravel_version' => app()->version(),
            ],
        ]);
    }
}

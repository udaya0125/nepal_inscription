<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Inscription;
use App\Models\InscriptionImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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

            // Append storage URLs to each inscription
            foreach ($paginated->items() as $inscription) {
                $this->appendStorageUrls($inscription);
            }

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
     * Display inscription by slug (API endpoint)
     */
    public function showBySlug($slug)
    {
        try {
            $inscription = Inscription::where('slug', $slug)
                ->with(['images' => function ($query) {
                    $query->orderBy('sort_order', 'asc');
                }])
                ->firstOrFail();

            // Append storage URLs
            $this->appendStorageUrls($inscription);

            return response()->json([
                'success' => true,
                'data' => $inscription,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching inscription by slug: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Inscription not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Show details page (Inertia render)
     */
    public function showDetails($slug)
    {
        $inscription = Inscription::where('slug', $slug)
            ->with(['images' => function ($query) {
                $query->orderBy('sort_order', 'asc');
            }])
            ->firstOrFail();

        // Append storage URLs for the Inertia frontend
        $this->appendStorageUrls($inscription);

        return Inertia::render('MainPages/InscriptionPage', [
            'inscription' => $inscription,
        ]);
    }

    /**
     * Store a newly created inscription.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'inscription_number' => 'required|string|unique:inscriptions,inscription_number',
            // 'banner_image' => 'nullable|image|max:512000', // 500MB - Original commented out
            'banner_image' => 'nullable|image|max:153600', // 150MB - Modified
            // 'video' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,mkv,webm,mpg,mpeg|max:512000', // 500MB - Original commented out
            'video' => 'nullable|string|max:255', // Modified to accept string URL/path
            'video_banner' => 'nullable|image|max:153600', // 150MB - VIDEO BANNER IS AN IMAGE, NOT A VIDEO
            'description' => 'required|string',
            'background' => 'nullable|string',
            'text' => 'nullable|string',
            'translation' => 'nullable|string',
            'references' => 'nullable|string',
            'glossary' => 'nullable|string',
            'status' => 'nullable|in:draft,published',
            // 'images.*' => 'nullable|image|max:512000', // 500MB - Original commented out
            'images.*' => 'nullable|image|max:153600', // 150MB - Modified
            'dev_text' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            // Banner image - store in 'inscriptions/banners' directory
            $bannerPath = $request->file('banner_image')
                ? $request->file('banner_image')->store('inscriptions/banners', 'public')
                : null;

            // Video - Modified to accept string URL/path instead of file upload
            $videoPath = $request->video;

            // Video banner image - store in 'inscriptions/video_banners' directory
            // NOTE: This is an image, not a video file
            $videoBannerPath = $request->file('video_banner')
                ? $request->file('video_banner')->store('inscriptions/video_banners', 'public')
                : null;

            $inscription = Inscription::create([
                'title' => $request->title,
                'inscription_number' => $request->inscription_number,
                'banner_image' => $bannerPath,
                'video' => $videoPath, // This is a string URL/path
                'video_banner' => $videoBannerPath, // This is an image path
                'description' => $request->description,
                'background' => $request->background,
                'text' => $request->text,
                'translation' => $request->translation,
                'references' => $request->references,
                'glossary' => $request->glossary,
                'dev_text' => $request->dev_text,
                'status' => $request->status ?? 'draft',
            ]);

            // Multiple images - store in 'inscriptions/images' directory
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

            // 🔔 LOG ACTIVITY: Creation
            ActivityLog::create([
                // 'name' => 'inscription_created',
                'name' => $request->user() ? $request->user()->name : 'Unknown',
                'ip_address' => $request->ip(),
                // 'title' => $inscription->title.' ('.$inscription->inscription_number.')',
                'title' => 'Inscription created: ' . $inscription->title . ' (' . $inscription->inscription_number . ')',
            ]);

            DB::commit();

            // Load inscription with storage URLs
            $inscription->load('images');
            $this->appendStorageUrls($inscription);

            return response()->json([
                'success' => true,
                'message' => 'Inscription created successfully',
                'data' => $inscription,
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

        // 🔍 LOG ALL UPLOADED FILES FOR DEBUGGING/AUDITING
        Log::info('Inscription update: File upload details', [
            'inscription_id' => $id,
            'user_id' => $request->user()?->id,
            'banner_image' => $request->hasFile('banner_image')
                ? [
                    'name' => $request->file('banner_image')->getClientOriginalName(),
                    'size_kb' => round($request->file('banner_image')->getSize() / 1024, 2),
                    'mime' => $request->file('banner_image')->getMimeType(),
                ]
                : null,

            'video_banner' => $request->hasFile('video_banner')
                ? [
                    'name' => $request->file('video_banner')->getClientOriginalName(),
                    'size_kb' => round($request->file('video_banner')->getSize() / 1024, 2),
                    'mime' => $request->file('video_banner')->getMimeType(),
                ]
                : null,

            'images' => $request->hasFile('images')
                ? collect($request->file('images'))->map(function ($file) {
                    return [
                        'name' => $file->getClientOriginalName(),
                        'size_kb' => round($file->getSize() / 1024, 2),
                        'mime' => $file->getMimeType(),
                    ];
                })->toArray()
                : [],

            'video_url_or_path' => $request->filled('video') ? $request->video : null,
        ]);

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'inscription_number' => 'sometimes|string|unique:inscriptions,inscription_number,'.$id,
            // 'banner_image' => 'nullable|image|max:512000', // 500MB - Original commented out
            'banner_image' => 'nullable|image|max:153600', // 150MB - Modified
            // 'video' => 'nullable|file|mimes:mp4,avi,mov,wmv,flv,mkv,webm,mpg,mpeg|max:512000', // 500MB - Original commented out
            'video' => 'nullable|string|max:255', // Modified to accept string URL/path
            'description' => 'sometimes|string',
            'background' => 'nullable|string',
            'text' => 'nullable|string',
            'translation' => 'nullable|string',
            'references' => 'nullable|string',
            'video_banner' => 'nullable|image|max:153600', // 150MB - VIDEO BANNER IS AN IMAGE, NOT A VIDEO
            'glossary' => 'nullable|string',
            'status' => 'nullable|in:draft,published',
            'removed_image_ids' => 'nullable|array',
            'removed_image_ids.*' => 'exists:inscription_images,id',
            // 'images.*' => 'nullable|image|max:512000', // 500MB - Original commented out
            'images.*' => 'nullable|image|max:153600', // 150MB - Modified
            'dev_text' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            // Update banner image
            if ($request->hasFile('banner_image')) {
                // Delete old banner image if exists
                if ($inscription->banner_image) {
                    Storage::disk('public')->delete($inscription->banner_image);
                }
                $inscription->banner_image = $request->file('banner_image')
                    ->store('inscriptions/banners', 'public');
            }

            // Update video (string URL/path) - Modified to accept string
            if ($request->filled('video')) {
                $inscription->video = $request->video; // string URL/path
            }

            // Update video banner image - store in the correct path
            // NOTE: This is an image, not a video file
            if ($request->hasFile('video_banner')) {
                // Delete old video banner if exists
                if ($inscription->video_banner) {
                    Storage::disk('public')->delete($inscription->video_banner);
                }

                // Store new video banner in the correct path
                $inscription->video_banner = $request->file('video_banner')
                    ->store('inscriptions/video_banners', 'public');
            }

            // Update other fields
            // Note: video_banner should NOT be included in the only() array because
            // it's already handled separately above when a file is uploaded
            $updateData = $request->only([
                'title',
                'inscription_number',
                'description',
                'background',
                'text',
                'translation',
                'references',
                'glossary',
                'status',
                'dev_text',
            ]);

            // Handle video field separately if it's filled (not a file upload)
            if ($request->filled('video')) {
                $updateData['video'] = $request->video;
            }

            $inscription->update($updateData);

            // Update sort_order for existing images
            if ($request->filled('existing_image_sort')) {
                foreach ($request->existing_image_sort as $imageId => $sortOrder) {
                    $image = InscriptionImage::find($imageId);
                    if ($image && $image->inscription_id == $inscription->id) {
                        $image->update(['sort_order' => $sortOrder]);
                    }
                }
            }

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

            // Add new images with sort_order
            if ($request->hasFile('images')) {
                $existingImageCount = $inscription->images()->count();

                foreach ($request->file('images') as $index => $image) {
                    $path = $image->store('inscriptions/images', 'public');

                    $sortOrder = $request->filled("new_image_sort.{$index}")
                        ? $request->input("new_image_sort.{$index}")
                        : $existingImageCount + $index + 1;

                    InscriptionImage::create([
                        'inscription_id' => $inscription->id,
                        'image_path' => $path,
                        'alt_text' => $inscription->title.' - Image '.($existingImageCount + $index + 1),
                        'sort_order' => $sortOrder,
                    ]);
                }
            }

            // Re-sequence sort_order if needed
            if (! $request->hasFile('images') && $inscription->images()->count() > 0) {
                $images = $inscription->images()->orderBy('sort_order')->get();
                foreach ($images as $index => $image) {
                    $image->update(['sort_order' => $index + 1]);
                }
            }

            // 🔔 LOG ACTIVITY: Update
            ActivityLog::create([
                'name' => $request->user() ? $request->user()->name : 'Unknown',
                'ip_address' => $request->ip(),
                'title' => $inscription->title.' ('.$inscription->inscription_number.')',
            ]);

            DB::commit();

            // Load inscription with storage URLs
            $inscription->load(['images' => function ($query) {
                $query->orderBy('sort_order');
            }]);
            $this->appendStorageUrls($inscription);

            return response()->json([
                'success' => true,
                'message' => 'Inscription updated successfully',
                'data' => $inscription,
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
     * Update inscription status only.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:draft,published',
        ]);

        $inscription = Inscription::findOrFail($id);

        DB::beginTransaction();

        try {
            $oldStatus = $inscription->status;
            $inscription->status = $request->status;
            $inscription->save();

            // 🔔 LOG ACTIVITY: Status Update
            ActivityLog::create([
                'name' => $request->user() ? $request->user()->name : 'Unknown',
                'ip_address' => $request->ip(),
                'title' => "{$inscription->title} {$oldStatus} → {$request->status}",
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Status updated successfully',
                'data' => $inscription,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update status: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an inscription.
     */
    public function destroy($id, Request $request)
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

            // Delete video banner (this is an image)
            if ($inscription->video_banner) {
                Storage::disk('public')->delete($inscription->video_banner);
                Log::info('Deleted video banner image: '.$inscription->video_banner);
            }

            // Delete related images
            $imageCount = 0;
            foreach ($inscription->images as $image) {
                Storage::disk('public')->delete($image->image_path);
                $image->delete();
                $imageCount++;
            }

            Log::info('Deleted '.$imageCount.' gallery images');

            $deletedTitle = $inscription->title.' ('.$inscription->inscription_number.')';
            $inscription->delete();

            // 🔔 LOG ACTIVITY: Deletion
            ActivityLog::create([
                'name' => $request->user() ? $request->user()->name : 'Unknown',
                'ip_address' => $request->ip(),
                'title' => $deletedTitle,
            ]);

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
            if ($image->image_path) {
                Storage::disk('public')->delete($image->image_path);
                Log::info('Deleted image file: '.$image->image_path);
            }

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

    /**
     * Helper to convert size like '300M' to bytes.
     */
    private function sizeToBytes($sizeStr)
    {
        $sizeStr = trim($sizeStr);
        $last = strtolower($sizeStr[strlen($sizeStr) - 1]);
        $value = (int) $sizeStr;

        switch ($last) {
            case 'g': $value *= 1024;
            case 'm': $value *= 1024;
            case 'k': $value *= 1024;
        }

        return $value;
    }

    /**
     * Append storage URLs to inscription and its images.
     */
    private function appendStorageUrls(Inscription $inscription)
    {
        // Append full URL for banner image
        if ($inscription->banner_image) {
            $inscription->banner_image_url = Storage::disk('public')->url($inscription->banner_image);
        }

        // Append full URL for video banner (this is an image)
        if ($inscription->video_banner) {
            $inscription->video_banner_url = Storage::disk('public')->url($inscription->video_banner);
        }

        // Append full URLs for gallery images
        if ($inscription->images) {
            foreach ($inscription->images as $image) {
                if ($image->image_path) {
                    $image->image_url = Storage::disk('public')->url($image->image_path);
                }
            }
        }

        return $inscription;
    }
}

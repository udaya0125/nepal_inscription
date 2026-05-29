<?php

namespace App\Http\Controllers;

use App\Models\Mallalekha;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MallalekhaController extends Controller
{
    public function index()
    {
        $mallalekhas = Mallalekha::with('images')
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'data' => $mallalekhas,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'            => 'required|string|max:255',
            'short_description'=> 'nullable|string',
            'wchn_id'          => 'nullable|string|max:255',
            'status'           => 'required|in:published,draft', // ← updated
            'description'      => 'nullable|string',
            'roman_text'       => 'nullable|string',
            'devanagari_text'  => 'nullable|string',
            'translation'      => 'nullable|string',
            'note'             => 'nullable|string',
            'reference'        => 'nullable|string',
            'banner_image'     => 'nullable|image|mimes:jpg,jpeg,png,webp',
            'images.*'         => 'nullable|image|mimes:jpg,jpeg,png,webp',
        ]);

        $bannerImage = null;

        if ($request->hasFile('banner_image')) {
            $bannerImage = $request->file('banner_image')
                ->store('mallalekha/banner', 'public');
        }

        $mallalekha = Mallalekha::create([
            'title'            => $request->title,
            'short_description'=> $request->short_description,
            'wchn_id'          => $request->wchn_id,
            'status'           => $request->status,
            'description'      => $request->description,
            'roman_text'       => $request->roman_text,
            'devanagari_text'  => $request->devanagari_text,
            'translation'      => $request->translation,
            'note'             => $request->note,
            'reference'        => $request->reference,
            'banner_image'     => $bannerImage,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePath = $image->store('mallalekha/images', 'public');
                $mallalekha->images()->create(['image_path' => $imagePath]);
            }
        }

        return response()->json([
            'status'  => true,
            'message' => 'Mallalekha created successfully.',
            'data'    => $mallalekha->load('images'),
        ]);
    }

    public function update(Request $request, $id)
    {
        $mallalekha = Mallalekha::with('images')->findOrFail($id);

        $request->validate([
            'title'            => 'required|string|max:255',
            'short_description'=> 'nullable|string',
            'wchn_id'          => 'nullable|string|max:255',
            'status'           => 'required|in:published,draft', // ← updated
            'description'      => 'nullable|string',
            'roman_text'       => 'nullable|string',
            'devanagari_text'  => 'nullable|string',
            'translation'      => 'nullable|string',
            'note'             => 'nullable|string',
            'reference'        => 'nullable|string',
            'banner_image'     => 'nullable|image|mimes:jpg,jpeg,png,webp',
            'images.*'         => 'nullable|image|mimes:jpg,jpeg,png,webp',
        ]);

        if ($request->hasFile('banner_image')) {
            if ($mallalekha->banner_image &&
                Storage::disk('public')->exists($mallalekha->banner_image)) {
                Storage::disk('public')->delete($mallalekha->banner_image);
            }
            $mallalekha->banner_image = $request->file('banner_image')
                ->store('mallalekha/banner', 'public');
        }

        $mallalekha->update([
            'title'            => $request->title,
            'short_description'=> $request->short_description,
            'wchn_id'          => $request->wchn_id,
            'status'           => $request->status,
            'description'      => $request->description,
            'roman_text'       => $request->roman_text,
            'devanagari_text'  => $request->devanagari_text,
            'translation'      => $request->translation,
            'note'             => $request->note,
            'reference'        => $request->reference,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePath = $image->store('mallalekha/images', 'public');
                $mallalekha->images()->create(['image_path' => $imagePath]);
            }
        }

        return response()->json([
            'status'  => true,
            'message' => 'Mallalekha updated successfully.',
            'data'    => $mallalekha->load('images'),
        ]);
    }

    public function destroy($id)
    {
        $mallalekha = Mallalekha::with('images')->findOrFail($id);

        if ($mallalekha->banner_image &&
            Storage::disk('public')->exists($mallalekha->banner_image)) {
            Storage::disk('public')->delete($mallalekha->banner_image);
        }

        foreach ($mallalekha->images as $image) {
            if (Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
            $image->delete();
        }

        $mallalekha->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Mallalekha deleted successfully.',
        ]);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Mallalekha extends Model
{
    protected $fillable = [
        'title', 'short_description', 'wchn_id', 'status', 'description', 'roman_text',
        'devanagari_text', 'translation', 'note', 'reference', 'banner_image', 'slug',
    ];

    public function images()
    {
        return $this->hasMany(MallalekhaImage::class);
    }

    protected static function boot()
    {
        parent::boot();

        // Create slug after model creation using random 5-digit number
        static::created(function ($mallalekha) {
            $randomNumber = random_int(10000, 99999);
            $slug = Str::slug($mallalekha->title) . '-' . $randomNumber;

            $mallalekha->updateQuietly([
                'slug' => $slug,
            ]);
        });

        // Update slug when title is updated, preserving original random number
        static::updating(function ($mallalekha) {

            // Only regenerate if title changed
            if ($mallalekha->isDirty('title')) {

                // Extract the original 5-digit number from the existing slug
                $existingSlug = $mallalekha->getOriginal('slug');
                preg_match('/-(\d{5})$/', $existingSlug, $matches);
                $randomNumber = $matches[1] ?? random_int(10000, 99999);

                $mallalekha->slug = Str::slug($mallalekha->title) . '-' . $randomNumber;
            }
        });
    }
}
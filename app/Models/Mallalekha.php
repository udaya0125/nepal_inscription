<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str; 

class Mallalekha extends Model
{
    //

    protected $fillable = [
        'title', 'short_description', 'wchn_id', 'status', 'description', 'roman_text', 'devanagari_text', 'translation', 'note', 'reference', 'banner_image', 'slug',
    ];

    public function images()
    {
        return $this->hasMany(MallalekhaImage::class);
    }

    protected static function boot()
    {
        parent::boot();

        // Create slug after model creation using ID
        static::created(function ($mallalekha) {
            $slug = Str::slug($mallalekha->title).'-'.$mallalekha->id;

            $mallalekha->updateQuietly([
                'slug' => $slug,
            ]);
        });

        // Update slug when title is updated
        static::updating(function ($mallalekha) {

            // Only regenerate if title changed
            if ($mallalekha->isDirty('title')) {

                $slug = Str::slug($mallalekha->title).'-'.$mallalekha->id;

                $mallalekha->slug = $slug;
            }
        });
    }
}

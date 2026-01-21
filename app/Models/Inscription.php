<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Inscription extends Model
{
    protected $fillable = [
        'title',
        'banner_image',
        'video',
        'description',
        'background',
        'text',
        'translation',
        'references',
        'status',
        'inscription_number',
        'glossary',
        'slug',
    ];

    /**
     * Auto-generate slug from inscription_number (lowercase, no random)
     */
    protected static function booted()
    {
        static::created(function ($inscription) {
            if (! $inscription->slug && $inscription->inscription_number) {
                $inscription->updateQuietly([
                    'slug' => Str::slug(strtolower($inscription->inscription_number)),
                ]);
            }
        });
    }

    /**
     * Relationships
     */
    // public function images()
    // {
    //     return $this->hasMany(InscriptionImage::class);
    // }

    public function images()
    {
        return $this->hasMany(InscriptionImage::class)->orderBy('sort_order');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inscription extends Model
{
    //
    protected $fillable = [
        'title', 'banner_image', 'video', 'description', 'background', 'text', 'translation', 'refrences', 'glossary', 'slug',
    ];

    /**
     * Auto-generate unique slug after creation
     */
    protected static function booted()
    {
        static::created(function ($inscription) {

            // Only generate if slug is empty
            if (! $inscription->slug) {

                $titleSlug = Str::slug($inscription->title); // title-based slug
                $randomFiveDigits = random_int(10000, 99999); // secure random
                $uniqueSlug = "{$titleSlug}-{$randomFiveDigits}-{$inscription->id}";

                $inscription->updateQuietly([
                    'slug' => $uniqueSlug,
                ]);
            }
        });
    }

    /**
     * An inscription can have multiple images
     */
    public function images()
    {
        return $this->hasMany(InscriptionImage::class);
    }
}

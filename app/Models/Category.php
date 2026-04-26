<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    //
    protected $fillable = [
        'name', 'has_sub_category',
    ];

    protected $casts = [
        'has_sub_category' => 'boolean',
    ];

    public function subCategories(): HasMany
    {
        return $this->hasMany(SubCategory::class);
    }

        public function palaeographicals(): HasMany
        {
            return $this->hasMany(Palaeographical::class);
        }
}

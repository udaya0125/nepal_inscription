<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubCategory extends Model
{
    protected $fillable = [
        'name',
        'category_id',
        'has_child_category',
    ];

    protected $casts = [
        'has_child_category' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function palaeographicals()
    {
        return $this->hasMany(Palaeographical::class);
    }

    public function childCategories()
    {
        return $this->hasMany(ChildCategory::class);
    }
}

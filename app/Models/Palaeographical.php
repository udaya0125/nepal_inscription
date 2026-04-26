<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Palaeographical extends Model
{
    //
    protected $fillable = [
        'category', 'sub_category', 'image', 'image_name', 'url','period','script','varna','symbols','citra'
    ];

        // Relationship to Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relationship to SubCategory
    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }

}
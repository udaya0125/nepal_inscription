<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Palaeographical extends Model
{
    //
    protected $fillable = [
        'category_id', 'sub_category_id','child_category_id', 'image', 'image_name', 'url','period','script','varna','symbols','citra','order'
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

    public function childCategory()
    {
        return $this->belongsTo(ChildCategory::class);
    }

}
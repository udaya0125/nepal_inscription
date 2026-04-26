<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Palaeographical extends Model
{
    //
    protected $fillable = [
        'category', 'sub_category', 'image', 'image_name', 'url','period','script','varna','symbols','citra'
    ];
}
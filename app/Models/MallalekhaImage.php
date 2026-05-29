<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MallalekhaImage extends Model
{
    protected $fillable = [
        'mallalekha_id',
        'image_path',
    ];

    public function mallalekha()
    {
        return $this->belongsTo(Mallalekha::class);
    }
}
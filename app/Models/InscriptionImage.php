<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InscriptionImage extends Model
{
    //
    protected $fillable = [
        'inscription_id',
        'image_path',
        'alt_text',
        'sort_order'
    ];

     /**
     * Each image belongs to an inscription
     */
    public function inscription()
    {
        return $this->belongsTo(Inscription::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quest extends Model
{
    protected $table = 'quests';

    protected $fillable = [
        'title',
        'description',
        'category',
        'location_from',
        'location_to',
        'price',
        'status',
        'poster_id',
        'runner_id',
    ];

    public function poster()
    {
        return $this->belongsTo(User::class, 'poster_id');
    }

    public function runner()
    {
        return $this->belongsTo(User::class, 'runner_id');
    }
}

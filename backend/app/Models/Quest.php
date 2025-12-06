<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Quest extends Model
{
    use HasUuids;

    protected $table = 'quests';

    protected $fillable = [
        'title',
        'description',
        'category',
        'location_from',
        'location_to',
        'bounty',
        'deadline',
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

    protected function casts(): array
    {
        return [
            'deadline' => 'datetime',
        ];
    }
}

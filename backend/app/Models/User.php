<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasRoles, HasFactory, Notifiable, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function postedQuests()
    {
        return $this->hasMany(Quest::class, 'poster_id');
    }

    public function takenQuests()
    {
        return $this->hasMany(Quest::class, 'runner_id');
    }

    
    protected $appends = ['level', 'rank_title', 'rank_color'];
    
    public function getLevelAttribute()
    {
        return floor($this->xp / 100) + 1;
    }

    public function getRankTitleAttribute()
    {
        $xp = $this->xp;

        if ($xp >= 500) return 'FINAL BOSS'; // Level 5
        if ($xp >= 300) return 'GUILD MASTER'; // Level 4
        if ($xp >= 150) return 'QUEST HUNTER'; // Level 3
        if ($xp >= 50)  return 'LOOT GOBLIN';  // Level 2
        return 'VILLAGER';                     // Level 1
    }

    // BONUS: Send a HEX color code for that purple badge background!
    public function getRankColorAttribute()
    {
        $xp = $this->xp;

        if ($xp >= 500) return '#FFD700'; // Gold (Legendary)
        if ($xp >= 300) return '#FF4500'; // Red (High Level)
        if ($xp >= 150) return '#9932CC'; // Purple (Epic - Like your screenshot)
        if ($xp >= 50)  return '#1E90FF'; // Blue (Rare)
        return '#808080';                 // Grey (Common)
    }
}

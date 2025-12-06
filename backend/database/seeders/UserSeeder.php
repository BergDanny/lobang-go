<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin Lobanggo',
            'email' => 'admin@lobanggo.com',
            'password' => Hash::make('password'),
        ])->assignRole('admin');

        User::create([
            'name' => 'User One Lobanggo',
            'email' => 'user1@lobanggo.com',
            'password' => Hash::make('password'),
        ])->assignRole('user');

        User::create([
            'name' => 'User Two Lobanggo',
            'email' => 'user2@lobanggo.com',
            'password' => Hash::make('password'),
        ])->assignRole('user');
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::firstOrCreate(['name' => 'admin']);
        Permission::firstOrCreate(['name' => 'user']);

        Role::firstOrCreate(['name' => 'admin'])->givePermissionTo('admin');
        Role::firstOrCreate(['name' => 'user'])->givePermissionTo('user');
    }
}

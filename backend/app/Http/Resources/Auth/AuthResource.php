<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuthResource extends JsonResource
{
    private $token;

    public function __construct($user, $token = null)
    {
        parent::__construct($user);
        $this->token = $token;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'user' => [
                'name' => $this->name,
                'email' => $this->email,
                'roles' => $this->roles->pluck('name'),
                'permissions' => $this->getAllPermissions()->pluck('name'),
            ],
            'token' => $this->token,
        ];
    }
}

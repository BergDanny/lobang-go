<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\Auth\AuthResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Hash, Log};

class AuthController extends BaseController
{
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        DB::beginTransaction();

        try {
            $user = User::create($data);
            $user->assignRole('user');

            $token = $user->createToken('auth_token')->plainTextToken;

            DB::commit();

            return $this->sendResponse([
                new AuthResource($user, $token),
            ], 'Registration successful.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return $this->sendError('Registration failed.', ['exception' => $e->getMessage()]);
        }
    }

    public function login(LoginRequest $request)
    {
        $data = $request->validated();

        DB::beginTransaction();

        try {
            $user = User::where('email', $data['email'])->first();

            if (!$user || !Hash::check($data['password'], $user->password)) {
                return $this->sendError('Invalid credentials.', ['credentials' => ['The email or password is incorrect.']]);
            }

            $token = $user->createToken('api_token')->plainTextToken;

            DB::commit();

            return $this->sendResponse([
                new AuthResource($user, $token),
            ], 'Login successful.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return $this->sendError('Login failed.', ['exception' => $e->getMessage()]);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return $this->sendResponse([], 'Logged out successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->sendError('Logout failed.', ['exception' => $e->getMessage()]);
        }
    }
}

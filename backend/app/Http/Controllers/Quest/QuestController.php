<?php

namespace App\Http\Controllers\Quest;

use App\Http\Controllers\BaseController;
use App\Models\Quest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class QuestController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $quests = Quest::with('poster')
                ->where('status', 'open')
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->sendResponse($quests, 'Quests fetched successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->sendError('Failed to get quests.', ['exception' => $e->getMessage()]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

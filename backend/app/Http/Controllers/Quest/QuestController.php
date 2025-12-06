<?php

namespace App\Http\Controllers\Quest;

use App\Http\Controllers\BaseController;
use App\Models\Quest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Log, DB, Gate};
use Illuminate\Validation\ValidationException;

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
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|string|max:255',
                'location_from' => 'nullable|string|max:255',
                'location_to' => 'required|string|max:255',
                'bounty' => 'required|numeric|min:1',
                'deadline' => 'required|dateTime',
                'status' => 'sometimes|string|in:open,in_progress,completed,cancelled',
            ]);

            DB::beginTransaction();

            $quest = Quest::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'category' => $validated['category'],
                'location_from' => $validated['location_from'],
                'location_to' => $validated['location_to'],
                'bounty' => $validated['bounty'],
                'deadline' => $validated['deadline'],
                'status' => $validated['status'] ?? 'open',
                'poster_id' => $request->user()->id,
                // 'runner_id' => null,
            ]);

            $quest->load('poster');

            DB::commit();

            return $this->sendResponse($quest, 'Quest created successfully.');
        } catch (ValidationException $e) {
            return $this->sendError('Validation failed.', $e->errors(), 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return $this->sendError('Failed to create quest.', ['exception' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        try {
            $quest = Quest::with(['poster', 'runner'])->find($id);

            if (!$quest) {
                return $this->sendError('Quest not found.', [], 404);
            }

            $user = $request->user();

            // User can view if:
            // 1. They posted the quest
            // 2. They took the quest
            // 3. The quest is open (for browsing)
            $canView = $quest->poster_id === $user->id
                || $quest->runner_id === $user->id
                || $quest->status === 'open';

            if (!$canView) {
                return $this->sendError('You can only view quests you posted, took, or open quests.', [], 403);
            }

            return $this->sendResponse($quest, 'Quest fetched successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->sendError('Failed to get quest.', ['exception' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $quest = Quest::find($id);

            if (!$quest) {
                return $this->sendError('Quest not found.', [], 404);
            }

            Gate::authorize('modify', $quest);

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'category' => 'sometimes|string|max:255',
                'location_from' => 'sometimes|string|max:255',
                'location_to' => 'sometimes|string|max:255',
                'bounty' => 'sometimes|numeric|min:1',
                'deadline' => 'sometimes|dateTime',
                'status' => 'sometimes|string|in:open,in_progress,completed,cancelled',
            ]);

            DB::beginTransaction();

            $quest->update($validated);
            $quest->load(['poster', 'runner']);

            DB::commit();

            return $this->sendResponse($quest, 'Quest updated successfully.');
        } catch (ValidationException $e) {
            return $this->sendError('Validation failed.', $e->errors(), 422);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return $this->sendError($e->getMessage(), [], 403);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
            return $this->sendError('Failed to update quest.', ['exception' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Quest $quest)
    {
        Gate::authorize('modify', $quest);

        try {
            // if the quest is open, delete it
            if ($quest->status === 'open' && $quest->runner_id) {
                $quest->delete();
            } else {
                return $this->sendError('You can only delete open quests.', [], 403);
            }

            return $this->sendResponse(null, 'Quest deleted successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->sendError('Failed to delete quest.', ['exception' => $e->getMessage()]);
        }
    }

    public function runner_cancel_quest(Quest $quest)
    {
        Gate::authorize('modify', $quest);

        try {
            $quest->updateOrFail([
                'status' => 'cancelled',
                'runner_id' => null,
            ]);

            return $this->sendResponse($quest, 'Quest cancelled successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->sendError('Failed to cancel quest.', ['exception' => $e->getMessage()]);
        }
    }

    public function reopen_cancel_request(Quest $quest)
    {
        Gate::authorize('modify', $quest);

        try {
            $quest->updateOrFail([
                'status' => 'open',
            ]);

            return $this->sendResponse([], 'Quest has been reopened successfully.');
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->sendError('Failed to reopen quest.', ['exception' => $e->getMessage()]);
        }
    }

    /**
     * Display a listing of quests posted by the authenticated user.
     */
    public function posted(Request $request)
    {
        try {
            $postedQuests = $request->user()->postedQuests()
                ->with('runner')
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->sendResponse(
                $postedQuests,
                'Posted quests fetched successfully.'
            );
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->sendError('Failed to get posted quests.', ['exception' => $e->getMessage()]);
        }
    }

    /**
     * Display a listing of quests taken by the authenticated user.
     */
    public function taken(Request $request)
    {
        try {
            $takenQuests = $request->user()->takenQuests()
                ->with('poster')
                ->orderBy('created_at', 'desc')
                ->get();

            return $this->sendResponse(
                $takenQuests,
                'Taken quests fetched successfully.'
            );
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->sendError('Failed to get taken quests.', ['exception' => $e->getMessage()]);
        }
    }
}

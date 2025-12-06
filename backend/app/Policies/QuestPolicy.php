<?php

namespace App\Policies;

use App\Models\Quest;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class QuestPolicy
{
    public function modify(User $user, Quest $quest): Response
    {
        return $user->id === $quest->poster_id
            ? Response::allow()
            : Response::deny('You are not the poster of this quest.');
    }

    public function take(User $user, Quest $quest): Response
    {
        return $user->id === $quest->runner_id
            ? Response::allow()
            : Response::deny('You are not the runner of this quest.');
    }
}

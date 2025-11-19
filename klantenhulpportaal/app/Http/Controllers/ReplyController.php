<?php

namespace App\Http\Controllers;

use App\Models\Reply;
use App\Http\Requests\StoreReplyRequest;
use App\Http\Requests\UpdateReplyRequest;
use App\Http\Resources\ReplyResource;
use Illuminate\Http\Request;

/**
 * @class ReplyController
 * @description Handles reply management endpoints.
 */
class ReplyController extends Controller
{
    /**
     * Display a listing of all replies based on user permissions.
     * @function index
     * @returns \Illuminate\Http\Resources\Json\AnonymousResourceCollection<ReplyResource>
     */
    public function index()
    {
        $user = auth()->user();
        
        if ($user->is_admin) {
            // Admins see all replies
            $replies = Reply::all();
        } else {
            // Users see replies only on their own tickets
            $replies = Reply::whereHas('ticket', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->get();
        }
        
        return ReplyResource::collection($replies);
    }

    /**
     * Store a newly created reply.
     * @function store
     * @param {StoreReplyRequest} $request
     * @returns {ReplyResource}
     */
    public function store(StoreReplyRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = auth()->id();
        $reply = Reply::create($validated);
        return new ReplyResource($reply);
    }

    /**
     * Display the specified reply.
     * @function show
     * @param {Reply} $reply
     * @returns {ReplyResource}
     */
    public function show(Reply $reply)
    {
        $user = auth()->user();
        // Admins can view any reply, users can only view replies on their own tickets
        if (!$user->is_admin && $reply->ticket->user_id !== $user->id) {
            abort(403);
        }
        return new ReplyResource($reply);
    }

    /**
     * Update the specified reply.
     * @function update
     * @param {UpdateReplyRequest} $request
     * @param {Reply} $reply
     * @returns {ReplyResource}
     */
    public function update(UpdateReplyRequest $request, Reply $reply)
    {
        $user = auth()->user();
        // Admins can update any reply, users can only update their own replies
        if (!$user->is_admin && $reply->user_id !== $user->id) {
            abort(403);
        }
        $reply->update($request->validated());
        return new ReplyResource($reply);
    }

    /**
     * Remove the specified reply.
     * @function destroy
     * @param {Reply} $reply
     * @returns {\Illuminate\Http\JsonResponse}
     */
    public function destroy(Reply $reply)
    {
        $user = auth()->user();
        // Admins can delete any reply, users can only delete their own replies
        if (!$user->is_admin && $reply->user_id !== $user->id) {
            abort(403);
        }
        $reply->delete();
        return response()->json(null, 204);
    }
}

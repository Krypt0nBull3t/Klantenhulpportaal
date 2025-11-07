<?php

namespace App\Http\Controllers;

use App\Models\Reply;
use App\Http\Requests\StoreReplyRequest;
use App\Http\Requests\UpdateReplyRequest;
use App\Http\Resources\ReplyResource;
use Illuminate\Http\Request;

/**
 * @class ReplyController
 * @description Handles reply management endpoints (store, show, update, destroy). No global index method.
 */
class ReplyController extends Controller
{
    /**
     * Store a newly created reply.
     * @function store
     * @param {StoreReplyRequest} $request
     * @returns {ReplyResource}
     */
    public function store(StoreReplyRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $reply = Reply::create($data);
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
        $this->authorize('view', $reply);
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
        $this->authorize('update', $reply);
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
        $this->authorize('delete', $reply);
        $reply->delete();
        return response()->json(null, 204);
    }
}

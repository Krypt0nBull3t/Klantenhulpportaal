<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Http\Resources\NoteResource;

/**
 * @class NoteController
 * @description Handles note management endpoints (admin-only).
 */
class NoteController extends Controller
{
    /**
     * Display a listing of all notes (admin-only).
     * @function index
     * @returns \Illuminate\Http\Resources\Json\AnonymousResourceCollection<NoteResource>
     */
    public function index()
    {
        $user = auth()->user();
        if (!$user->is_admin) {
            return response()->json([], 403);
        }
        
        $notes = Note::all();
        return NoteResource::collection($notes);
    }

    /**
     * Store a newly created note (admin-only).
     * @function store
     * @param StoreNoteRequest $request
     * @returns NoteResource
     */
    public function store(StoreNoteRequest $request)
    {
        $user = auth()->user();
        if (!$user->is_admin) {
            abort(403);
        }
        
        $data = $request->validated();
        $data['admin_id'] = auth()->id();
        $note = Note::create($data);
        return new NoteResource($note);
    }

    /**
     * Display the specified note (admin-only).
     * @function show
     * @param Note $note
     * @returns NoteResource
     */
    public function show(Note $note)
    {
        $user = auth()->user();
        if (!$user->is_admin) {
            abort(403);
        }
        return new NoteResource($note);
    }

    /**
     * Update the specified note (admin-only).
     * @function update
     * @param UpdateNoteRequest $request
     * @param Note $note
     * @returns NoteResource
     */
    public function update(UpdateNoteRequest $request, Note $note)
    {
        $user = auth()->user();
        if (!$user->is_admin) {
            abort(403);
        }
        $note->update($request->validated());
        return new NoteResource($note);
    }

    /**
     * Remove the specified note (admin-only).
     * @function destroy
     * @param Note $note
     * @returns \Illuminate\Http\JsonResponse
     */
    public function destroy(Note $note)
    {
        $user = auth()->user();
        if (!$user->is_admin) {
            abort(403);
        }
        $note->delete();
        return response()->json(null, 204);
    }
}

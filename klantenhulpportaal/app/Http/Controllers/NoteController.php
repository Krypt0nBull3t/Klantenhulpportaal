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
     * Display a listing of notes for a ticket (admin-only).
     * @function index
     * @param int $ticketId
     * @returns \Illuminate\Http\Resources\Json\AnonymousResourceCollection<NoteResource>
     */
    public function index($ticketId)
    {
        $this->authorize('viewAny', Note::class);
        $notes = Note::where('ticket_id', $ticketId)->get();
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
        $this->authorize('view', $note);
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
        $this->authorize('update', $note);
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
        $this->authorize('delete', $note);
        $note->delete();
        return response()->json(null, 204);
    }
}

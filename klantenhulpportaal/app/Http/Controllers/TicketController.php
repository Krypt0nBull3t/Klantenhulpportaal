<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Http\Resources\TicketResource;
use Illuminate\Http\Request;

/**
 * @class TicketController
 * @description Handles ticket management endpoints (CRUD, assignment, status).
 */
class TicketController extends Controller
{
    /**
     * Display a listing of tickets.
     * @function index
     * @returns \Illuminate\Http\Resources\Json\AnonymousResourceCollection<TicketResource>
     */
    public function index()
    {
        // Admins see all tickets, users see their own
        $user = auth()->user();
        $tickets = $user->is_admin
            ? Ticket::all()
            : Ticket::where('user_id', $user->id)->get();

        return TicketResource::collection($tickets);
    }

    /**
     * Store a newly created ticket.
     * @function store
     * @param {StoreTicketRequest} $request
     * @returns {TicketResource}
     */
    public function store(StoreTicketRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = auth()->id();
        $ticket = Ticket::create($data);
        return new TicketResource($ticket);
    }

    /**
     * Display the specified ticket.
     * @function show
     * @param {Ticket} $ticket
     * @returns {TicketResource}
     */
    public function show(Ticket $ticket)
    {
        $this->authorize('view', $ticket);
        $ticket->load('replies');
        return new TicketResource($ticket);
    }

    /**
     * Update the specified ticket.
     * @function update
     * @param {UpdateTicketRequest} $request
     * @param {Ticket} $ticket
     * @returns {TicketResource}
     */
    public function update(UpdateTicketRequest $request, Ticket $ticket)
    {
        $this->authorize('update', $ticket);
        $ticket->update($request->validated());
        return new TicketResource($ticket);
    }

    /**
     * Remove the specified ticket.
     * @function destroy
     * @param {Ticket} $ticket
     * @returns {\Illuminate\Http\JsonResponse}
     */
    public function destroy(Ticket $ticket)
    {
        $this->authorize('delete', $ticket);
        $ticket->delete();
        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

/**
 * @class UserController
 * @description Handles user management endpoints (CRUD, registration, profile update, admin-only actions).
 */
class UserController extends Controller
{
    /**
     * Display a listing of users (admin-only).
     * @function index
     * @returns \Illuminate\Http\Resources\Json\AnonymousResourceCollection<UserResource>
     */
    public function index()
    {
        // Only allow admins to list all users
        if (!auth()->user()->is_admin) {
            abort(403, 'Unauthorized');
        }
        return UserResource::collection(User::all());
    }

    /**
     * Store a newly created user (registration).
     * @function store
     * @param {StoreUserRequest} $request
     * @returns {UserResource}
     */
    public function store(StoreUserRequest $request)
    {
        $user = User::create($request->validated());
        return new UserResource($user);
    }

    /**
     * Display the specified user.
     * @function show
     * @param {User} $user
     * @returns {UserResource}
     */
    public function show(User $user)
    {
        // Allow users to view themselves or admins to view any user
        if (!auth()->user()->is_admin && auth()->id() !== $user->id) {
            abort(403, 'Unauthorized');
        }
        return new UserResource($user);
    }

    /**
     * Update the specified user.
     * @function update
     * @param {UpdateUserRequest} $request
     * @param {User} $user
     * @returns {UserResource}
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        // Allow users to update themselves or admins to update any user
        if (!auth()->user()->is_admin && auth()->id() !== $user->id) {
            abort(403, 'Unauthorized');
        }
        $user->update($request->validated());
        return new UserResource($user);
    }

    /**
     * Remove the specified user (admin-only).
     * @function destroy
     * @param {User} $user
     * @returns {\Illuminate\Http\JsonResponse}
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);
        $user->delete();
        return response()->json(null, 204);
    }
}

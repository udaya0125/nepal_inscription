<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\User; // 👈 Added
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        $users = User::latest()->get();

        return response()->json($users);
    }

    /**
     * Store a newly created user in storage.
     */
    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // 🔔 LOG ACTIVITY: User creation — record WHO created the user
        ActivityLog::create([
            'name' => $request->user() ? $request->user()->name : 'System', // 👈 Use creator's name
            'ip_address' => $request->ip(),
            'title' => 'Created user: '.$user->name.' ('.$user->email.')',
        ]);

        return response()->json([
            'message' => 'User created successfully.',
            'user' => $user,
        ], 201);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        // 🔔 LOG ACTIVITY: User update
        ActivityLog::create([
            'name' => $request->user() ? $request->user()->name : 'Unknown',
            'ip_address' => $request->ip(),
            'title' => 'Updated user: '.$user->name.' ('.$user->email.')',
        ]);

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user,
        ]);
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(Request $request, $id) // 👈 Added Request $request
    {
        $user = User::findOrFail($id);

        $deletedTitle = $user->name.' ('.$user->email.')';

        $user->delete();

        // 🔔 LOG ACTIVITY: User deletion
        ActivityLog::create([
            'name' => $request->user() ? $request->user()->name : 'Unknown',
            'ip_address' => $request->ip(),
            'title' => 'Deleted user: '.$deletedTitle,
        ]);

        return response()->json(['message' => 'User deleted successfully.']);
    }
}

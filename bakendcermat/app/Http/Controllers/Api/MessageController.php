<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Requests\UpdateMessageRequest;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $q = Message::with(['student', 'sender']);

        if ($request->filled('student_id')) {
            $q->where('student_id', $request->student_id);
        }

        if ($request->filled('sender_role')) {
            $q->where('sender_role', $request->sender_role);
        }

        if ($request->filled('is_read')) {
            $q->where('is_read', filter_var($request->is_read, FILTER_VALIDATE_BOOLEAN));
        }

        return $q->orderByDesc('created_at')->paginate(50);
    }

    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $data['is_read'] = false;
        $data['created_at'] = now();

        $message = Message::create($data);

        return response()->json($message->load(['student', 'sender']), 201);
    }

    public function show(Message $message)
    {
        return $message->load(['student', 'sender']);
    }

    public function update(UpdateMessageRequest $request, Message $message)
    {
        $message->update($request->validated());

        return $message->load(['student', 'sender']);
    }

    public function destroy(Message $message)
    {
        $message->delete();
        return response()->noContent();
    }
}

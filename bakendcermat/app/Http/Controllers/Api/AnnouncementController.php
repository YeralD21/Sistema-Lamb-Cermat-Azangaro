<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAnnouncementRequest;
use App\Http\Requests\UpdateAnnouncementRequest;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $q = Announcement::query();

        if ($request->filled('status')) {
            $q->where('status',$request->status);
        }

        if ($request->filled('audience')) {
            $q->where('audience',$request->audience);
        }

        return $q->orderByDesc('created_at')->paginate(30);
    }

    public function store(StoreAnnouncementRequest $request)
    {
        $data = $request->validated();

        $data['status'] = 'borrador';
        $data['created_by'] = $request->user()->id;

        $announcement = Announcement::create($data);

        return response()->json($announcement,201);
    }

    public function show(Announcement $announcement)
    {
        return $announcement->load(['creator','approver','section']);
    }

    public function update(UpdateAnnouncementRequest $request, Announcement $announcement)
    {
        $announcement->update($request->validated());
        return $announcement;
    }

    public function destroy(Announcement $announcement)
    {
        $announcement->delete();
        return response()->noContent();
    }

    public function requestApproval(Announcement $announcement)
    {
        $announcement->update([
            'status' => 'pendiente_aprobacion'
        ]);

        return $announcement;
    }

    public function approve(Request $request, Announcement $announcement)
    {
        $announcement->update([
            'status' => 'publicado',
            'approved_by' => $request->user()->id,
            'published_at' => now()
        ]);

        return $announcement;
    }

    public function archive(Announcement $announcement)
    {
        $announcement->update([
            'status' => 'archivado'
        ]);

        return $announcement;
    }
}

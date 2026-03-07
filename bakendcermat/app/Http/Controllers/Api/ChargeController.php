<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChargeRequest;
use App\Http\Requests\UpdateChargeRequest;
use App\Models\Charge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class ChargeController extends Controller
{
    public function index(Request $request)
    {
        $q = Charge::query();

        if ($request->filled('student_id')) $q->where('student_id', $request->student_id);
        if ($request->filled('academic_year_id')) $q->where('academic_year_id', $request->academic_year_id);
        if ($request->filled('status')) $q->where('status', $request->status);
        if ($request->filled('type')) $q->where('type', $request->type);
        if ($request->filled('concept_id')) $q->where('concept_id', $request->concept_id);

        return $q->orderByDesc('due_date')->orderByDesc('created_at')->paginate(50);
    }

    public function store(StoreChargeRequest $request)
    {
        $data = $request->validated();

        // defaults
        $data['status'] = $data['status'] ?? 'pendiente';

        // guardar created_by si existe columna
        if (Schema::hasColumn('charges', 'created_by')) {
            $data['created_by'] = $request->user()->id;
        }

        // normalizar montos
        $data['discount_amount'] = $data['discount_amount'] ?? 0;
        $data['paid_amount'] = $data['paid_amount'] ?? 0;

        $charge = Charge::create($data);

        return response()->json($charge, 201);
    }

    public function show(Charge $charge)
    {
        return $charge->load(['student','concept','payments']);
    }

    public function update(UpdateChargeRequest $request, Charge $charge)
    {
        $charge->update($request->validated());
        return $charge;
    }

    public function destroy(Charge $charge)
    {
        $charge->delete();
        return response()->noContent();
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Receipt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ReceiptController extends Controller
{
    public function index(Request $request)
    {
        $q = Receipt::query();

        if ($request->filled('student_id')) $q->where('student_id', $request->student_id);
        if ($request->filled('payment_id')) $q->where('payment_id', $request->payment_id);

        return $q->orderByDesc('issued_at')->orderByDesc('created_at')->paginate(50);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'payment_id' => ['required','uuid','exists:payments,id'],
        ]);

        return DB::transaction(function () use ($data) {
            /** @var Payment $payment */
            $payment = Payment::lockForUpdate()->findOrFail($data['payment_id']);

            // Si ya existe recibo, lo devolvemos
            $existing = Receipt::where('payment_id', $payment->id)->first();
            if ($existing) return $existing;

            // numero automático simple (puedes cambiarlo por tu formato)
            $number = 'R-' . str_pad((string) (Receipt::count() + 1), 8, '0', STR_PAD_LEFT);

            $insert = [
                'payment_id' => $payment->id,
                'student_id' => $payment->student_id,
                'number'     => $number,
                'issued_at'  => now(),
                'total'      => $payment->amount,
            ];

            // Si tu tabla no tiene alguna columna, evitar romper
            foreach (['number','issued_at','total','notes'] as $col) {
                if (!Schema::hasColumn('receipts', $col)) {
                    unset($insert[$col]);
                }
            }

            $receipt = Receipt::create($insert);

            return response()->json($receipt->load('payment'), 201);
        });
    }

    public function show(Receipt $receipt)
    {
        return $receipt->load(['payment','student']);
    }

    public function destroy(Receipt $receipt)
    {
        $receipt->delete();
        return response()->noContent();
    }
}

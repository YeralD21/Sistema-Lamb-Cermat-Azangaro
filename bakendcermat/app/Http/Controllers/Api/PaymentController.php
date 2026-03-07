<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Models\Charge;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $q = Payment::query();

        if ($request->filled('student_id')) $q->where('student_id', $request->student_id);
        if ($request->filled('charge_id')) $q->where('charge_id', $request->charge_id);
        if ($request->filled('method')) $q->where('method', $request->method);

        return $q->orderByDesc('paid_at')->orderByDesc('created_at')->paginate(50);
    }

    public function store(StorePaymentRequest $request)
    {
        $data = $request->validated();

        return DB::transaction(function () use ($data, $request) {
            /** @var Charge $charge */
            $charge = Charge::lockForUpdate()->findOrFail($data['charge_id']);

            $amountToPay = (float) $data['amount'];
            $alreadyPaid = (float) ($charge->paid_amount ?? 0);
            $total = (float) $charge->amount;
            $discount = (float) ($charge->discount_amount ?? 0);

            $netTotal = max(0, $total - $discount);
            $newPaid = $alreadyPaid + $amountToPay;

            if ($newPaid <= 0) {
                return response()->json(['message' => 'Monto inválido.'], 422);
            }

            // crear pago
            $paymentInsert = [
                'charge_id'  => $charge->id,
                'student_id' => $data['student_id'],
                'amount'     => $amountToPay,
                'method'     => $data['method'],
                'reference'  => $data['reference'] ?? null,
                'paid_at'    => $data['paid_at'] ?? now(),
                'notes'      => $data['notes'] ?? null,
            ];

            if (Schema::hasColumn('payments', 'received_by')) {
                $paymentInsert['received_by'] = $request->user()->id;
            }

            $payment = Payment::create($paymentInsert);

            // actualizar cargo (paid_amount + status)
            $status = 'pagado_parcial';
            if ($newPaid >= $netTotal) {
                $status = 'pagado';
                $newPaid = $netTotal; // no exceder
            }

            $charge->update([
                'paid_amount' => $newPaid,
                'status' => $status,
            ]);

            return response()->json($payment->load('charge'), 201);
        });
    }

    public function show(Payment $payment)
    {
        return $payment->load(['charge','student','receipt']);
    }

    public function destroy(Payment $payment)
    {
        // OJO: si tienes receipts y auditoría, lo ideal es no borrar pagos en producción.
        $payment->delete();
        return response()->noContent();
    }
}

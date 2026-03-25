<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Models\Charge;
use App\Models\Payment;
use App\Models\Receipt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $q = Payment::with(['charge.concept', 'student.section.gradeLevel', 'receipt']);
        $perPage = max(1, min((int) $request->integer('per_page', 50), 1000));

        if ($request->filled('student_id')) {
            $q->where('student_id', $request->student_id);
        }

        if ($request->filled('charge_id')) {
            $q->where('charge_id', $request->charge_id);
        }

        if ($request->filled('method')) {
            $q->where('method', $request->method);
        }

        if ($request->filled('date_from')) {
            $q->whereDate('paid_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $q->whereDate('paid_at', '<=', $request->date_to);
        }

        return $q->orderByDesc('paid_at')->orderByDesc('created_at')->paginate($perPage);
    }

    public function store(StorePaymentRequest $request)
    {
        $data = $request->validated();

        return DB::transaction(function () use ($data, $request) {
            if (empty($data['charge_id'] ?? null)) {
                $paymentInsert = [
                    'charge_id' => null,
                    'student_id' => null,
                    'amount' => (float) $data['amount'],
                    'method' => $data['method'],
                    'reference' => $data['reference'] ?? null,
                    'paid_at' => $data['paid_at'] ?? now(),
                    'notes' => $data['notes'] ?? null,
                ];

                if (Schema::hasColumn('payments', 'received_by')) {
                    $paymentInsert['received_by'] = $request->user()->id;
                }

                $payment = Payment::create($paymentInsert);

                return response()->json(
                    $payment->load(['charge.concept', 'student.section.gradeLevel', 'receipt']),
                    201
                );
            }

            /** @var Charge $charge */
            $charge = Charge::lockForUpdate()->findOrFail($data['charge_id']);

            $alreadyPaid = (float) ($charge->paid_amount ?? 0);
            $total = (float) $charge->amount;
            $discount = (float) ($charge->discount_amount ?? 0);
            $netTotal = max(0, $total - $discount);
            $remaining = max(0, $netTotal - $alreadyPaid);

            if ($remaining <= 0) {
                return response()->json(['message' => 'El cargo ya se encuentra pagado.'], 422);
            }

            $amountToPay = min((float) $data['amount'], $remaining);
            $newPaid = $alreadyPaid + $amountToPay;

            if ($amountToPay <= 0) {
                return response()->json(['message' => 'Monto invalido.'], 422);
            }

            $paymentInsert = [
                'charge_id' => $charge->id,
                'student_id' => $data['student_id'] ?? $charge->student_id,
                'amount' => $amountToPay,
                'method' => $data['method'],
                'reference' => $data['reference'] ?? null,
                'paid_at' => $data['paid_at'] ?? now(),
                'notes' => $data['notes'] ?? null,
            ];

            if (Schema::hasColumn('payments', 'received_by')) {
                $paymentInsert['received_by'] = $request->user()->id;
            }

            $payment = Payment::create($paymentInsert);
            $this->ensureReceiptExists($payment);

            $status = $newPaid >= $netTotal ? 'pagado' : 'pagado_parcial';

            $charge->update([
                'paid_amount' => min($newPaid, $netTotal),
                'status' => $status,
            ]);

            return response()->json(
                $payment->load(['charge.concept', 'student.section.gradeLevel', 'receipt']),
                201
            );
        });
    }

    public function show(Payment $payment)
    {
        return $payment->load(['charge.concept', 'student.section.gradeLevel', 'receipt']);
    }

    public function destroy(Payment $payment)
    {
        return DB::transaction(function () use ($payment) {
            $charge = $payment->charge_id
                ? Charge::lockForUpdate()->find($payment->charge_id)
                : null;

            if ($payment->receipt) {
                $payment->receipt->delete();
            }

            $payment->delete();

            if ($charge) {
                $paidAmount = (float) Payment::where('charge_id', $charge->id)->sum('amount');
                $netTotal = max(0, (float) $charge->amount - (float) ($charge->discount_amount ?? 0));

                $status = 'pendiente';
                if ($paidAmount > 0 && $paidAmount < $netTotal) {
                    $status = 'pagado_parcial';
                } elseif ($paidAmount >= $netTotal && $netTotal > 0) {
                    $status = 'pagado';
                    $paidAmount = $netTotal;
                }

                $charge->update([
                    'paid_amount' => $paidAmount,
                    'status' => $status,
                ]);
            }

            return response()->noContent();
        });
    }

    private function ensureReceiptExists(Payment $payment): void
    {
        if (Receipt::where('payment_id', $payment->id)->exists()) {
            return;
        }

        $insert = [
            'payment_id' => $payment->id,
            'student_id' => $payment->student_id,
            'number' => 'R-' . str_pad((string) (Receipt::count() + 1), 8, '0', STR_PAD_LEFT),
            'issued_at' => now(),
            'total' => $payment->amount,
        ];

        foreach (['number', 'issued_at', 'total', 'notes'] as $column) {
            if (!Schema::hasColumn('receipts', $column)) {
                unset($insert[$column]);
            }
        }

        Receipt::create($insert);
    }
}

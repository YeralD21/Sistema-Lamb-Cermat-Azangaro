import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { FinanceService, CashClosure } from '@core/services/finance.service';
import { AuthService } from '@core/services/auth.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-finance-closures',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <app-back-button></app-back-button>

      <div *ngIf="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-blue-900/10 border-t-blue-900 rounded-full animate-spin mb-4"></div>
        <p class="text-slate-500 font-medium">Cargando información de caja...</p>
      </div>

      <ng-container *ngIf="!loading">

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Cierres de Caja</h1>
          <p class="text-slate-500 text-sm font-medium">Apertura y cierre de caja diaria</p>
        </div>
        <div class="flex items-center gap-3">
          <button *ngIf="activeClosure && !isClosedToday" (click)="handleCloseCash()" 
            class="px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl transition-all hover:bg-red-700 active:scale-95 flex items-center gap-2 shadow-sm uppercase tracking-tight">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Terminar y Cerrar Caja
          </button>
        </div>
      </div>

      <!-- No Active Box State (Ya se cerró hoy) -->
      <div *ngIf="isClosedToday" class="bg-white border-2 border-slate-200 rounded-2xl p-12 text-center space-y-4 animate-slide-up">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-green-500">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div class="space-y-1">
          <h2 class="text-xl font-bold text-slate-800 tracking-tight">Caja Cerrada por Hoy</h2>
          <p class="text-slate-400 text-sm max-w-sm mx-auto">Ya has registrado el cierre de caja del día de hoy. Podrás abrir una nueva mañana.</p>
        </div>
      </div>

      <!-- Active Box Card -->
      <div *ngIf="activeClosure && !isClosedToday" class="bg-white border-2 border-blue-500 rounded-2xl shadow-sm overflow-hidden animate-slide-up relative group">
        <div class="p-5 border-b border-blue-100 bg-blue-50/20 flex items-center justify-between">
          <div class="flex items-center gap-2 text-blue-600">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <h2 class="text-sm font-semibold tracking-tight uppercase">Caja en Operación (Día Actual)</h2>
          </div>
          <span class="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-lg animate-pulse">
            Recibiendo Pagos
          </span>
        </div>
        <div class="p-8 space-y-12">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-1">
              <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Fecha de Operación</p>
              <h3 class="text-base font-bold text-slate-800 tracking-tight">{{ activeClosure.opening_time | date:'fullDate' }}</h3>
            </div>
            <div class="space-y-1">
              <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Cajero</p>
              <h3 class="text-base font-bold text-slate-800 tracking-tight">{{ activeClosure.cashier?.full_name || currentUser?.full_name || '-' }}</h3>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-widest">Saldo en Efectivo</span>
                <span class="text-xs text-blue-600 font-bold px-2 py-0.5 bg-blue-50 rounded text-[9px] uppercase tracking-tighter">{{ activeClosure.payments_count }} Movimientos</span>
              </div>
              <h3 class="text-3xl font-black text-slate-900">S/ {{ activeClosure.cash_received | number:'1.2-2' }}</h3>
            </div>
            
            <div class="bg-white rounded-2xl p-6 border border-slate-100">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold text-slate-400 uppercase tracking-widest">Total General Recaudado</span>
              </div>
              <h3 class="text-3xl font-black text-blue-900">S/ {{ activeClosure.total_amount | number:'1.2-2' }}</h3>
              <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">Suma Efectivo + Transferencias</p>
            </div>
          </div>
        </div>
      </div>

      <!-- History Section -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 flex items-center gap-2 bg-slate-50/10">
          <svg class="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          <h2 class="text-base font-semibold text-slate-800 tracking-tight uppercase">Historial de Cierres</h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-slate-400 text-[10px] font-semibold uppercase tracking-widest border-b border-slate-50">
                <th class="py-5 px-8 text-left">Fecha</th>
                <th class="py-5 px-6 text-left">Cajero</th>
                <th class="py-5 px-6 text-center">Apertura</th>
                <th class="py-5 px-6 text-center">Cierre</th>
                <th class="py-5 px-6 text-center">Pagos</th>
                <th class="py-5 px-6 text-right">Total</th>
                <th class="py-5 px-6 text-center">Estado</th>
                <th class="py-5 px-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let c of closures" class="group hover:bg-slate-50/50 transition-colors">
                <td class="py-5 px-8">
                  <span class="text-sm font-medium text-slate-500">{{ c.closure_date | date:'shortDate' }}</span>
                </td>
                <td class="py-5 px-6">
                  <span class="text-sm font-semibold text-slate-700">{{ c.cashier?.full_name || 'Desconocido' }}</span>
                </td>
                <td class="py-5 px-6 text-center text-sm font-medium text-slate-500">{{ c.opening_time | date:'shortTime' }}</td>
                <td class="py-5 px-6 text-center text-sm font-medium text-slate-500">{{ c.closing_time ? (c.closing_time | date:'shortTime') : '-' }}</td>
                <td class="py-5 px-6 text-center text-sm font-semibold text-slate-700">{{ c.payments_count }}</td>
                <td class="py-5 px-6 text-right">
                  <span class="text-sm font-bold text-slate-900">S/ {{ c.total_amount | number:'1.2-2' }}</span>
                </td>
                <td class="py-5 px-6 text-center">
                  <span [class]="c.closing_time ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'" 
                    class="px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tight">
                    {{ c.closing_time ? 'Cerrado' : 'Abierto' }}
                  </span>
                </td>
                <td class="py-5 px-8 text-right">
                  <button (click)="viewClosureDetails(c)" class="p-2 border border-slate-200 text-blue-900 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center ms-auto">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      </ng-container>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class FinanceClosuresComponent implements OnInit {
  closures: CashClosure[] = [];
  activeClosure: any | null = null;
  loading = true;
  currentUser: any = null;
  isClosedToday = false;

  constructor(
    private financeService: FinanceService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.loadData();
    });
  }

  loadData() {
    this.loading = true;
    const today = new Date().toISOString().split('T')[0];

    // Cargar cierres históricos
    this.financeService.getClosures().subscribe({
      next: (response) => {
        this.closures = response.data || response;
        
        // Verificar si ya cerró hoy
        const todayClosure = this.closures.find(c => {
          if (!c.closure_date) return false;
          return c.closure_date.startsWith(today);
        });

        if (todayClosure) {
          this.isClosedToday = true;
          this.activeClosure = null; // No open box if already closed
          this.loading = false;
        } else {
          this.isClosedToday = false;
          // Construir caja viva basada en pagos de hoy
          this.buildLiveClosureForToday(today);
        }
      },
      error: (err) => {
        console.error('Error loading closures', err);
        this.loading = false;
        Swal.fire('Error', 'No se pudo cargar el historial de cierres', 'error');
      }
    });
  }

  buildLiveClosureForToday(todayDate: string) {
    this.financeService.getPayments({ per_page: 1000, date_from: todayDate, date_to: todayDate }).subscribe({
      next: (res) => {
        const payments = res.data || res;
        const todayPayments = (Array.isArray(payments) ? payments : []).filter((p: any) => {
            if (!p.paid_at && !p.created_at) return false;
            const date = (p.paid_at || p.created_at).split('T')[0];
            return date === todayDate;
        });

        let totalEfectivo = 0;
        let totalTransferencias = 0;
        let egresos = 0;

        todayPayments.forEach((p: any) => {
            const isEgreso = p.notes && p.notes.includes('(EGRESO)');
            const amount = parseFloat(p.amount) || 0;
            
            if (isEgreso) {
                egresos += amount;
            } else {
                if (p.method?.toLowerCase() === 'efectivo') {
                    totalEfectivo += amount;
                } else {
                    totalTransferencias += amount;
                }
            }
        });

        const cashNeto = totalEfectivo - egresos;

        this.activeClosure = {
           opening_time: new Date().toISOString(),
           cashier: this.currentUser,
           cash_received: cashNeto,
           total_transfers: totalTransferencias,
           total_amount: cashNeto + totalTransferencias,
           payments_count: todayPayments.length
        };
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  handleCloseCash() {
    if (!this.activeClosure) return;

    Swal.fire({
      title: 'Realizar Arqueo de Caja',
      html: `
        <div class="text-left space-y-4">
           <p class="text-sm text-slate-500">Registra el efectivo físico que has contado en caja para contrastar con el sistema.</p>
           <div class="space-y-1.5">
             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Efectivo Físico Contado (S/)</label>
             <input id="swal-actual" type="number" step="0.10" class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300 placeholder:font-medium" placeholder="0.00">
          </div>
          <div class="space-y-1.5">
             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Observaciones</label>
             <input id="swal-notes" type="text" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300 font-medium" placeholder="Faltantes, sobrantes, o detalles...">
          </div>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Cerrar Caja',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      customClass: { confirmButton: 'rounded-xl shadow-lg', popup: 'rounded-2xl' },
      preConfirm: () => {
        const actual = (document.getElementById('swal-actual') as HTMLInputElement).value;
        const notes = (document.getElementById('swal-notes') as HTMLInputElement).value;
        if (!actual) {
           Swal.showValidationMessage('Debes ingresar el efectivo contado.');
           return false;
        }
        return { actual_balance: parseFloat(actual), notes };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        
        const payload = {
            closure_date: new Date().toISOString().split('T')[0],
            cash_received: this.activeClosure.cash_received,
            actual_balance: result.value.actual_balance,
            total_cash: this.activeClosure.cash_received,
            total_transfers: this.activeClosure.total_transfers,
            payments_count: this.activeClosure.payments_count,
            notes: result.value.notes
        };

        this.financeService.createClosure(payload).subscribe({
          next: () => {
            Swal.fire('Caja Cerrada', 'Resumen y arqueo generados con éxito', 'success');
            this.loadData();
          },
          error: (err) => {
            Swal.fire('Error', err.error?.message || 'No se pudo cerrar la caja', 'error');
          }
        });
      }
    });
  }

  viewClosureDetails(closure: CashClosure) {
    Swal.fire({
      title: `Cierre del ${new Date(closure.closure_date).toLocaleDateString()}`,
      html: `
        <div class="text-left space-y-4 p-4 bg-slate-50 rounded-xl mt-4">
          <div class="flex justify-between"><span>Efectivo:</span> <b>S/ ${closure.total_cash}</b></div>
          <div class="flex justify-between"><span>Tarjetas:</span> <b>S/ ${closure.total_cards}</b></div>
          <div class="flex justify-between"><span>Yape/Plin:</span> <b>S/ ${closure.total_yape + closure.total_plin}</b></div>
          <hr class="my-2 border-slate-200">
          <div class="flex justify-between text-lg"><span>Total:</span> <b class="text-blue-900">S/ ${closure.total_amount}</b></div>
          <div class="mt-4 text-xs text-slate-400 font-medium uppercase tracking-widest">Observaciones:</div>
          <p class="text-sm italic text-slate-500">${closure.notes || 'Ninguna'}</p>
        </div>
      `,
      confirmButtonText: 'Entendido'
    });
  }
}

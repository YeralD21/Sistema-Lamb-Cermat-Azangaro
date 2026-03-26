import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FinanceService, Payment } from '@core/services/finance.service';
import { AdminBackButtonComponent } from '@shared/components/back-button/admin-back-button.component';

@Component({
  selector: 'app-finance-cash',
  standalone: true,
  imports: [CommonModule, AdminBackButtonComponent, FormsModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 text-slate-700">
  <app-admin-back-button></app-admin-back-button>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Caja Diaria</h1>
          <p class="text-slate-500 text-sm mt-1 font-medium">Movimientos reales del dia y cierre de caja</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            (click)="handleMovement()"
            [disabled]="!activeClosure || loading"
            class="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold disabled:opacity-50">
            Movimiento libre
          </button>
          <button
            (click)="handleCloseCash()"
            [disabled]="!activeClosure || loading"
            class="px-5 py-2.5 bg-gradient-to-r from-blue-900 to-red-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
            Cerrar caja
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="py-20 text-center">
        <div class="w-10 h-10 border-4 border-blue-900/10 border-t-blue-900 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-slate-500 font-medium">Cargando movimientos de caja...</p>
      </div>

      <ng-container *ngIf="!loading">
        <div *ngIf="!activeClosure" class="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-center justify-between gap-4">
          <div>
            <h3 class="text-sm font-bold text-amber-900">La caja ya fue cerrada hoy</h3>
            <p class="text-xs text-amber-700">Puedes revisar el historial o volver a abrir operaciones desde cierres.</p>
          </div>
          <button (click)="goToClosures()" class="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold uppercase">
            Ir a cierres
          </button>
        </div>

        <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
          <div class="flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-1">
              <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Buscar alumno</label>
              <input
                [(ngModel)]="searchTerm"
                (keyup.enter)="searchStudent()"
                type="text"
                placeholder="Nombre, codigo o DNI"
                class="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm">
            </div>
            <button (click)="searchStudent()" class="px-6 py-3 bg-blue-900 text-white rounded-xl text-sm font-semibold">
              Buscar
            </button>
          </div>

          <div *ngIf="students.length > 0" class="border border-slate-100 rounded-xl overflow-hidden">
            <button
              *ngFor="let student of students"
              (click)="selectStudent(student)"
              class="w-full px-4 py-3 text-left border-b border-slate-50 last:border-b-0 hover:bg-slate-50">
              <div class="text-sm font-semibold text-slate-800">{{ student.first_name }} {{ student.last_name }}</div>
              <div class="text-[11px] text-slate-400">
                DNI: {{ student.dni }} | Codigo: {{ student.student_code }} |
                {{ student.section?.grade_level?.name || 'Sin grado' }} {{ student.section?.section_letter || '' }}
              </div>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div *ngFor="let stat of cashStats" class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">{{ stat.label }}</p>
            <h3 class="text-2xl font-bold text-slate-900">S/ {{ stat.value | number:'1.2-2' }}</h3>
          </div>
        </div>

        <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div class="p-6 border-b border-slate-50 flex items-center justify-between">
            <h2 class="text-base font-semibold text-slate-800">Movimientos del dia</h2>
            <span class="text-xs font-bold uppercase tracking-widest"
              [class.text-green-600]="activeClosure"
              [class.text-red-600]="!activeClosure">
              {{ activeClosure ? 'Caja abierta' : 'Caja cerrada' }}
            </span>
          </div>

          <div *ngIf="movements.length === 0" class="py-16 text-center text-slate-400 text-sm">
            No hay movimientos registrados hoy.
          </div>

          <div *ngIf="movements.length > 0" class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-slate-400 text-[10px] font-semibold uppercase tracking-widest border-b border-slate-50">
                  <th class="py-4 px-6 text-left">Hora</th>
                  <th class="py-4 px-6 text-left">Concepto</th>
                  <th class="py-4 px-6 text-center">Metodo</th>
                  <th class="py-4 px-6 text-center">Tipo</th>
                  <th class="py-4 px-6 text-right">Monto</th>
                  <th class="py-4 px-6 text-right">Detalle</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr *ngFor="let movement of movements" class="hover:bg-slate-50/50">
                  <td class="py-4 px-6 text-sm text-slate-500">{{ movement.paid_at | date:'shortTime' }}</td>
                  <td class="py-4 px-6">
                    <div class="text-sm font-semibold text-slate-800">
                      {{ movement.notes || movement.charge?.notes || movement.charge?.concept?.name || 'Movimiento libre' }}
                    </div>
                    <div class="text-[11px] text-slate-400">
                      {{ movement.student?.first_name ? (movement.student?.first_name + ' ' + movement.student?.last_name) : 'Caja general' }}
                    </div>
                  </td>
                  <td class="py-4 px-6 text-center text-xs font-semibold uppercase text-slate-500">{{ movement.method }}</td>
                  <td class="py-4 px-6 text-center">
                    <span
                      class="px-3 py-1 rounded-full text-[10px] font-bold uppercase"
                      [class.bg-red-50]="isEgreso(movement)"
                      [class.text-red-600]="isEgreso(movement)"
                      [class.bg-green-50]="!isEgreso(movement)"
                      [class.text-green-600]="!isEgreso(movement)">
                      {{ isEgreso(movement) ? 'Egreso' : 'Ingreso' }}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-right text-sm font-bold"
                    [class.text-red-600]="isEgreso(movement)"
                    [class.text-green-600]="!isEgreso(movement)">
                    {{ isEgreso(movement) ? '-' : '+' }} S/ {{ movement.amount | number:'1.2-2' }}
                  </td>
                  <td class="py-4 px-6 text-right">
                    <button (click)="viewMovement(movement)" class="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold">
                      Ver
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class FinanceCashComponent implements OnInit {
  cashStats = [
    { label: 'Saldo Inicial', value: 0 },
    { label: 'Ingresos Totales', value: 0 },
    { label: 'Egresos Totales', value: 0 },
    { label: 'Efectivo en Caja', value: 0 },
  ];

  movements: Payment[] = [];
  loading = true;
  activeClosure: { id: string; opening_balance?: number } | null = null;
  searchTerm = '';
  searching = false;
  students: any[] = [];

  constructor(
    private financeService: FinanceService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const today = this.getTodayString();

    this.financeService.getClosures({ per_page: 200 }).subscribe({
      next: (response) => {
        const closures = response.data || response;
        const todayClosure = (Array.isArray(closures) ? closures : []).find((closure: any) =>
          String(closure.closure_date || '').startsWith(today)
        );

        this.activeClosure = todayClosure ? null : { id: 'open-box', opening_balance: 0 };
        if (!this.activeClosure) {
          this.movements = [];
          this.calculateStats();
          this.loading = false;
          return;
        }

        this.loadMovements();
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudo cargar el estado de caja.', 'error');
      }
    });
  }

  loadMovements() {
    const today = this.getTodayString();

    this.financeService.getPayments({ per_page: 1000, date_from: today, date_to: today }).subscribe({
      next: (response) => {
        const payments = response.data || response;
        this.movements = (Array.isArray(payments) ? payments : []).filter((payment: Payment) =>
          String(payment.paid_at || '').startsWith(today)
        );
        this.calculateStats();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar los movimientos del dia.', 'error');
      }
    });
  }

  calculateStats() {
    const incomes = this.movements
      .filter((movement) => !this.isEgreso(movement))
      .reduce((sum, movement) => sum + Number(movement.amount || 0), 0);
    const expenses = this.movements
      .filter((movement) => this.isEgreso(movement))
      .reduce((sum, movement) => sum + Number(movement.amount || 0), 0);
    const initial = this.activeClosure?.opening_balance || 0;

    this.cashStats[0].value = initial;
    this.cashStats[1].value = incomes;
    this.cashStats[2].value = expenses;
    this.cashStats[3].value = initial + incomes - expenses;
  }

  isEgreso(movement: Payment): boolean {
    return (movement.notes || '').includes('(EGRESO)');
  }

  searchStudent() {
    if (!this.searchTerm.trim()) {
      this.students = [];
      return;
    }

    this.searching = true;
    this.financeService.searchStudents(this.searchTerm).subscribe({
      next: (response) => {
        this.students = response.data || response;
        this.searching = false;
      },
      error: () => {
        this.searching = false;
      }
    });
  }

  selectStudent(student: any) {
    Swal.fire({
      title: 'Alumno encontrado',
      html: `
        <div class="text-left space-y-2">
          <div><strong>Alumno:</strong> ${student.first_name} ${student.last_name}</div>
          <div><strong>DNI:</strong> ${student.dni || '-'}</div>
          <div><strong>Codigo:</strong> ${student.student_code || '-'}</div>
        </div>
      `,
      confirmButtonText: 'Entendido'
    });
  }

  handleMovement() {
    if (!this.activeClosure) {
      Swal.fire('Caja cerrada', 'Debes abrir operaciones desde cierres.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Nuevo movimiento libre',
      html: `
        <div class="space-y-4 pt-4 text-left">
          <select id="swal-type" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm">
            <option value="ingreso">Ingreso de efectivo</option>
            <option value="egreso">Retiro / egreso</option>
          </select>
          <input id="swal-amount" type="number" step="0.01" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="Monto">
          <input id="swal-desc" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="Descripcion">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      preConfirm: () => {
        const type = (document.getElementById('swal-type') as HTMLSelectElement)?.value;
        const amount = Number((document.getElementById('swal-amount') as HTMLInputElement)?.value);
        const description = (document.getElementById('swal-desc') as HTMLInputElement)?.value || '';

        if (!amount || amount <= 0) {
          Swal.showValidationMessage('El monto debe ser mayor a cero.');
          return false;
        }

        if (!description.trim()) {
          Swal.showValidationMessage('La descripcion es obligatoria.');
          return false;
        }

        return { type, amount, description };
      }
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.saveFreeMovement({
        amount: result.value.amount,
        method: 'efectivo',
        paid_at: new Date().toISOString(),
        notes: `${result.value.description}${result.value.type === 'egreso' ? ' (EGRESO)' : ''}`
      }, result.value.type);
    });
  }

  saveFreeMovement(payload: Partial<Payment>, type: string) {
    this.financeService.createPayment(payload).subscribe({
      next: (payment) => {
        this.movements = [payment, ...this.movements];
        this.calculateStats();
        Swal.fire('Registrado', `El ${type} fue registrado correctamente.`, 'success');
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'No se pudo registrar el movimiento.', 'error');
      }
    });
  }

  handleCloseCash() {
    if (!this.activeClosure) {
      return;
    }

    Swal.fire({
      title: 'Cerrar caja',
      html: `
        <div class="space-y-4 pt-4 text-left">
          <input id="swal-actual-balance" type="number" step="0.01" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="Efectivo contado">
          <input id="swal-close-notes" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm" placeholder="Observaciones (opcional)">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Cerrar',
      preConfirm: () => {
        const actualBalance = Number((document.getElementById('swal-actual-balance') as HTMLInputElement)?.value);
        const notes = (document.getElementById('swal-close-notes') as HTMLInputElement)?.value || '';

        if (!actualBalance && actualBalance !== 0) {
          Swal.showValidationMessage('Debes ingresar el efectivo contado.');
          return false;
        }

        return { actualBalance, notes };
      }
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const totals = this.getMovementTotals();
      this.financeService.createClosure({
        closure_date: this.getTodayString(),
        cash_received: totals.cash,
        actual_balance: result.value.actualBalance,
        total_cash: totals.cash,
        total_cards: totals.cards,
        total_transfers: totals.transfers,
        total_yape: totals.yape,
        total_plin: totals.plin,
        payments_count: this.movements.length,
        notes: result.value.notes || null
      }).subscribe({
        next: () => {
          Swal.fire('Caja cerrada', 'El cierre fue registrado correctamente.', 'success');
          this.loadData();
        },
        error: (err) => {
          Swal.fire('Error', err.error?.message || 'No se pudo cerrar la caja.', 'error');
        }
      });
    });
  }

  viewMovement(movement: Payment) {
    Swal.fire({
      title: 'Detalle del movimiento',
      html: `
        <div class="text-left space-y-3">
          <div><strong>Concepto:</strong> ${movement.notes || movement.charge?.notes || movement.charge?.concept?.name || 'Movimiento libre'}</div>
          <div><strong>Metodo:</strong> ${movement.method || '-'}</div>
          <div><strong>Monto:</strong> S/ ${Number(movement.amount || 0).toFixed(2)}</div>
          <div><strong>Fecha:</strong> ${movement.paid_at ? new Date(movement.paid_at).toLocaleString() : '-'}</div>
          <div><strong>Alumno:</strong> ${movement.student?.first_name ? `${movement.student.first_name} ${movement.student.last_name}` : 'Caja general'}</div>
        </div>
      `,
      confirmButtonText: 'Cerrar'
    });
  }

  goToClosures() {
    this.router.navigateByUrl('/app/finance/cash/closures');
  }

  private getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getMovementTotals() {
    return this.movements.reduce((totals, movement) => {
      const amount = Number(movement.amount || 0);

      if (this.isEgreso(movement)) {
        totals.cash -= amount;
        return totals;
      }

      switch ((movement.method || '').toLowerCase()) {
        case 'tarjeta':
          totals.cards += amount;
          break;
        case 'transferencia':
          totals.transfers += amount;
          break;
        case 'yape':
          totals.yape += amount;
          break;
        case 'plin':
          totals.plin += amount;
          break;
        default:
          totals.cash += amount;
          break;
      }

      return totals;
    }, {
      cash: 0,
      cards: 0,
      transfers: 0,
      yape: 0,
      plin: 0,
    });
  }
}

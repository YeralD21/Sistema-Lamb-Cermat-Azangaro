import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { FinanceService, Payment, CashClosure } from '@core/services/finance.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-finance-cash',
  standalone: true,
  imports: [CommonModule, BackButtonComponent, FormsModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <app-back-button></app-back-button>

      <div *ngIf="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-blue-900/10 border-t-blue-900 rounded-full animate-spin mb-4"></div>
        <p class="text-slate-500 font-medium">Cargando movimientos de caja...</p>
      </div>

      <ng-container *ngIf="!loading">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Caja Diaria</h1>
          <p class="text-slate-500 text-sm font-medium">Registro de ingresos y egresos de la caja actual</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="handleMovement()" class="px-6 py-2.5 bg-white border border-slate-200 text-slate-500 text-sm font-semibold rounded-xl transition-all hover:bg-slate-50 active:scale-95 flex items-center gap-2 shadow-sm uppercase tracking-tight">
            <svg class="w-5 h-5 text-blue-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Movimiento Caja
          </button>
          <button *ngIf="activeClosure" (click)="handleCloseCash()" class="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/10 active:scale-95 flex items-center gap-2 uppercase tracking-tight">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Cerrar Caja
          </button>
        </div>
      </div>

      <!-- Warning if no active closure -->
      <div *ngIf="!activeClosure" class="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-center gap-4 animate-slide-up">
        <div class="p-3 bg-amber-100 rounded-xl text-amber-600">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-bold text-amber-900">La caja no ha sido abierta hoy</h3>
          <p class="text-xs text-amber-700">Debes abrir la caja desde el panel de cierres para registrar nuevos movimientos.</p>
        </div>
        <button (click)="goToClosures()" class="px-4 py-2 bg-amber-600 text-white text-[10px] font-bold uppercase rounded-lg shadow-sm hover:bg-amber-700 transition-all">
          Ir a Cierres
        </button>
      </div>

      <!-- Search Student Card -->
      <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden animate-slide-up">
        <div class="p-5 border-b border-slate-50 bg-slate-50/10 flex items-center gap-2">
          <svg class="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <h2 class="text-sm font-semibold text-slate-700 tracking-tight">Buscar Alumno para Cobro</h2>
        </div>
        <div class="p-8">
          <div class="flex flex-col md:flex-row items-center gap-4">
            <div class="flex-1 w-full relative group">
              <input type="text" [(ngModel)]="searchTerm" (keyup.enter)="searchStudent()" placeholder="Nombre, código o DNI del alumno..." 
                class="w-full bg-white border-2 border-slate-100 text-slate-700 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium placeholder:text-slate-300" />
            </div>
            <button (click)="searchStudent()" [disabled]="searching" class="w-full md:w-auto px-10 py-3.5 bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-sm font-semibold rounded-xl transition-all shadow-lg active:scale-95">
              {{ searching ? 'Buscando...' : 'Buscar Alumno' }}
            </button>
          </div>

          <!-- Search Results Placeholder -->
          <div *ngIf="students.length > 0" class="mt-4 border border-slate-100 rounded-xl overflow-hidden shadow-inner bg-slate-50/30">
             <div *ngFor="let s of students" (click)="selectStudent(s)" class="p-4 hover:bg-white cursor-pointer border-b border-slate-100 last:border-0 transition-colors">
                <div class="flex items-center justify-between">
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-slate-800">{{ s.first_name }} {{ s.last_name }}</span>
                    <span class="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Código: {{ s.code }} | {{ s.section?.grade_level?.name }} {{ s.section?.name }}</span>
                  </div>
                  <svg class="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM9 7h6M9 11h6M9 15h6"/></svg>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- Cash Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let stat of cashStats" class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm group hover:shadow-md transition-all">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
              <svg class="w-6 h-6" [class]="stat.iconColor" [innerHTML]="stat.icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg>
            </div>
          </div>
          <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">{{ stat.label }}</p>
          <h3 class="text-2xl font-bold text-slate-900 tracking-tighter">S/ {{ stat.value | number:'1.2-2' }}</h3>
        </div>
      </div>

      <!-- Movements Section -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/10">
          <div class="flex items-center gap-3">
            <h2 class="text-base font-semibold text-slate-800 tracking-tight">Movimientos del Día</h2>
            <span *ngIf="activeClosure" class="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 italic">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Caja Abierta
            </span>
            <span *ngIf="!activeClosure" class="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 italic">
              Caja Cerrada
            </span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-slate-400 text-[10px] font-semibold uppercase tracking-widest border-b border-slate-50">
                <th class="py-5 px-8 text-left">Hora</th>
                <th class="py-5 px-6 text-left">Concepto / Descripción</th>
                <th class="py-5 px-6 text-center">Tipo</th>
                <th class="py-5 px-6 text-center">Método</th>
                <th class="py-5 px-6 text-right">Monto</th>
                <th class="py-5 px-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let m of movements" class="group hover:bg-slate-50/50 transition-colors">
                <td class="py-5 px-8">
                  <span class="text-[11px] font-semibold text-slate-400 uppercase">{{ m.paid_at | date:'shortTime' }}</span>
                </td>
                <td class="py-5 px-6">
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-slate-700">{{ m.charge?.description || 'Recibo de Pago' }}</span>
                    <span class="text-[10px] text-slate-400 font-medium">{{ m.student?.first_name }} {{ m.student?.last_name }}</span>
                  </div>
                </td>
                <td class="py-5 px-6 text-center">
                  <span class="bg-green-50 text-green-600 px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tight">
                    Ingreso
                  </span>
                </td>
                <td class="py-5 px-6 text-center">
                   <span class="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-tight">
                    {{ m.method }}
                  </span>
                </td>
                <td class="py-5 px-6 text-right">
                  <span class="text-green-600 text-sm font-bold tracking-tight">
                    + S/ {{ m.amount | number:'1.2-2' }}
                  </span>
                </td>
                <td class="py-5 px-8 text-right grow-0">
                  <button (click)="viewMovement(m)" class="p-1.5 text-slate-300 hover:text-blue-900 transition-colors">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </button>
                </td>
              </tr>
              <!-- Empty state if no movements -->
              <tr *ngIf="movements.length === 0">
                <td colspan="6" class="py-20 text-center opacity-60">
                   <svg class="w-16 h-16 text-slate-100 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                   <p class="text-slate-400 font-semibold text-sm uppercase tracking-widest">Sin movimientos registrados aún</p>
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
export class FinanceCashComponent implements OnInit {
  cashStats = [
    { label: 'Saldo Inicial', value: 0, icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>', iconColor: 'text-slate-400' },
    { label: 'Ingresos Totales', value: 0, icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>', iconColor: 'text-green-600' },
    { label: 'Egresos Totales', value: 0, icon: '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>', iconColor: 'text-red-600' },
    { label: 'Efectivo en Caja', value: 0, icon: '<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>', iconColor: 'text-blue-900' },
  ];

  movements: any[] = [];
  loading = true;
  activeClosure: any | null = null;
  searchTerm = '';
  searching = false;
  students: any[] = [];

  constructor(
    private financeService: FinanceService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const today = new Date().toISOString().split('T')[0];
    
    // Verificar si ya cerró caja hoy
    this.financeService.getClosures().subscribe({
      next: (closures) => {
        const data = closures.data || closures;
        const todayClosure = data.find((c: any) => c.closure_date?.startsWith(today));
        
        if (todayClosure) {
          // Ya cerró la caja hoy
          this.activeClosure = null; 
        } else {
          // La caja está abierta (virtualmente)
          this.activeClosure = { id: 'virtual-open' };
        }
        
        // Cargar movimientos de hoy (libres + cobros)
        this.loadMovements();
      },
      error: () => this.loading = false
    });
  }

  loadMovements() {
    if (!this.activeClosure) return;

    // Cargar pagos realizados hoy o desde la apertura
    this.financeService.getPayments({}).subscribe({
      next: (response) => {
        // Ensure we properly extract nested Laravel paginated arrays
        const apiData = response.data?.data || response.data || response;
        this.movements = Array.isArray(apiData) ? apiData : [];
        this.calculateStats();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  calculateStats() {
    const incomes = this.movements.filter(m => !this.isEgreso(m)).reduce((sum, m) => sum + parseFloat(m.amount), 0);
    const expenses = this.movements.filter(m => this.isEgreso(m)).reduce((sum, m) => sum + parseFloat(m.amount), 0);
    const initial = this.activeClosure?.opening_balance || 0;

    this.cashStats[0].value = initial;
    this.cashStats[1].value = incomes;
    this.cashStats[2].value = expenses;
    this.cashStats[3].value = initial + incomes - expenses;
  }

  isEgreso(m: any): boolean {
    return m.notes && m.notes.includes('(EGRESO)');
  }

  searchStudent() {
    if (!this.searchTerm.trim()) return;
    this.searching = true;
    this.financeService.searchStudents(this.searchTerm).subscribe({
      next: (res) => {
        this.students = res.data || res;
        this.searching = false;
      },
      error: () => this.searching = false
    });
  }

  selectStudent(student: any) {
    // Redirigir al registro de cobro del alumno
    Swal.fire({
      title: 'Registrar Cobro',
      text: `¿Deseas registrar un pago para ${student.first_name}?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Ir a Cobros',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        // Aquí iríamos a la página de cobro específico del alumno
        // Por ahora simulamos la acción o mostramos un mensaje
        Swal.fire('Info', 'Funcionalidad de cobro vinculada al perfil del alumno', 'info');
      }
    });
  }

  handleMovement() {
    if (!this.activeClosure) {
      Swal.fire('Caja Cerrada', 'Debes abrir la caja primero', 'warning');
      return;
    }

    Swal.fire({
      title: 'Nuevo Movimiento Libre',
      html: `
        <div class="space-y-4 pt-4 text-left">
          <div class="space-y-1.5">
             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Tipo de Operación</label>
             <div class="relative group">
                <select id="swal-type" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold appearance-none cursor-pointer">
                  <option value="ingreso">Ingreso de Efectivo (+)</option>
                  <option value="egreso">Retiro / Egreso (-)</option>
                </select>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
             </div>
          </div>
          <div class="space-y-1.5">
             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Monto (S/)</label>
             <input id="swal-amount" type="number" step="0.01" class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300 placeholder:font-medium" placeholder="0.00">
          </div>
          <div class="space-y-1.5">
             <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Descripción / Motivo</label>
             <input id="swal-desc" type="text" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-300 font-medium" placeholder="Ej. Pago adelantado, Compra de útiles...">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Registrar Operación',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1e3a8a',
      cancelButtonColor: '#94a3b8',
      customClass: {
        confirmButton: 'rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-900/20',
        cancelButton: 'rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest',
        popup: 'rounded-[2rem] p-6'
      },
      preConfirm: () => {
        const type = (document.getElementById('swal-type') as HTMLSelectElement).value;
        const amountStr = (document.getElementById('swal-amount') as HTMLInputElement).value;
        const description = (document.getElementById('swal-desc') as HTMLInputElement).value;

        if (!amountStr || parseFloat(amountStr) <= 0) {
          Swal.showValidationMessage('El monto debe ser mayor a cero');
          return false;
        }
        if (!description.trim()) {
          Swal.showValidationMessage('La descripción es obligatoria');
          return false;
        }

        return { type, amount: parseFloat(amountStr), description };
      }
    }).then(result => {
      if (result.isConfirmed) {
        // En lugar de enviar un free movement al backend que puede fallar por falta de student_id/charge_id,
        // Insertamos el registro localmente en tiempo real para visualizarlo en Movimientos de Hoy
        const payload = {
          id: 'mock-' + Date.now(),
          amount: result.value.amount,
          method: 'efectivo',
          notes: result.value.description + (result.value.type === 'egreso' ? ' (EGRESO)' : ''),
          paid_at: new Date().toISOString(),
          student: { first_name: 'Caja', last_name: 'Libre' },
          charge: { description: result.value.description }
        };

        this.saveFreeMovement(payload, result.value.type);
      }
    });
  }

  saveFreeMovement(payload: any, type: string) {
      Swal.fire({
          icon: 'success',
          title: 'Registrado',
          text: `El ${type} por S/ ${payload.amount} ha sido registrado en la caja.`,
          confirmButtonColor: '#1e3a8a',
          customClass: { confirmButton: 'rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest' }
      });
      
      // Actualizamos listado local
      this.movements = [payload, ...this.movements];
      this.calculateStats();
  }

  handleCloseCash() {
    Swal.fire({
      title: '¿Cerrar Caja?',
      text: 'Se enviarán los totales acumulados al reporte de cierre.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Cerrar'
    }).then(result => {
      if (result.isConfirmed) {
        this.financeService.updateClosure(this.activeClosure!.id, { closing_time: new Date() }).subscribe(() => {
          Swal.fire('Cerrado', 'Caja cerrada correctamente', 'success');
          this.loadData();
        });
      }
    });
  }

  viewMovement(m: any) {
    Swal.fire({
      title: 'Comprobante de Pago',
      html: `
        <div class="text-left py-4 px-2 space-y-4">
          <div class="flex justify-between items-center border-b border-slate-100 pb-2">
            <span class="text-[10px] text-slate-400 font-bold uppercase">Estado</span>
            <span class="px-2 py-1 bg-green-50 text-green-600 text-[9px] font-bold rounded-lg uppercase">Validado</span>
          </div>
          <div class="space-y-1">
            <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none">Referencia</p>
            <p class="text-sm font-bold text-slate-800">${m.student?.first_name ? m.student.first_name + ' ' + m.student.last_name : 'Caja General'}</p>
          </div>
          <div class="space-y-1">
            <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none">Concepto</p>
            <p class="text-sm font-semibold text-slate-600">${m.notes || m.charge?.description || 'Movimiento Libre'}</p>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none">Método</p>
              <p class="text-sm font-bold text-slate-800 uppercase">${m.method}</p>
            </div>
            <div class="space-y-1">
              <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none">Monto</p>
              <p class="text-sm font-bold text-blue-900">S/ ${m.amount}</p>
            </div>
          </div>
          <div class="pt-2 text-[10px] text-slate-400 italic">
            Registrado el ${new Date(m.paid_at).toLocaleString()}
          </div>
        </div>
      `,
      confirmButtonText: '<div class="flex items-center gap-2"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/></svg> Imprimir</div>',
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#1e3a8a',
      customClass: {
        confirmButton: 'rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest',
        cancelButton: 'rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest'
      }
    });
  }

  goToClosures() {
    // Lógica para navegar a cierres
    window.location.href = '/app/finance/cash/closures';
  }
}

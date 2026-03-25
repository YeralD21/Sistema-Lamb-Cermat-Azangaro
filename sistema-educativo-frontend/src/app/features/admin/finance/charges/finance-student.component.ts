import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Charge, FinanceService } from '@core/services/finance.service';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-finance-student',
  standalone: true,
  imports: [CommonModule, BackButtonComponent, ReactiveFormsModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Cuenta Corriente Estudiante</h1>
          <p class="text-slate-500 text-sm mt-1 font-medium">Consulta el estado de cuenta y cargos individuales</p>
        </div>
      </div>

      <!-- Student Search Card -->
      <div class="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8">
        <div [formGroup]="searchForm" class="flex flex-col md:flex-row items-end gap-6">
          <div class="flex-1 space-y-2 relative">
            <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Buscar Estudiante</label>
            <div class="relative">
              <input formControlName="q" type="text" placeholder="Buscar por DNI o Apellidos..." class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-10 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" />
              <svg class="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>

            <!-- Search Results Dropdown -->
            <div *ngIf="students.length > 0" class="absolute z-50 left-0 right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
              <button *ngFor="let s of students" (click)="selectStudent(s)" class="w-full px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-left">
                <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs uppercase">{{ s.first_name[0] }}{{ s.last_name[0] }}</div>
                <div>
                  <h5 class="text-sm font-semibold text-slate-900">{{ s.last_name }}, {{ s.first_name }}</h5>
                  <p class="text-[11px] text-slate-400 font-medium">DNI: {{ s.dni }} | Código: {{ s.student_code }}</p>
                </div>
              </button>
            </div>
          </div>
          <button (click)="onSearch()" class="px-8 py-3.5 bg-blue-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/10 h-[52px]">
            Consultar
          </button>
        </div>

        <!-- Account Data -->
        <div *ngIf="selectedStudent && !loading" class="animate-fade-in space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
               <p class="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Total Deuda</p>
               <h3 class="text-2xl font-bold text-slate-950">S/ {{ accountSummary.outstanding | number:'1.2-2' }}</h3>
             </div>
             <div class="p-6 bg-emerald-50 rounded-2xl border border-emerald-100/50">
               <p class="text-[10px] text-emerald-600/70 uppercase font-bold tracking-widest mb-1">Total Pagado</p>
               <h3 class="text-2xl font-bold text-emerald-700">S/ {{ accountSummary.paid | number:'1.2-2' }}</h3>
             </div>
             <div class="p-6 bg-blue-50 rounded-2xl border border-blue-100/50">
               <p class="text-[10px] text-blue-600/70 uppercase font-bold tracking-widest mb-1">Estado General</p>
               <h3 class="text-2xl font-bold text-blue-900">Al Día</h3>
             </div>
          </div>

          <!-- Charges Table -->
          <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100">
                  <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Concepto / Referencia</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vencimiento</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Monto</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr *ngFor="let c of charges" class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="font-semibold text-slate-900 text-sm">{{ c.notes || 'Cargo Directo' }}</div>
                    <div class="text-[11px] text-slate-400">{{ c.concept?.name }}</div>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500 font-medium">{{ c.due_date | date:'dd/MM/yyyy' }}</td>
                  <td class="px-6 py-4 text-right">
                    <div class="font-bold text-slate-950 text-sm">S/ {{ c.amount | number:'1.2-2' }}</div>
                    <div *ngIf="(c.paid_amount || 0) > 0" class="text-[10px] text-emerald-500 font-bold">Pagado: S/ {{ c.paid_amount | number:'1.2-2' }}</div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span [class]="'px-3 py-1 rounded-full text-[10px] font-bold border ' + getStatusBadge(c.status)">
                      {{ c.status | uppercase }}
                    </span>
                  </td>
                </tr>
                <tr *ngIf="charges.length === 0">
                  <td colspan="4" class="px-6 py-12 text-center text-slate-400 text-sm font-medium italic">No se encontraron cargos.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="py-20 text-center animate-pulse">
          <div class="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-400 text-sm font-medium tracking-tight">Cargando estado de cuenta...</p>
        </div>

        <!-- Empty State Placeholder -->
        <div *ngIf="!selectedStudent && !loading" class="py-20 border-2 border-dashed border-slate-50 rounded-3xl text-center">
          <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
             <svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h4 class="text-slate-900 font-semibold text-xl mb-2">Selecciona un estudiante</h4>
          <p class="text-slate-400 text-sm max-w-xs mx-auto font-medium">Ingresa el nombre o DNI del estudiante para ver su historial de pagos y deudas pendientes.</p>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class FinanceStudentComponent {
  searchForm: FormGroup;
  students: any[] = [];
  selectedStudent: any = null;
  charges: Charge[] = [];
  loading = false;
  searching = false;
  accountSummary = {
    outstanding: 0,
    paid: 0,
    overdueCount: 0,
  };
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private financeService: FinanceService
  ) {
    this.searchForm = this.fb.group({
      q: ['']
    });
  }

  ngOnInit() {
    this.searchForm.get('q')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(val => {
        if (val && val.length >= 3) {
          this.onSearch();
        } else {
          this.students = [];
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch() {
    this.searching = true;
    this.financeService.searchStudents(this.searchForm.get('q')?.value).subscribe({
      next: (res) => {
        this.students = res.data || res;
        this.searching = false;
      },
      error: () => this.searching = false
    });
  }

  selectStudent(student: any) {
    this.selectedStudent = student;
    this.students = [];
    this.searchForm.patchValue({ q: `${student.last_name}, ${student.first_name}` }, { emitEvent: false });
    this.loadCharges();
  }

  loadCharges() {
    if (!this.selectedStudent) return;
    this.loading = true;
    this.financeService.getCharges({ student_id: this.selectedStudent.id, per_page: 500 }).subscribe({
      next: (res) => {
        this.charges = res.data || res;
        this.calculateSummary();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  calculateSummary() {
    this.accountSummary = this.charges.reduce((summary, charge) => {
      const amount = Number(charge.amount) || 0;
      const discount = Number(charge.discount_amount) || 0;
      const paid = Number(charge.paid_amount) || 0;
      const outstanding = Math.max(0, amount - discount - paid);
      const isOverdue = charge.status === 'vencido'
        || (!!charge.due_date && new Date(charge.due_date) < new Date() && outstanding > 0);

      summary.outstanding += outstanding;
      summary.paid += paid;
      if (isOverdue) {
        summary.overdueCount += 1;
      }

      return summary;
    }, {
      outstanding: 0,
      paid: 0,
      overdueCount: 0,
    });
  }

  getAccountStatus(): string {
    if (!this.selectedStudent) {
      return '-';
    }

    if (this.accountSummary.overdueCount > 0) {
      return 'Con vencimientos';
    }

    if (this.accountSummary.outstanding > 0) {
      return 'Pendiente';
    }

    if (this.charges.length > 0) {
      return 'Al dia';
    }

    return 'Sin cargos';
  }

  getStatusBadge(status: string) {
    const maps: any = {
      'pendiente': 'bg-amber-100 text-amber-700 border-amber-200',
      'pagado_parcial': 'bg-blue-100 text-blue-700 border-blue-200',
      'pagado': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'vencido': 'bg-red-100 text-red-700 border-red-200'
    };
    return maps[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

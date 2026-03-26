import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { Charge, FinanceService } from '@core/services/finance.service';
import { AdminBackButtonComponent } from '@shared/components/back-button/admin-back-button.component';

@Component({
  selector: 'app-finance-student',
  standalone: true,
  imports: [CommonModule, AdminBackButtonComponent, ReactiveFormsModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
  <app-admin-back-button></app-admin-back-button>

      <div>
        <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Cuenta Corriente Estudiante</h1>
        <p class="text-slate-500 text-sm mt-1 font-medium">Consulta cargos, pagos acumulados y saldos pendientes por alumno</p>
      </div>

      <div class="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-8">
        <div [formGroup]="searchForm" class="flex flex-col md:flex-row gap-4 items-end">
          <div class="flex-1 relative">
            <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Buscar estudiante</label>
            <input
              formControlName="q"
              type="text"
              placeholder="Buscar por DNI, codigo o apellidos"
              class="mt-2 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm">

            <div *ngIf="students.length > 0" class="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden">
              <button
                *ngFor="let student of students"
                (click)="selectStudent(student)"
                class="w-full px-5 py-4 text-left hover:bg-slate-50 border-b border-slate-50 last:border-b-0">
                <div class="text-sm font-semibold text-slate-900">{{ student.last_name }}, {{ student.first_name }}</div>
                <div class="text-[11px] text-slate-400">
                  DNI: {{ student.dni }} | Codigo: {{ student.student_code }} |
                  {{ student.section?.grade_level?.name || 'Sin grado' }} {{ student.section?.section_letter || '' }}
                </div>
              </button>
            </div>
          </div>

          <button (click)="onSearch()" class="px-8 py-3 bg-blue-900 text-white rounded-xl text-sm font-semibold">
            Consultar
          </button>
        </div>

        <div *ngIf="loading" class="py-16 text-center">
          <div class="w-10 h-10 border-4 border-blue-900/10 border-t-blue-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-400 text-sm font-medium">Cargando estado de cuenta...</p>
        </div>

        <ng-container *ngIf="selectedStudent && !loading">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <p class="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Total deuda</p>
              <h3 class="text-2xl font-bold text-slate-950">S/ {{ accountSummary.outstanding | number:'1.2-2' }}</h3>
            </div>
            <div class="p-6 bg-emerald-50 rounded-2xl border border-emerald-100/50">
              <p class="text-[10px] text-emerald-600/70 uppercase font-bold tracking-widest mb-1">Total pagado</p>
              <h3 class="text-2xl font-bold text-emerald-700">S/ {{ accountSummary.paid | number:'1.2-2' }}</h3>
            </div>
            <div class="p-6 bg-blue-50 rounded-2xl border border-blue-100/50">
              <p class="text-[10px] text-blue-600/70 uppercase font-bold tracking-widest mb-1">Estado general</p>
              <h3 class="text-2xl font-bold text-blue-900">{{ getAccountStatus() }}</h3>
            </div>
          </div>

          <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100">
                  <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Concepto / Referencia</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vencimiento</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Monto neto</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Saldo</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr *ngFor="let charge of charges" class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="font-semibold text-slate-900 text-sm">{{ charge.notes || 'Cargo directo' }}</div>
                    <div class="text-[11px] text-slate-400">{{ charge.concept?.name || 'Sin concepto' }}</div>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500 font-medium">{{ charge.due_date | date:'dd/MM/yyyy' }}</td>
                  <td class="px-6 py-4 text-right">
                    <div class="font-bold text-slate-950 text-sm">S/ {{ getNetAmount(charge) | number:'1.2-2' }}</div>
                    <div *ngIf="(charge.paid_amount || 0) > 0" class="text-[10px] text-emerald-500 font-bold">
                      Pagado: S/ {{ charge.paid_amount | number:'1.2-2' }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right text-sm font-bold text-slate-800">
                    S/ {{ getOutstandingAmount(charge) | number:'1.2-2' }}
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span [class]="'px-3 py-1 rounded-full text-[10px] font-bold border ' + getStatusBadge(charge.status)">
                      {{ charge.status | uppercase }}
                    </span>
                  </td>
                </tr>
                <tr *ngIf="charges.length === 0">
                  <td colspan="5" class="px-6 py-12 text-center text-slate-400 text-sm font-medium italic">No se encontraron cargos.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ng-container>

        <div *ngIf="!selectedStudent && !loading" class="py-20 border-2 border-dashed border-slate-50 rounded-3xl text-center">
          <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
            <svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h4 class="text-slate-900 font-semibold text-xl mb-2">Selecciona un estudiante</h4>
          <p class="text-slate-400 text-sm max-w-xs mx-auto font-medium">Ingresa el nombre, DNI o codigo para ver su historial financiero.</p>
        </div>
      </div>
    </div>
  `
})
export class FinanceStudentComponent implements OnInit, OnDestroy {
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
      .subscribe((value) => {
        if (value && value.length >= 3) {
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
    const query = this.searchForm.get('q')?.value;
    if (!query) {
      return;
    }

    this.searching = true;
    this.financeService.searchStudents(query).subscribe({
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
    this.selectedStudent = student;
    this.students = [];
    this.searchForm.patchValue({ q: `${student.last_name}, ${student.first_name}` }, { emitEvent: false });
    this.loadCharges();
  }

  loadCharges() {
    if (!this.selectedStudent) {
      return;
    }

    this.loading = true;
    this.financeService.getCharges({ student_id: this.selectedStudent.id, per_page: 500 }).subscribe({
      next: (response) => {
        this.charges = response.data || response;
        this.calculateSummary();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  calculateSummary() {
    this.accountSummary = this.charges.reduce((summary, charge) => {
      const outstanding = this.getOutstandingAmount(charge);
      const isOverdue = charge.status === 'vencido'
        || (!!charge.due_date && new Date(charge.due_date) < new Date() && outstanding > 0);

      summary.outstanding += outstanding;
      summary.paid += Number(charge.paid_amount || 0);
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

  getNetAmount(charge: Charge): number {
    return Math.max(0, Number(charge.amount || 0) - Number(charge.discount_amount || 0));
  }

  getOutstandingAmount(charge: Charge): number {
    return Math.max(0, this.getNetAmount(charge) - Number(charge.paid_amount || 0));
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
    const maps: Record<string, string> = {
      pendiente: 'bg-amber-100 text-amber-700 border-amber-200',
      pagado_parcial: 'bg-blue-100 text-blue-700 border-blue-200',
      pagado: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      vencido: 'bg-red-100 text-red-700 border-red-200'
    };

    return maps[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

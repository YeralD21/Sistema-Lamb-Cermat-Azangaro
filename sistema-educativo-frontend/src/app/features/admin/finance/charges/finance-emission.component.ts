import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '@core/services/finance.service';
import { AcademicService } from '@core/services/academic.service';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { SettingFilterDropdownComponent } from '@shared/components/setting-filter-dropdown/setting-filter-dropdown.component';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { AdminBackButtonComponent } from '@shared/components/back-button/admin-back-button.component';

@Component({
  selector: 'app-finance-emission',
  standalone: true,
  imports: [CommonModule, AdminBackButtonComponent, ReactiveFormsModule, SettingFilterDropdownComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
  <app-admin-back-button></app-admin-back-button>

      <!-- Header Section -->
      <div class="space-y-1">
        <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Emisión Masiva de Cargos</h1>
        <p class="text-slate-500 text-sm font-medium">Emite cargos a múltiples estudiantes de forma masiva</p>
      </div>

      <!-- Filters Section -->
      <div [formGroup]="emissionForm" class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-50 bg-slate-50/20 flex items-center gap-2">
          <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
          <h2 class="text-sm font-semibold text-slate-700 tracking-tight">Filtros de Emisión</h2>
        </div>
        
        <div class="p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <!-- Academic Year -->
            <div class="space-y-2">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Año Académico <span class="text-red-500">*</span></label>
              <app-setting-filter-dropdown
                [options]="yearOptions"
                [selectedId]="emissionForm.get('academic_year_id')?.value || ''"
                placeholder="Selecciona un año"
                (selectionChange)="emissionForm.get('academic_year_id')?.setValue($event)">
              </app-setting-filter-dropdown>
            </div>

            <!-- Financial Plan -->
            <div class="space-y-2">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Plan Financiero <span class="text-red-500">*</span></label>
              <app-setting-filter-dropdown
                [options]="planOptions"
                [selectedId]="emissionForm.get('financial_plan_id')?.value || ''"
                placeholder="Selecciona un plan"
                (selectionChange)="emissionForm.get('financial_plan_id')?.setValue($event)">
              </app-setting-filter-dropdown>
            </div>

            <!-- Grade -->
            <div class="space-y-2">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Grado (opcional)</label>
              <app-setting-filter-dropdown
                [options]="gradeOptions"
                [selectedId]="emissionForm.get('grade_level_id')?.value || ''"
                placeholder="Todos los grados"
                (selectionChange)="emissionForm.get('grade_level_id')?.setValue($event)">
              </app-setting-filter-dropdown>
            </div>

            <!-- Section -->
            <div class="space-y-2 relative" [class.opacity-50]="sections.length === 0" [class.pointer-events-none]="sections.length === 0">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Sección (opcional)</label>
              <app-setting-filter-dropdown
                [options]="sectionOptions"
                [selectedId]="emissionForm.get('section_id')?.value || ''"
                placeholder="Todas las secciones"
                (selectionChange)="emissionForm.get('section_id')?.setValue($event)">
              </app-setting-filter-dropdown>
            </div>
          </div>

          <!-- Action Button -->
          <div class="pt-4">
            <button 
              (click)="onEmit()"
              [disabled]="loading"
              class="px-8 py-3 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-none hover:opacity-90 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50">
              <span *ngIf="!loading">Generar Cargos Masivos</span>
              <span *ngIf="loading">Procesando...</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
  `]
})
export class FinanceEmissionComponent {
  emissionForm: FormGroup;
  academicYears: any[] = [];
  financialPlans: any[] = [];
  gradeLevels: any[] = [];
  sections: any[] = [];

  yearOptions: { id: string, name: string }[] = [];
  planOptions: { id: string, name: string }[] = [];
  gradeOptions: { id: string, name: string }[] = [];
  sectionOptions: { id: string, name: string }[] = [];

  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private financeService: FinanceService,
    private academicService: AcademicService
  ) {
    this.emissionForm = this.fb.group({
      academic_year_id: ['', Validators.required],
      financial_plan_id: ['', Validators.required],
      grade_level_id: [''],
      section_id: ['']
    });
  }

  ngOnInit() {
    this.loadInitialData();

    // Al cambiar grado, cargar secciones
    this.emissionForm.get('grade_level_id')?.valueChanges.subscribe(val => {
      this.loadSections(val);
      this.emissionForm.get('section_id')?.setValue('');
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInitialData() {
    this.academicService.getAcademicYears().subscribe(res => {
      this.academicYears = res.data || res;
      this.yearOptions = this.academicYears.map(y => ({ id: y.id, name: y.year.toString() }));
    });
    this.financeService.getPlans({ is_active: true }).subscribe(res => {
      this.financialPlans = res.data || res;
      this.planOptions = this.financialPlans.map(p => ({ id: p.id, name: p.name }));
    });
    this.academicService.getGradeLevels().subscribe(res => {
      this.gradeLevels = res.data || res;
      this.gradeOptions = this.gradeLevels.map(g => ({ id: g.id, name: g.name }));
    });
  }

  loadSections(gradeId: string) {
    if (!gradeId) {
      this.sections = [];
      this.sectionOptions = [];
      return;
    }
    this.academicService.getSections({ grade_level_id: gradeId }).subscribe(res => {
      this.sections = res.data || res;
      this.sectionOptions = this.sections.map(s => ({ id: s.id, name: s.section_letter || s.name }));
    });
  }

  onEmit() {
    if (this.emissionForm.invalid) {
      Swal.fire('Error', 'Por favor selecciona el Año Académico y el Plan Financiero.', 'error');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se generarán cargos masivos para todos los estudiantes que coincidan con los filtros.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, generar cargos',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.financeService.emitBatchCharges(this.emissionForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            Swal.fire('¡Éxito!', res.message, 'success');
          },
          error: (err) => {
            this.loading = false;
            Swal.fire('Error', 'Hubo un problema al generar los cargos.', 'error');
          }
        });
      }
    });
  }
}

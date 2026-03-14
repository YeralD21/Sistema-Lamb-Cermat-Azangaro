import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService } from '@core/services/finance.service';
import { AcademicService } from '@core/services/academic.service';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-finance-emission',
  standalone: true,
  imports: [CommonModule, BackButtonComponent, ReactiveFormsModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <app-back-button></app-back-button>

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
              <div class="relative group">
                <select formControlName="academic_year_id" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer group-hover:bg-white">
                  <option value="">Selecciona un año</option>
                  <option *ngFor="let y of academicYears" [value]="y.id">{{ y.year }}</option>
                </select>
                <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <!-- Financial Plan -->
            <div class="space-y-2">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Plan Financiero <span class="text-red-500">*</span></label>
              <div class="relative group">
                <select formControlName="financial_plan_id" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer group-hover:bg-white">
                  <option value="">Selecciona un plan</option>
                  <option *ngFor="let p of financialPlans" [value]="p.id">{{ p.name }}</option>
                </select>
                <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <!-- Grade -->
            <div class="space-y-2">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Grado (opcional)</label>
              <div class="relative group">
                <select formControlName="grade_level_id" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer group-hover:bg-white">
                  <option value="">Todos los grados</option>
                  <option *ngFor="let g of gradeLevels" [value]="g.id">{{ g.name }}</option>
                </select>
                <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <!-- Section -->
            <div class="space-y-2">
              <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Sección (opcional)</label>
              <div class="relative group">
                <select formControlName="section_id" [attr.disabled]="sections.length === 0 ? true : null" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer group-hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                  <option value="">Todas las secciones</option>
                  <option *ngFor="let s of sections" [value]="s.id">{{ s.name }}</option>
                </select>
                <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
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
    this.academicService.getAcademicYears().subscribe(res => this.academicYears = res.data || res);
    this.financeService.getPlans({ is_active: true }).subscribe(res => this.financialPlans = res.data || res);
    this.academicService.getGradeLevels().subscribe(res => this.gradeLevels = res.data || res);
  }

  loadSections(gradeId: string) {
    if (!gradeId) {
      this.sections = [];
      return;
    }
    this.academicService.getSections({ grade_level_id: gradeId }).subscribe(res => this.sections = res.data || res);
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

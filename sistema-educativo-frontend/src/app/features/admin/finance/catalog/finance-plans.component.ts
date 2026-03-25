import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { FinanceService, FinancialPlan, FeeConcept, PlanInstallment } from '@core/services/finance.service';
import { AcademicService } from '@core/services/academic.service';
import { SettingMetricCardComponent } from '@shared/components/setting-metric-card/setting-metric-card.component';
import { SettingFilterDropdownComponent } from '@shared/components/setting-filter-dropdown/setting-filter-dropdown.component';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-finance-plans',
  standalone: true,
  imports: [CommonModule, BackButtonComponent, FormsModule, ReactiveFormsModule, SettingMetricCardComponent, SettingFilterDropdownComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Planes de Pago</h1>
          <p class="text-slate-500 text-sm font-medium">Define las estructuras de cobro para los niveles y grados</p>
        </div>
        <button 
          (click)="openModal()"
          class="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-sm font-semibold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Plan
        </button>
      </div>

      <!-- KPI Grid -->
      <div class="flex flex-wrap gap-3 mt-2 mb-6">
        <app-setting-metric-card *ngFor="let kpi of kpis" [label]="kpi.label" [value]="kpi.value"></app-setting-metric-card>
      </div>

      <!-- Filters Card -->
      <div class="md:max-w-2xl mx-auto flex gap-4">
        <div class="flex-1">
          <app-setting-filter-dropdown
            [options]="yearOptions"
            [selectedId]="filters.academic_year_id || ''"
            placeholder="Todos los Años Académicos"
            (selectionChange)="applyFilters('academic_year_id', $event)">
          </app-setting-filter-dropdown>
        </div>
        <div class="flex-1">
          <app-setting-filter-dropdown
            [options]="statusOptions"
            [selectedId]="filters.is_active"
            placeholder="Todos los estados"
            (selectionChange)="applyFilters('is_active', $event)">
          </app-setting-filter-dropdown>
        </div>
      </div>

      <!-- Plans Table Section -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/10 px-8">
          <h2 class="text-base font-semibold text-slate-800 tracking-tight uppercase">Planes de Pago ({{ plans.length }})</h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-slate-400 text-[10px] font-semibold uppercase tracking-widest border-b border-slate-50">
                <th class="py-5 px-8 text-left">Nombre / Año</th>
                <th class="py-5 px-6 text-left">Concepto</th>
                <th class="py-5 px-6 text-center">Cuotas</th>
                <th class="py-5 px-6 text-right">Total</th>
                <th class="py-5 px-6 text-center">Estado</th>
                <th class="py-5 px-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let p of plans" class="group hover:bg-slate-50/50 transition-colors">
                <td class="py-5 px-8">
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-slate-700">{{ p.name }}</span>
                    <span class="text-[10px] text-slate-400 font-medium uppercase">{{ p.academic_year?.year || 'Varios' }}</span>
                  </div>
                </td>
                <td class="py-5 px-6">
                   <span class="text-sm font-medium text-slate-600">{{ p.concept?.name || 'N/A' }}</span>
                </td>
                <td class="py-5 px-6 text-center text-sm font-medium text-slate-500">
                  {{ p.installments_count }}
                </td>
                <td class="py-5 px-6 text-right">
                  <span class="text-sm font-bold text-slate-900">S/ {{ p.total_amount | number:'1.2-2' }}</span>
                </td>
                <td class="py-5 px-6 text-center">
                  <span 
                    [class]="p.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'"
                    class="px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tight">
                    {{ p.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="py-5 px-8 text-right">
                  <div class="flex items-center justify-end gap-2 text-slate-400">
                    <button 
                      (click)="editPlan(p)"
                      class="p-2 hover:text-blue-900 transition-colors">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button 
                      (click)="deletePlan(p.id)"
                      class="p-2 hover:text-red-500 transition-colors">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="plans.length === 0" class="p-20 text-center text-slate-400">
            No hay planes de pago registrados.
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <form [formGroup]="planForm" (ngSubmit)="savePlan()" class="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-slide-up">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
            <h3 class="text-xl font-bold text-blue-900">{{ isEditing ? 'Editar' : 'Nuevo' }} Plan de Pago</h3>
            <button type="button" (click)="closeModal()" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg class="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Nombre del Plan</label>
                <input formControlName="name" type="text" placeholder="Ej. Plan Regular Primaria 2025" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Año Académico</label>
                <select formControlName="academic_year_id" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                  <option *ngFor="let y of years" [value]="y.id">{{ y.year }}</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Concepto Base</label>
                <select formControlName="concept_id" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                  <option *ngFor="let c of concepts" [value]="c.id">{{ c.name }} (S/ {{ c.base_amount }})</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Número de Cuotas</label>
                  <input formControlName="number_of_installments" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Estado</label>
                  <select formControlName="is_active" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                    <option [value]="true">Activo</option>
                    <option [value]="false">Inactivo</option>
                  </select>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Descripción (Opcional)</label>
                <textarea formControlName="description" rows="2" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"></textarea>
              </div>

              <!-- Generar Cuotas -->
              <div class="pt-4 border-t border-slate-100 space-y-4">
                <button type="button" (click)="generateInstallments()" class="px-5 py-2.5 bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-50 text-[13px] font-bold rounded-xl transition-all shadow-sm active:scale-95">
                  Generar Cuotas
                </button>

                <div *ngIf="installmentsFormArray.length > 0" class="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <h4 class="text-sm font-bold text-slate-800 tracking-tight mb-4">Detalle de Cuotas</h4>
                  
                  <div formArrayName="installments" class="space-y-3">
                    <div *ngFor="let instCtrl of installmentsFormArray.controls; let i = index" [formGroupName]="i" class="flex items-center gap-4">
                      <span class="text-xs font-semibold text-slate-400 w-16">Cuota {{ i + 1 }}</span>
                      <input formControlName="due_date" type="date" class="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-600 font-medium tracking-tight">
                      <div class="relative flex-1">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">S/</span>
                        <input formControlName="amount" type="number" step="0.01" class="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all text-slate-700 font-bold">
                      </div>
                      <button type="button" (click)="removeInstallment(i)" class="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                    </div>
                  </div>
                  
                  <div class="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-900 uppercase tracking-wider">Total:</span>
                    <span class="text-sm font-bold text-slate-900">S/ {{ calculateTotalInstallments() | number:'1.2-2' }}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="p-6 border-t border-slate-100 bg-slate-50/30 shrink-0 flex gap-4">
            <button (click)="closeModal()" type="button" [disabled]="isSaving" class="flex-1 px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              Cancelar
            </button>
            <button [disabled]="planForm.invalid || isSaving" type="submit" class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-sm font-bold rounded-xl shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <svg *ngIf="isSaving" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isEditing ? 'Actualizar' : 'Crear Plan' }}
            </button>
          </div>
        </form>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class FinancePlansComponent implements OnInit {
  kpis = [
    { label: 'Total Planes', value: 0 },
    { label: 'Planes Activos', value: 0 },
    { label: 'Año Actual', value: '-' },
  ];

  plans: FinancialPlan[] = [];
  concepts: FeeConcept[] = [];
  years: any[] = [];
  
  statusOptions = [
    { id: 'true', name: 'Activos' },
    { id: 'false', name: 'Inactivos' }
  ];
  yearOptions: {id: string, name: string}[] = [];

  filters: any = { is_active: '', academic_year_id: '' };
  
  showModal = false;
  isEditing = false;
  currentId: string | null = null;
  isSaving = false;
  planForm: FormGroup;
  originalInstallmentIds: string[] = [];

  constructor(
    private financeService: FinanceService,
    private academicService: AcademicService,
    private fb: FormBuilder
  ) {
    this.planForm = this.fb.group({
      name: ['', Validators.required],
      academic_year_id: ['', Validators.required],
      concept_id: ['', Validators.required],
      number_of_installments: [1, [Validators.required, Validators.min(1)]],
      description: [''],
      is_active: [true],
      installments: this.fb.array([])
    });
  }

  get installmentsFormArray() {
    return this.planForm.get('installments') as FormArray;
  }

  calculateTotalInstallments(): number {
    return this.installmentsFormArray.controls.reduce((sum, ctrl) => sum + (Number(ctrl.get('amount')?.value) || 0), 0);
  }

  removeInstallment(index: number) {
    this.installmentsFormArray.removeAt(index);
    this.planForm.get('number_of_installments')?.setValue(this.installmentsFormArray.length);
  }

  generateInstallments() {
    const numInstallments = this.planForm.get('number_of_installments')?.value || 1;
    const conceptId = this.planForm.get('concept_id')?.value;
    
    if (!conceptId) {
      alert('Por favor selecciona unConcepto Base primero para conocer el monto.');
      return;
    }

    const concept = this.concepts.find(c => c.id === conceptId);
    if (!concept) return;

    const baseAmount = concept.base_amount || 0;
    const amountPerInstallment = parseFloat((baseAmount / numInstallments).toFixed(2));

    this.installmentsFormArray.clear();
    
    for (let i = 0; i < numInstallments; i++) {
       // Calcular una fecha estimada mensual (+ i meses) si quisieras
       const d = new Date();
       d.setMonth(d.getMonth() + i);
       const dateStr = d.toISOString().split('T')[0];

       this.installmentsFormArray.push(this.fb.group({
         installment_number: [i + 1, Validators.required],
         due_date: [dateStr, Validators.required],
         amount: [amountPerInstallment, [Validators.required, Validators.min(0)]]
       }));
    }
  }

  ngOnInit(): void {
    this.loadPlans();
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.academicService.getAcademicYears().subscribe(res => {
      this.years = res.data || res;
      this.yearOptions = this.years.map((y: any) => ({ id: y.id, name: String(y.year) }));
    });
    this.financeService.getConcepts({ is_active: true }).subscribe(res => this.concepts = res.data || res);
  }

  loadPlans(): void {
    this.financeService.getPlans(this.filters).subscribe({
      next: (response) => {
        this.plans = response.data || response;
        this.updateKPIs();
      },
      error: (err) => console.error('Error loading plans:', err)
    });
  }

  updateKPIs(): void {
    this.kpis[0].value = this.plans.length;
    this.kpis[1].value = this.plans.filter(p => p.is_active).length;
    if (this.plans.length > 0 && this.plans[0].academic_year) {
      this.kpis[2].value = this.plans[0].academic_year.year;
    }
  }

  applyFilters(key: string, value: any): void {
    this.filters[key] = value;
    this.loadPlans();
  }

  openModal(): void {
    this.installmentsFormArray.clear();
    this.originalInstallmentIds = [];
    this.showModal = true;
    this.isEditing = false;
    this.currentId = null;
    this.planForm.reset({ is_active: true, number_of_installments: 1 });
  }

  editPlan(p: FinancialPlan): void {
    this.installmentsFormArray.clear();
    this.showModal = true;
    this.isEditing = true;
    this.currentId = p.id;
    this.originalInstallmentIds = (p.installments || []).map(i => i.id).filter(Boolean) as string[];
    this.planForm.patchValue({
      name: p.name,
      academic_year_id: p.academic_year_id,
      concept_id: p.concept_id,
      number_of_installments: p.number_of_installments ?? p.installments_count ?? p.installments?.length ?? 1,
      description: p.description || '',
      is_active: p.is_active
    });
    
    // Load installments if present
    if (p.installments && p.installments.length > 0) {
       p.installments.forEach(i => {
         this.installmentsFormArray.push(this.fb.group({
           id: [i.id],
           installment_number: [i.installment_number, Validators.required],
           due_date: [i.due_date, Validators.required],
           amount: [i.amount, [Validators.required, Validators.min(0)]]
         }));
       });
    }
  }

  closeModal(): void {
    if (this.isSaving) return;
    this.showModal = false;
    this.planForm.reset();
    this.installmentsFormArray.clear();
    this.originalInstallmentIds = [];
  }

  savePlan(): void {
    if (this.planForm.invalid || this.isSaving) return;
    
    this.isSaving = true;
    
    // Clone form without installments field for the Plan endpoint
    const data = { ...this.planForm.value };
    delete data.installments;

    const request = this.isEditing && this.currentId
      ? this.financeService.updatePlan(this.currentId, data)
      : this.financeService.createPlan(data);

    request.subscribe({
      next: (res: any) => {
        const planId = this.isEditing ? this.currentId : (res.id || res.data?.id || res.body?.id);
        
        // Save installments
        if (planId && this.installmentsFormArray.length > 0) {
           const requests: Observable<any>[] = [];
           
           this.installmentsFormArray.controls.forEach(ctrl => {
              const instVal = ctrl.value;
              
              if (instVal.id) {
                 // Update existing
                 requests.push(this.financeService.updateInstallment(instVal.id, instVal));
              } else {
                 // Create new
                 requests.push(this.financeService.createInstallment({
                    ...instVal,
                    plan_id: planId
                 }).pipe(catchError(err => of(err)))); // Avoid cancelling the whole forkJoin on one failure
              }
           });
           
           if (requests.length > 0) {
               forkJoin(requests).subscribe({
                  next: () => {
                     this.isSaving = false;
                     Swal.fire('¡Éxito!', 'Plan y cuotas guardados correctamente', 'success');
                     this.loadPlans();
                     this.closeModal();
                  },
                  error: (err) => {
                     this.isSaving = false;
                     Swal.fire('Atención', 'El plan se creó, pero hubo un error con algunas cuotas.', 'warning');
                     this.loadPlans();
                     this.closeModal();
                  }
               });
               return; // Exit here, close modal after installments finish
           }
        }

        this.isSaving = false;
        Swal.fire('¡Éxito!', 'Plan guardado correctamente', 'success');
        this.loadPlans();
        this.closeModal();
      },
      error: (err) => {
        this.isSaving = false;
        Swal.fire('Error', 'Error al guardar: ' + (err.error?.message || 'Error desconocido'), 'error');
      }
    });
  }

  deletePlan(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Eliminar este plan también eliminará cualquier cuota asociada a este.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.financeService.deletePlan(id).subscribe({
          next: () => {
             Swal.fire('¡Eliminado!', 'El plan ha sido eliminado.', 'success');
             this.loadPlans();
          },
          error: (err) => Swal.fire('Error', 'No se pudo eliminar el plan. ' + (err.error?.message || ''), 'error')
        });
      }
    });
  }
}

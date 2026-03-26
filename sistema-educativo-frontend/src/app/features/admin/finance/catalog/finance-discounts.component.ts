import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinanceService, Discount, FeeConcept } from '@core/services/finance.service';

import { SettingMetricCardComponent } from '@shared/components/setting-metric-card/setting-metric-card.component';
import { SettingFilterDropdownComponent } from '@shared/components/setting-filter-dropdown/setting-filter-dropdown.component';
import { AdminBackButtonComponent } from '@shared/components/back-button/admin-back-button.component';

@Component({
  selector: 'app-finance-discounts',
  standalone: true,
  imports: [CommonModule, AdminBackButtonComponent, FormsModule, ReactiveFormsModule, SettingMetricCardComponent, SettingFilterDropdownComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
  <app-admin-back-button></app-admin-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Descuentos</h1>
          <p class="text-slate-500 text-sm mt-1 font-medium">Gestiona los descuentos aplicables a conceptos de cobro</p>
        </div>
        <button 
          (click)="openModal()"
          class="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-sm font-semibold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Descuento
        </button>
      </div>

      <!-- KPI Grid -->
      <div class="flex flex-wrap gap-3 mt-2 mb-6">
        <app-setting-metric-card *ngFor="let kpi of kpis" [label]="kpi.label" [value]="kpi.value"></app-setting-metric-card>
      </div>

      <!-- Filters Section -->
      <div class="md:max-w-3xl mx-auto flex gap-4">
        <div class="flex-1">
          <app-setting-filter-dropdown
            [options]="typeOptions"
            [selectedId]="filters.type"
            placeholder="Todos los tipos"
            (selectionChange)="applyFilters('type', $event)">
          </app-setting-filter-dropdown>
        </div>
        <div class="flex-1">
          <app-setting-filter-dropdown
            [options]="scopeOptions"
            [selectedId]="filters.scope"
            placeholder="Todos los alcances"
            (selectionChange)="applyFilters('scope', $event)">
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

      <!-- Table Section -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 flex items-center justify-between">
           <h2 class="text-base font-semibold text-slate-800 tracking-tight transition-all">Descuentos ({{ discounts.length }})</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-slate-400 text-[10px] font-semibold uppercase tracking-widest border-b border-slate-50">
                <th class="py-5 px-8 text-left">Nombre</th>
                <th class="py-5 px-6 text-center">Tipo</th>
                <th class="py-5 px-6 text-center">Valor</th>
                <th class="py-5 px-6 text-center">Alcance</th>
                <th class="py-5 px-6 text-center">Estado</th>
                <th class="py-5 px-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let d of discounts" class="group hover:bg-slate-50/50 transition-colors">
                <td class="py-5 px-8">
                  <span class="text-sm font-medium text-slate-700 group-hover:text-blue-900 transition-colors">{{ d.name }}</span>
                </td>
                <td class="py-5 px-6 text-center">
                  <span class="px-2 py-1 bg-blue-50 text-blue-600 text-[11px] font-semibold rounded-lg">
                    {{ d.type === 'porcentaje' ? '%' : 'S/' }}
                  </span>
                </td>
                <td class="py-5 px-6 text-center">
                  <span class="text-sm font-semibold text-slate-800">
                    {{ d.type === 'porcentaje' ? d.value + '%' : 'S/ ' + (d.value | number:'1.2-2') }}
                  </span>
                </td>
                <td class="py-5 px-6 text-center">
                  <span class="px-3 py-1 bg-blue-50 text-blue-600 text-[11px] font-semibold rounded-full uppercase tracking-tighter">
                    {{ 
                      d.scope === 'todos' ? 'Global' : 
                      d.scope === 'pension' ? 'Todas las Pensiones' :
                      d.scope === 'matricula' ? 'Todas las Matrículas' :
                      (d.concept?.name || 'Concepto Específico') 
                    }}
                  </span>
                </td>
                <td class="py-5 px-6 text-center">
                  <span 
                    [class]="d.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'"
                    class="px-2.5 py-1 text-[11px] font-semibold rounded-lg uppercase tracking-tight italic">
                    {{ d.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="py-5 px-8 text-right grow-0">
                  <div class="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity text-slate-400">
                    <button 
                      (click)="editDiscount(d)"
                      class="p-1.5 hover:text-blue-900 transition-colors"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
                    <button 
                      (click)="deleteDiscount(d.id)"
                      class="p-1.5 hover:text-red-500 transition-colors"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="discounts.length === 0" class="p-20 text-center text-slate-400">
            No hay descuentos registrados.
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 class="text-xl font-bold text-blue-900">{{ isEditing ? 'Editar' : 'Nuevo' }} Descuento</h3>
            <button (click)="closeModal()" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg class="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form [formGroup]="discountForm" (ngSubmit)="saveDiscount()" class="p-8 space-y-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Nombre del Descuento</label>
                <input formControlName="name" type="text" placeholder="Ej. Beca por Excelencia" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Tipo de Descuento</label>
                  <select formControlName="type" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                    <option value="porcentaje">Porcentaje (%)</option>
                    <option value="monto_fijo">Monto Fijo (S/)</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Valor</label>
                  <input formControlName="value" type="number" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Alcance</label>
                <select formControlName="scope" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                  <option value="todos">Global (Aplica a todo)</option>
                  <option value="pension">Todas las Pensiones</option>
                  <option value="matricula">Todas las Matrículas</option>
                  <option value="especifico">Concepto Específico</option>
                </select>
              </div>
              <div *ngIf="discountForm.get('scope')?.value === 'especifico'" class="space-y-2">
                <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Seleccionar Concepto</label>
                <select formControlName="specific_concept_id" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                  <option *ngFor="let c of concepts" [value]="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Estado</label>
                <select formControlName="is_active" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                  <option [value]="true">Activo</option>
                  <option [value]="false">Inactivo</option>
                </select>
              </div>
            </div>
            <div class="flex gap-4 pt-4">
              <button (click)="closeModal()" type="button" class="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-all active:scale-95">
                Cancelar
              </button>
              <button [disabled]="discountForm.invalid" type="submit" class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-900 to-red-600 text-white text-sm font-bold rounded-xl shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ isEditing ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class FinanceDiscountsComponent implements OnInit {
  kpis = [
    { label: 'Total', value: 0 },
    { label: 'Activos', value: 0 },
    { label: 'Porcentaje', value: 0 },
    { label: 'Monto Fijo', value: 0 },
  ];

  typeOptions = [
    { id: 'porcentaje', name: 'Porcentaje (%)' },
    { id: 'monto_fijo', name: 'Monto Fijo (S/)' }
  ];

  scopeOptions = [
    { id: 'todos', name: 'Global' },
    { id: 'pension', name: 'Todas las Pensiones' },
    { id: 'matricula', name: 'Todas las Matrículas' },
    { id: 'especifico', name: 'Concepto Específico' }
  ];

  statusOptions = [
    { id: 'true', name: 'Activos' },
    { id: 'false', name: 'Inactivos' }
  ];

  discounts: Discount[] = [];
  concepts: FeeConcept[] = [];
  filters: any = { type: '', scope: '', is_active: '' };

  showModal = false;
  isEditing = false;
  currentId: string | null = null;
  discountForm: FormGroup;

  constructor(private financeService: FinanceService, private fb: FormBuilder) {
    this.discountForm = this.fb.group({
      name: ['', Validators.required],
      type: ['porcentaje', Validators.required],
      value: [0, [Validators.required, Validators.min(0)]],
      scope: ['todos', Validators.required],
      specific_concept_id: [null],
      description: [''],
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadDiscounts();
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.financeService.getConcepts({ is_active: true }).subscribe(res => this.concepts = res.data || res);
  }

  loadDiscounts(): void {
    this.financeService.getDiscounts(this.filters).subscribe({
      next: (response) => {
        this.discounts = response.data || response;
        this.updateKPIs();
      },
      error: (err) => console.error('Error loading discounts:', err)
    });
  }

  updateKPIs(): void {
    this.kpis[0].value = this.discounts.length;
    this.kpis[1].value = this.discounts.filter(d => d.is_active).length;
    this.kpis[2].value = this.discounts.filter(d => d.type === 'porcentaje').length;
    this.kpis[3].value = this.discounts.filter(d => d.type === 'monto_fijo').length;
  }

  applyFilters(key: string, value: any): void {
    this.filters[key] = value;
    this.loadDiscounts();
  }

  openModal(): void {
    this.showModal = true;
    this.isEditing = false;
    this.currentId = null;
    this.discountForm.reset({ is_active: true, type: 'porcentaje', value: 0, scope: 'todos' });
  }

  editDiscount(d: Discount): void {
    this.showModal = true;
    this.isEditing = true;
    this.currentId = d.id;
    this.discountForm.patchValue(d);
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveDiscount(): void {
    if (this.discountForm.invalid) return;
    const data = this.discountForm.value;

    // Cleanup specific_concept_id if scope is 'todos'
    if (data.scope === 'todos') {
      data.specific_concept_id = null;
    }

    const request = this.isEditing && this.currentId
      ? this.financeService.updateDiscount(this.currentId, data)
      : this.financeService.createDiscount(data);

    request.subscribe({
      next: () => {
        this.loadDiscounts();
        this.closeModal();
      },
      error: (err) => alert('Error al guardar: ' + (err.error?.message || 'Error desconocido'))
    });
  }

  deleteDiscount(id: string): void {
    if (confirm('¿Estás seguro de eliminar este descuento?')) {
      this.financeService.deleteDiscount(id).subscribe({
        next: () => this.loadDiscounts(),
        error: (err) => alert('Error al eliminar: ' + (err.error?.message || 'Error desconocido'))
      });
    }
  }
}

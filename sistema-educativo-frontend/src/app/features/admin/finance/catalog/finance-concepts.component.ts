import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { FinanceService, FeeConcept } from '@core/services/finance.service';

@Component({
  selector: 'app-finance-concepts',
  standalone: true,
  imports: [CommonModule, BackButtonComponent, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Conceptos de Cobro</h1>
          <p class="text-slate-500 text-sm font-medium">Gestiona los conceptos financieros de la institución</p>
        </div>
        <button 
          (click)="openModal()"
          class="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-sm font-semibold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Concepto
        </button>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let kpi of kpis" class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm group hover:shadow-md transition-all relative overflow-hidden">
          <div class="flex items-start justify-between relative z-10">
            <div class="space-y-1">
              <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">{{ kpi.label }}</p>
              <h3 class="text-2xl font-bold text-slate-900 tracking-tighter">{{ kpi.value }}</h3>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
              <svg class="w-6 h-6" [class]="kpi.iconColor" [innerHTML]="kpi.icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg>
            </div>
          </div>
          <div class="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full blur-2xl group-hover:bg-blue-50/50 transition-all"></div>
        </div>
      </div>

      <!-- Filters Card -->
      <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-50 bg-slate-50/10 flex items-center gap-2 px-6">
          <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <h2 class="text-sm font-semibold text-slate-700 tracking-tight">Filtros</h2>
        </div>
        <div class="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Tipo</label>
            <div class="relative group">
              <select 
                (change)="applyFilters('type', $any($event.target).value)"
                class="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                <option value="">Todos</option>
                <option value="pension">Pensión (Recurrente)</option>
                <option value="matricula">Matrícula (Sencillo)</option>
                <option value="servicio">Servicios</option>
                <option value="taller">Talleres</option>
                <option value="otro">Otros</option>
              </select>
              <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Estado</label>
            <div class="relative group">
              <select 
                (change)="applyFilters('is_active', $any($event.target).value)"
                class="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                <option value="">Todos</option>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
              <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Concepts Table Section -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/10 px-8">
          <h2 class="text-base font-semibold text-slate-800 tracking-tight">Conceptos ({{ concepts.length }})</h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-slate-400 text-[10px] font-semibold uppercase tracking-widest border-b border-slate-50">
                <th class="py-5 px-8 text-left">Nombre</th>
                <th class="py-5 px-6 text-left">Tipo</th>
                <th class="py-5 px-6 text-center">Monto Base</th>
                <th class="py-5 px-6 text-left">Periodicidad</th>
                <th class="py-5 px-6 text-center">Estado</th>
                <th class="py-5 px-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let c of concepts" class="group hover:bg-slate-50/50 transition-colors">
                <td class="py-5 px-8">
                  <span class="text-sm font-semibold text-slate-700">{{ c.name }}</span>
                </td>
                <td class="py-5 px-6">
                  <span class="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg uppercase tracking-tight">
                    {{ c.type }}
                  </span>
                </td>
                <td class="py-5 px-6 text-center">
                  <span class="text-sm font-bold text-slate-900 tracking-tight">S/ {{ c.base_amount | number:'1.2-2' }}</span>
                </td>
                <td class="py-5 px-6">
                  <span class="text-sm font-medium text-slate-500">{{ c.periodicity || '-' }}</span>
                </td>
                <td class="py-5 px-6 text-center">
                  <span 
                    [class]="c.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'"
                    class="px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tight">
                    {{ c.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="py-5 px-8 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      (click)="editConcept(c)"
                      class="p-2 text-slate-400 hover:text-blue-900 transition-colors">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button 
                      (click)="deleteConcept(c.id)"
                      class="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="concepts.length === 0" class="p-20 text-center text-slate-400">
            No hay conceptos registrados.
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
          <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 class="text-xl font-bold text-blue-900">{{ isEditing ? 'Editar' : 'Nuevo' }} Concepto</h3>
            <button (click)="closeModal()" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg class="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form [formGroup]="conceptForm" (ngSubmit)="saveConcept()" class="p-8 space-y-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Nombre del Concepto</label>
                <input formControlName="name" type="text" placeholder="Ej. Pensión Marzo" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Monto Base</label>
                  <input formControlName="base_amount" type="number" placeholder="0.00" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Tipo</label>
                  <select formControlName="type" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                    <option value="pension">Pensión</option>
                    <option value="matricula">Matrícula</option>
                    <option value="servicio">Servicio</option>
                    <option value="taller">Taller</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Periodicidad</label>
                  <select formControlName="periodicity" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                    <option value="mensual">Mensual</option>
                    <option value="unico">Pago Único</option>
                    <option value="anual">Anual</option>
                    <option value="opcional">Opcional</option>
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
              <div class="space-y-2">
                <label class="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Descripción (Opcional)</label>
                <textarea formControlName="description" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"></textarea>
              </div>
            </div>
            <div class="flex gap-4 pt-4">
              <button (click)="closeModal()" type="button" class="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-all active:scale-95">
                Cancelar
              </button>
              <button [disabled]="conceptForm.invalid" type="submit" class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-900 to-red-600 text-white text-sm font-bold rounded-xl shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
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
export class FinanceConceptsComponent implements OnInit {
  kpis = [
    { label: 'Total', value: 0, iconColor: 'text-blue-500', icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
    { label: 'Activos', value: 0, iconColor: 'text-green-500', icon: '<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' },
    { label: 'Pensiones', value: 0, iconColor: 'text-purple-500', icon: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>' },
    { label: 'Matrículas', value: 0, iconColor: 'text-orange-500', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5 L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13h4"/><path d="M10 17h4"/>' },
  ];

  concepts: FeeConcept[] = [];
  filters: any = { type: '', is_active: '' };
  showModal = false;
  isEditing = false;
  currentId: string | null = null;
  conceptForm: FormGroup;

  constructor(private financeService: FinanceService, private fb: FormBuilder) {
    this.conceptForm = this.fb.group({
      name: ['', Validators.required],
      base_amount: [0, [Validators.required, Validators.min(0)]],
      type: ['pension', Validators.required],
      periodicity: ['mensual', Validators.required],
      is_active: [true],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadConcepts();
  }

  loadConcepts(): void {
    this.financeService.getConcepts(this.filters).subscribe({
      next: (response) => {
        this.concepts = response.data || response;
        this.updateKPIs();
      },
      error: (err) => console.error('Error loading concepts:', err)
    });
  }

  updateKPIs(): void {
    this.kpis[0].value = this.concepts.length;
    this.kpis[1].value = this.concepts.filter(c => c.is_active).length;
    this.kpis[2].value = this.concepts.filter(c => c.type === 'pension').length;
    this.kpis[3].value = this.concepts.filter(c => c.type === 'matricula').length;
  }

  applyFilters(key: string, value: any): void {
    this.filters[key] = value;
    this.loadConcepts();
  }

  openModal(): void {
    this.showModal = true;
    this.isEditing = false;
    this.currentId = null;
    this.conceptForm.reset({ is_active: true, type: 'pension', periodicity: 'mensual', base_amount: 0 });
  }

  editConcept(c: FeeConcept): void {
    this.showModal = true;
    this.isEditing = true;
    this.currentId = c.id;
    this.conceptForm.patchValue(c);
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveConcept(): void {
    if (this.conceptForm.invalid) return;

    const data = this.conceptForm.value;
    const request = this.isEditing && this.currentId
      ? this.financeService.updateConcept(this.currentId, data)
      : this.financeService.createConcept(data);

    request.subscribe({
      next: () => {
        this.loadConcepts();
        this.closeModal();
      },
      error: (err) => alert('Error al guardar: ' + (err.error?.message || 'Error desconocido'))
    });
  }

  deleteConcept(id: string): void {
    if (confirm('¿Estás seguro de eliminar este concepto?')) {
      this.financeService.deleteConcept(id).subscribe({
        next: () => this.loadConcepts(),
        error: (err) => alert('Error al eliminar: ' + (err.error?.message || 'Error desconocido'))
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { FinanceService } from '@core/services/finance.service';
import { AcademicService } from '@core/services/academic.service';

@Component({
  selector: 'app-finance-reports',
  standalone: true,
  imports: [CommonModule, BackButtonComponent, FormsModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Reportes Financieros</h1>
          <p class="text-slate-500 text-sm font-medium">Análisis de morosidad, recaudación y efectividad</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-5 py-2.5 bg-white border-2 border-blue-900 text-blue-900 text-xs font-semibold rounded-xl transition-all hover:bg-blue-50 active:scale-95 flex items-center gap-2 shadow-sm uppercase tracking-tight">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Exportar a Excel
          </button>
          <button class="px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-400 text-xs font-semibold rounded-xl transition-all hover:bg-slate-50 active:scale-95 flex items-center gap-2 shadow-sm uppercase tracking-tight">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            Exportar a PDF
          </button>
        </div>
      </div>

      <!-- Specialized Tabs Navigation -->
      <div class="flex items-center gap-10 border-b border-slate-100 overflow-x-auto pb-px scrollbar-hide">
        <button (click)="activeTab = 'Morosidad'"
          [class]="activeTab === 'Morosidad' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-600'"
          class="pb-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap px-1">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          Análisis de Morosidad
        </button>
        <button (click)="activeTab = 'Recaudación'"
          [class]="activeTab === 'Recaudación' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-slate-600'"
          class="pb-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap px-1">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/></svg>
          Recaudación Mensual
        </button>
      </div>

      <!-- Comprehensive Filters Card -->
      <div class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="space-y-2">
            <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Año Académico</label>
            <div class="relative group">
              <select [(ngModel)]="selectedYearId" (change)="loadData()" 
                class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                <option *ngFor="let year of academicYears" [value]="year.id">{{ year.year }}</option>
              </select>
              <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">Mes de Vencimiento</label>
            <div class="relative group">
              <select [(ngModel)]="selectedMonth" (change)="calculateStats()" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                <option value="">Cualquier Mes</option>
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Setiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
              <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>
      </div>

      <ng-container *ngIf="loading">
        <div class="flex justify-center py-20">
           <div class="w-8 h-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
        </div>
      </ng-container>

      <ng-container *ngIf="!loading">
        <!-- KPI Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
          <div class="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm group hover:scale-[1.02] transition-all border-t-4 border-orange-400">
             <div class="flex items-center justify-between mb-2">
               <h3 class="text-3xl font-bold text-slate-900 tracking-tighter">S/ {{ stats.adeudado | number:'1.2-2' }}</h3>
               <svg class="w-6 h-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             </div>
             <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Saldo Pendiente Restante</p>
          </div>
          
          <div class="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm group hover:scale-[1.02] transition-all border-t-4 border-red-500">
             <div class="flex items-center justify-between mb-2">
               <h3 class="text-3xl font-bold text-slate-900 tracking-tighter">S/ {{ stats.vencido | number:'1.2-2' }}</h3>
               <svg class="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
             </div>
             <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Total Vencido</p>
          </div>

          <div class="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm group hover:scale-[1.02] transition-all border-t-4 border-blue-500">
             <div class="flex items-center justify-between mb-2">
               <h3 class="text-3xl font-bold text-slate-900 tracking-tighter">{{ stats.morosidad | number:'1.1-1' }}%</h3>
               <div class="flex items-center justify-center p-1.5 border-2 border-blue-500 rounded-full text-blue-500">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
               </div>
             </div>
             <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">% de Morosidad (del total histórico emitido)</p>
          </div>
        </div>

        <!-- Detail Table Section -->
        <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm animate-slide-up mt-8">
          <div class="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
            <h2 class="text-base font-semibold text-slate-800 tracking-tight">Alumnos con Deuda ({{ overdueStudents.length }})</h2>
          </div>

          <div *ngIf="overdueStudents.length === 0" class="py-24 text-center">
            <p class="text-slate-300 font-semibold text-sm uppercase tracking-widest">No hay deudas con los filtros seleccionados</p>
          </div>

          <div *ngIf="overdueStudents.length > 0" class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 tracking-wide uppercase">
                  <th class="py-4 px-6">Alumno</th>
                  <th class="py-4 px-6 text-center">Deudas Pend.</th>
                  <th class="py-4 px-6 text-right">Saldo Deudor</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr *ngFor="let student of overdueStudents" class="hover:bg-slate-50/50 transition-colors">
                  <td class="py-4 px-6">
                    <span class="text-sm font-bold text-slate-700">{{ student.name }}</span>
                  </td>
                  <td class="py-4 px-6 text-center">
                    <span class="bg-red-50 text-red-600 px-3 py-1 text-xs font-bold rounded-xl">{{ student.chargesCount }} cargos</span>
                  </td>
                  <td class="py-4 px-6 text-right">
                    <span class="text-sm font-bold text-slate-800">S/ {{ student.totalDebt | number:'1.2-2' }}</span>
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
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class FinanceReportsComponent implements OnInit {
  activeTab = 'Morosidad';
  loading = true;

  academicYears: any[] = [];
  selectedYearId = '';
  selectedMonth = '';

  allCharges: any[] = [];
  
  stats = {
    adeudado: 0,
    vencido: 0,
    morosidad: 0
  };

  overdueStudents: any[] = [];

  constructor(
    private financeService: FinanceService,
    private academicService: AcademicService
  ) {}

  ngOnInit() {
    this.academicService.getAcademicYears().subscribe({
      next: (res) => {
        const data = res.data || res;
        this.academicYears = Array.isArray(data) ? data : [];
        const active = this.academicYears.find(y => y.is_active);
        if (active) {
          this.selectedYearId = active.id;
        } else if (this.academicYears.length > 0) {
          this.selectedYearId = this.academicYears[0].id;
        }
        this.loadData();
      },
      error: () => this.loading = false
    });
  }

  loadData() {
    if (!this.selectedYearId) return;
    this.loading = true;
    
    // Fetch directly from charges to build local global metrics
    // A robust paginated logic is recommended, we do a basic filtered pull.
    // Given backend limitations, we fetch latest for the year.
    this.financeService.getCharges({
      academic_year_id: this.selectedYearId,
      per_page: 1000
    }).subscribe({
      next: (res) => {
        let items = res.data || res;
        this.allCharges = Array.isArray(items) ? items : [];
        this.calculateStats();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  calculateStats() {
    let adeudado = 0;
    let vencido = 0;
    let totalEmitido = 0;
    
    // Filtros
    let filteredCharges = this.allCharges.filter(c => c.status !== 'anulado');

    if (this.selectedMonth) {
      filteredCharges = filteredCharges.filter(c => {
         if (!c.due_date) return false;
         const d = new Date(c.due_date);
         return (d.getMonth() + 1).toString() === this.selectedMonth;
      });
    }

    const studentDebts = new Map<string, any>();

    filteredCharges.forEach(c => {
      const isPaid = c.status === 'pagado';
      const isPartial = c.status === 'pagado_parcial';
      const isPending = c.status === 'pendiente' || c.status === 'vencido' || isPartial;
      
      const totalAmount = parseFloat(c.amount) - (parseFloat(c.discount_amount) || 0);
      const paidStr = parseFloat(c.paid_amount) || 0;
      const debt = totalAmount - paidStr;

      totalEmitido += totalAmount;

      if (isPending && debt > 0) {
        adeudado += debt;
        
        let isPastDue = c.status === 'vencido';
        if (c.due_date && new Date(c.due_date) < new Date() && !isPaid) {
          isPastDue = true;
        }

        if (isPastDue) {
          vencido += debt;
        }

        // Add to student debts list
        if (c.student) {
          const sId = c.student.id;
          if (!studentDebts.has(sId)) {
            studentDebts.set(sId, {
              name: c.student.first_name + ' ' + c.student.last_name,
              totalDebt: 0,
              chargesCount: 0
            });
          }
          const std = studentDebts.get(sId);
          std.totalDebt += debt;
          std.chargesCount++;
        }
      }
    });

    this.stats.adeudado = adeudado;
    this.stats.vencido = vencido;
    this.stats.morosidad = totalEmitido > 0 ? (vencido / totalEmitido) * 100 : 0;

    // Convert map to array and sort by highest debt
    this.overdueStudents = Array.from(studentDebts.values())
      .sort((a, b) => b.totalDebt - a.totalDebt);
  }
}

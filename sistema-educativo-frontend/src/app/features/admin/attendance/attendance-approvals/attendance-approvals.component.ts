import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { AttendanceService, AttendanceJustification } from '@core/services/attendance.service';

@Component({
  selector: 'app-attendance-approvals',
  standalone: true,
  imports: [CommonModule, RouterModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 text-slate-700">
      <app-back-button></app-back-button>
      
      <!-- Header -->
      <div class="flex items-center gap-4">
        <div class="p-3 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm">
          <svg class="w-6 h-6 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
        </div>
        <div>
          <h1 class="text-3xl font-semibold text-slate-900 tracking-tight">Aprobación de Justificaciones</h1>
          <p class="text-slate-500 text-sm font-medium">Revisión y validación de inasistencias justificadas</p>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
        <div class="flex-1 relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <select 
            (change)="onStatusChange($event)"
            class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-10 py-2.5 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer">
            <option value="pendiente">Justificaciones Pendientes</option>
            <option value="aprobada">Historial de Aprobados</option>
            <option value="rechazada">Justificaciones Rechazadas</option>
            <option value="">Todos los registros</option>
          </select>
        </div>
        <button 
          (click)="loadJustifications()"
          class="px-6 py-2.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95">
          Actualizar Lista
        </button>
      </div>

      <!-- Justifications List -->
      <div class="space-y-4">
        <div *ngFor="let item of justifications" class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-2 flex-1">
              <div class="flex items-center gap-3">
                <span class="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                  Justificación
                </span>
                <span class="text-slate-400 text-xs font-medium italic">
                  {{ item.created_at | date:'dd/MM/yyyy HH:mm' }}
                </span>
                <span 
                  [class]="getStatusBadgeClass(item.status)"
                  class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border">
                  {{ item.status }}
                </span>
              </div>
              <p class="text-slate-700 font-medium leading-relaxed">{{ item.reason }}</p>
            </div>
            
            <div *ngIf="item.status === 'pendiente'" class="flex items-center gap-3 shrink-0">
              <button 
                (click)="approve(item.id)"
                class="px-5 py-2.5 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                Aprobar
              </button>
              <button 
                (click)="reject(item.id)"
                class="px-5 py-2.5 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                Rechazar
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div *ngIf="justifications.length === 0" class="bg-white border border-slate-100 rounded-3xl py-24 text-center shadow-sm">
          <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3 class="text-slate-900 font-semibold text-xl mb-2">Sin registros</h3>
          <p class="text-slate-500 text-sm max-w-xs mx-auto font-medium">No se encontraron solicitudes de justificación para el filtro seleccionado.</p>
        </div>
      </div>
    </div>
  `
})
export class AttendanceApprovalsComponent implements OnInit {
  private attendanceService = inject(AttendanceService);
  
  justifications: AttendanceJustification[] = [];
  selectedStatus = 'pendiente';

  ngOnInit() {
    this.loadJustifications();
  }

  loadJustifications() {
    this.attendanceService.getJustifications({ status: this.selectedStatus }).subscribe({
      next: (res) => this.justifications = res.data,
      error: (err) => console.error(err)
    });
  }

  onStatusChange(event: any) {
    this.selectedStatus = event.target.value;
    this.loadJustifications();
  }

  approve(id: string) {
    if (confirm('¿Estás seguro de aprobar esta justificación?')) {
      this.attendanceService.approveJustification(id).subscribe(() => this.loadJustifications());
    }
  }

  reject(id: string) {
    if (confirm('¿Estás seguro de rechazar esta justificación?')) {
      this.attendanceService.rejectJustification(id).subscribe(() => this.loadJustifications());
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'aprobada': return 'bg-green-50 text-green-600 border-green-100';
      case 'rechazada': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    }
  }
}

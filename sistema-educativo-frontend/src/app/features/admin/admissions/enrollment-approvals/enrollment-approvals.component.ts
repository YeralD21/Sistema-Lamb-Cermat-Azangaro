import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { EnrollmentService, EnrollmentApplication } from '@core/services/enrollment.service';
import { AcademicService, Section } from '@core/services/academic.service';
import { AdminBackButtonComponent } from "@shared/components/back-button/admin-back-button.component";

@Component({
  selector: 'app-enrollment-approvals',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminBackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 text-slate-700">
      <app-admin-back-button></app-admin-back-button>

      <!-- Header -->
      <div class="flex items-center gap-4">
        <div class="p-3 bg-blue-50 rounded-2xl border border-blue-100 shadow-sm">
          <svg class="w-6 h-6 text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <div>
          <h1 class="text-3xl font-semibold text-slate-900 tracking-tight">Solicitudes de Matrícula</h1>
          <p class="text-slate-500 text-sm font-medium">Gestión y aprobación de procesos de inscripción</p>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-wrap items-center gap-4">
        <div class="flex-1 min-w-[200px]">
          <label class="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-widest pl-1">Filtrar por Estado</label>
          <select
            [(ngModel)]="selectedStatus"
            (change)="loadApplications()"
            class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer">
            <option value="pending">Pendientes de Revisión</option>
            <option value="approved">Aprobados</option>
            <option value="rejected">Rechazados</option>
            <option value="">Todos los registros</option>
          </select>
        </div>
        <div class="pt-5">
          <button
            (click)="loadApplications()"
            class="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95">
            Actualizar
          </button>
        </div>
      </div>

      <!-- Applications Table -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50">
                <th class="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estudiante</th>
                <th class="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Documento</th>
                <th class="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Estado</th>
                <th class="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Fecha</th>
                <th class="p-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let app of applications" class="hover:bg-slate-50/50 transition-colors group">
                <td class="p-5">
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-slate-700 capitalize group-hover:text-blue-600 transition-colors">
                      {{ app.student_first_name }} {{ app.student_last_name }}
                    </span>
                  </div>
                </td>
                <td class="p-5 text-center text-xs font-medium text-slate-500">
                  {{ app.student_document_number }}
                </td>
                <td class="p-5 text-center">
                  <span
                    [class]="getStatusBadgeClass(app.status)"
                    class="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border">
                    {{ app.status }}
                  </span>
                </td>
                <td class="p-5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                  {{ app.created_at | date:'dd MMM yyyy' }}
                </td>
                <td class="p-5">
                  <div *ngIf="app.status === 'pending'" class="flex items-center justify-center gap-2">
                    <button
                      (click)="onApproveClick(app)"
                      class="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all border border-green-100">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>
                    <button
                      (click)="onRejectClick(app)"
                      class="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all border border-red-100">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty state -->
        <div *ngIf="applications.length === 0" class="py-24 text-center">
          <div class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-blue-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3 class="text-slate-900 font-semibold text-xl mb-2">No hay solicitudes</h3>
          <p class="text-slate-500 text-sm max-w-xs mx-auto font-medium">No se encontraron solicitudes para los filtros actuales.</p>
        </div>
      </div>
    </div>

    <!-- Simple Approval Modal (Optional: Could be a component) -->
    <div *ngIf="showApproveModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-700">
      <div class="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-white/20">
        <h3 class="text-2xl font-bold text-slate-900 tracking-tight mb-2">Aprobar Matrícula</h3>
        <p class="text-slate-500 text-sm font-medium mb-6">Selecciona la sección para el estudiante.</p>

        <div class="space-y-4">
          <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Sección Destino</label>
          <select
            [(ngModel)]="selectedSectionId"
            class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all">
            <option value="">Seleccionar sección...</option>
            <option *ngFor="let s of sections" [value]="s.id">
              {{ s.section_letter }} - {{ s.vacancies }} vacantes
            </option>
          </select>
        </div>

        <div class="flex gap-3 mt-8">
          <button (click)="showApproveModal = false" class="flex-1 py-3.5 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all">Cancelar</button>
          <button (click)="approve()" [disabled]="!selectedSectionId" class="flex-1 py-3.5 bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50">Confirmar</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class EnrollmentApprovalsComponent implements OnInit {
  private enrollmentService = inject(EnrollmentService);
  private academicService = inject(AcademicService);

  applications: EnrollmentApplication[] = [];
  sections: Section[] = [];
  selectedStatus = 'pending';

  showApproveModal = false;
  selectedApp: EnrollmentApplication | null = null;
  selectedSectionId = '';

  ngOnInit() {
    this.loadApplications();
    this.loadSections();
  }

  loadApplications() {
    this.enrollmentService.getApplications({ status: this.selectedStatus }).subscribe({
      next: (res) => this.applications = res.data,
      error: (err) => console.error(err)
    });
  }

  loadSections() {
    this.academicService.getSections().subscribe({
      next: (res) => this.sections = res.data,
      error: (err) => console.error(err)
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved': return 'bg-green-50 text-green-600 border-green-100';
      case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    }
  }

  onApproveClick(app: EnrollmentApplication) {
    this.selectedApp = app;
    this.showApproveModal = true;
    this.selectedSectionId = '';
  }

  onRejectClick(app: EnrollmentApplication) {
    const reason = prompt('Motivo del rechazo:');
    if (reason) {
      this.enrollmentService.rejectApplication(app.id, reason).subscribe(() => this.loadApplications());
    }
  }

  approve() {
    if (this.selectedApp && this.selectedSectionId) {
      this.enrollmentService.approveApplication(this.selectedApp.id, this.selectedSectionId).subscribe({
        next: () => {
          this.showApproveModal = false;
          this.loadApplications();
        },
        error: (err) => alert(err.error?.message || 'Error al aprobar')
      });
    }
  }
}

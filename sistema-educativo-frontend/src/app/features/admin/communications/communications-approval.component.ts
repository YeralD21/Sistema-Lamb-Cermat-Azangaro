import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { MessagingService, Announcement } from '@core/services/messaging.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-communications-approval',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <app-back-button></app-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Revisión de Comunicados</h1>
          <p class="text-slate-500 text-sm font-medium">Panel de aprobación para anuncios institucionales</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-purple-100 italic">
            {{ pendingAnnouncements.length }} Pendientes de Revisión
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let stat of stats" class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm group hover:shadow-md transition-all relative overflow-hidden">
          <div class="flex items-start justify-between relative z-10">
            <div class="space-y-1">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">{{ stat.label }}</p>
              <h3 class="text-2xl font-bold text-slate-900 tracking-tighter">{{ stat.value }}</h3>
            </div>
            <div [class]="'p-3 rounded-xl transition-colors ' + stat.bgColor">
              <svg class="w-6 h-6" [class]="stat.iconColor" [innerHTML]="stat.icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Approval List -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/10 px-8">
          <h2 class="text-base font-bold text-slate-800 tracking-tight uppercase">Comunicados en Espera ({{ pendingAnnouncements.length }})</h2>
        </div>

        <div *ngIf="loading" class="p-16 text-center text-slate-400">
          Cargando comunicados pendientes...
        </div>

        <div *ngIf="!loading && pendingAnnouncements.length === 0" class="p-16 flex flex-col items-center justify-center text-center space-y-6">
          <div class="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500">
            <svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-slate-900 tracking-tight">Todo al día</h3>
            <p class="text-slate-500 text-sm mt-2 max-w-sm mx-auto font-medium leading-relaxed">
              No hay comunicados pendientes de aprobación en este momento. Los docentes recibirán notificaciones cuando publiques nuevos avisos.
            </p>
          </div>
        </div>

        <div class="divide-y divide-slate-50">
          <div *ngFor="let comm of pendingAnnouncements" class="p-8 hover:bg-slate-50/50 transition-all group scale-100 active:scale-[0.99]">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div class="space-y-4 flex-1">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tight bg-purple-50 text-purple-600">
                    Buscando Aprobación
                  </span>
                  <span class="text-xs font-semibold text-slate-500">Por: {{ comm.creator?.first_name || 'Admin' }} {{ comm.creator?.last_name || '' }}</span>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors tracking-tight uppercase">{{ comm.title }}</h3>
                  <p class="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed font-medium whitespace-pre-line">
                    {{ comm.content }}
                  </p>
                </div>
                <div class="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                  <div class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> 
                     {{ comm.audience === 'seccion_especifica' && comm.section ? 'Sección: ' + comm.section.name : comm.audience }}
                  </div>
                  <div class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> Creado el: {{ comm.created_at | date:'dd/MM/yyyy' }}</div>
                </div>
              </div>
              
              <div class="flex flex-col sm:flex-row items-center gap-3">
                <button 
                  (click)="approve(comm.id)"
                  class="w-full sm:w-auto px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                  <svg class="w-5 h-5 line" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  Aprobar
                </button>
                <button 
                  (click)="archive(comm.id)"
                  class="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class CommunicationsApprovalComponent implements OnInit {
  stats = [
    { label: 'Pendientes', value: 0, iconColor: 'text-purple-500', bgColor: 'bg-purple-50', icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
    { label: 'Publicados', value: 0, iconColor: 'text-green-500', bgColor: 'bg-green-50', icon: '<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' },
    { label: 'Archivados', value: 0, iconColor: 'text-slate-400', bgColor: 'bg-slate-50', icon: '<path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/>' },
  ];

  pendingAnnouncements: Announcement[] = [];
  loading = false;

  constructor(private messagingService: MessagingService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.messagingService.getAnnouncements().subscribe({
      next: (res) => {
        const allAnnouncements: Announcement[] = res.data || res;
        this.pendingAnnouncements = allAnnouncements.filter(a => a.status === 'pendiente_aprobacion');
        
        this.stats[0].value = this.pendingAnnouncements.length;
        this.stats[1].value = allAnnouncements.filter(a => a.status === 'publicado').length;
        this.stats[2].value = allAnnouncements.filter(a => a.status === 'archivado').length;
        
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  approve(id: string) {
    Swal.fire({
      title: '¿Aprobar y Publicar?',
      text: "El comunicado será visible para la audiencia seleccionada de inmediato.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, publicar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.messagingService.approveAnnouncement(id).subscribe({
          next: () => {
             Swal.fire({
              icon: 'success',
              title: 'Publicado',
              text: 'El comunicado es ahora visible.',
              toast: true,
              position: 'top-end',
              timer: 3000,
              showConfirmButton: false
            });
            this.loadData();
          }
        });
      }
    });
  }

  archive(id: string) {
    Swal.fire({
      title: '¿Rechazar y Archivar?',
      text: "El comunicado no será publicado.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.messagingService.archiveAnnouncement(id).subscribe({
          next: () => {
             Swal.fire({
              icon: 'info',
              title: 'Comunicado Rechazado',
              toast: true,
              position: 'top-end',
              timer: 3000,
              showConfirmButton: false
            });
            this.loadData();
          }
        });
      }
    });
  }
}

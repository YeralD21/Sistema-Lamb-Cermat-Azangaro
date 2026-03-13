import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-communications-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">
      
      <!-- Back Link -->
      <div class="flex items-center gap-2 text-blue-900 font-medium text-sm cursor-pointer hover:underline transition-all">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        Volver al Panel
      </div>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-semibold text-blue-900 tracking-tight">Gestionar Comunicados</h1>
          <p class="text-slate-500 text-sm font-medium">Administra los avisos y anuncios institucionales</p>
        </div>
        <button class="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-red-600 hover:opacity-90 text-white text-sm font-semibold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Comunicado
        </button>
      </div>

      <!-- KPI Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let kpi of kpis" class="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm group hover:shadow-md transition-all relative overflow-hidden">
          <div class="flex items-start justify-between relative z-10">
            <div class="space-y-1">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">{{ kpi.label }}</p>
              <h3 class="text-2xl font-bold text-slate-900 tracking-tighter">{{ kpi.value }}</h3>
            </div>
            <div [class]="'p-3 rounded-xl transition-colors ' + kpi.bgColor">
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
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Estado</label>
            <div class="relative group">
              <select class="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                <option>Todos</option>
                <option>Borrador</option>
                <option>Pendiente Aprobación</option>
                <option>Publicado</option>
                <option>Archivado</option>
              </select>
              <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Sección</label>
            <div class="relative group">
              <select class="w-full bg-white border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                <option>Todas</option>
                <option>5to Secundaria - Secc. A</option>
                <option>4to Secundaria - Secc. B</option>
                <option>1ro Primaria - Secc. C</option>
              </select>
              <svg class="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 px-6 flex items-center gap-4">
        <div class="relative flex-1">
          <input type="text" placeholder="Buscar comunicado por título..." class="w-full bg-slate-50 border border-slate-100 text-slate-700 rounded-xl px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium" />
          <svg class="w-4 h-4 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
      </div>

      <!-- Communications List -->
      <div class="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/10 px-8">
          <h2 class="text-base font-bold text-slate-800 tracking-tight uppercase">Mis Comunicados ({{ communications.length }})</h2>
        </div>

        <div class="divide-y divide-slate-50">
          <div *ngFor="let comm of communications" class="p-8 hover:bg-slate-50/50 transition-all group scale-100 active:scale-[0.99]">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div class="space-y-4 flex-1">
                <div class="flex items-center gap-3">
                  <span [class]="'px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tight ' + comm.statusStyle">
                    {{ comm.status }}
                  </span>
                  <span [class]="'px-3 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tight ' + comm.priorityStyle">
                    {{ comm.priority }}
                  </span>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors tracking-tight uppercase">{{ comm.title }}</h3>
                  <p class="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">
                    {{ comm.content }}
                  </p>
                </div>
                <div class="flex flex-wrap items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                  <div class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> {{ comm.audience }}</div>
                  <div class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> {{ comm.date }}</div>
                  <div *ngIf="comm.attachment" class="flex items-center gap-1.5 text-blue-500 font-bold"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg> ARCHIVO ADJUNTO</div>
                </div>
              </div>
              
              <div class="flex items-center gap-2">
                <button class="p-3 text-slate-400 hover:text-blue-900 hover:bg-blue-50 rounded-2xl transition-all shadow-sm active:scale-95">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button class="p-3 text-slate-400 hover:text-blue-900 hover:bg-blue-50 rounded-2xl transition-all shadow-sm active:scale-95">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm active:scale-95">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class CommunicationsManagementComponent {
  kpis = [
    { label: 'Total', value: 3, iconColor: 'text-blue-500', bgColor: 'bg-blue-50', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13h4"/><path d="M10 17h4"/>' },
    { label: 'Publicados', value: 1, iconColor: 'text-green-500', bgColor: 'bg-green-50', icon: '<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' },
    { label: 'Borradores', value: 1, iconColor: 'text-orange-500', bgColor: 'bg-orange-50', icon: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>' },
    { label: 'Pendientes', value: 1, iconColor: 'text-purple-500', bgColor: 'bg-purple-50', icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' },
  ];

  communications = [
    {
      title: 'INICIO DE EXÁMENES DEL PRIMER BIMESTRE',
      content: 'Se comunica a todos los padres de familia que los exámenes correspondientes al primer bimestre iniciarán el próximo lunes 24 de marzo. Favor de revisar el temario adjunto.',
      status: 'Publicado',
      statusStyle: 'bg-green-50 text-green-600',
      priority: 'Alta',
      priorityStyle: 'bg-red-50 text-red-600',
      audience: 'Toda la institución',
      date: '12 Mar 2025',
      attachment: true
    },
    {
      title: 'REUNIÓN DE PADRES DE FAMILIA - 5TO SECUNDARIA',
      content: 'Citación para la reunión informativa sobre el viaje de promoción y preparativos para la graduación 2025.',
      status: 'Borrador',
      statusStyle: 'bg-orange-50 text-orange-600',
      priority: 'Normal',
      priorityStyle: 'bg-slate-100 text-slate-500',
      audience: '5to Secundaria - Secc. A',
      date: '11 Mar 2025',
      attachment: false
    },
    {
      title: 'CAMBIO EN EL HORARIO DE TALLER DE DANZA',
      content: 'Por motivos de mantenimiento en el auditorio, el taller de danza del día miércoles se trasladará al polideportivo.',
      status: 'Pendiente',
      statusStyle: 'bg-purple-50 text-purple-600',
      priority: 'Media',
      priorityStyle: 'bg-yellow-50 text-yellow-600',
      audience: 'Estudiantes de Talleres',
      date: '10 Mar 2025',
      attachment: false
    }
  ];
}

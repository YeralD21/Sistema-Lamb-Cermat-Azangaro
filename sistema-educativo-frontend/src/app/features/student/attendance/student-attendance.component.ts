import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ICONS } from '@core/constants/icons';
import localeEsPe from '@angular/common/locales/es-PE';

registerLocaleData(localeEsPe);

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'presente' | 'tarde' | 'falta' | 'justificado';
  justification: string | null;
  course: {
    name: string;
    code: string;
  };
  justification_data?: {
    id: string;
    status: 'pendiente' | 'aprobada' | 'rechazada';
    reason: string;
    review_notes: string | null;
  };
}

@Component({
  selector: 'app-attendance-student',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <!-- Go Back Button -->
      <a routerLink="/app/dashboard/student" class="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium group">
        <div class="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:bg-slate-50 transition-colors shadow-sm">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </div>
        Volver al Panel
      </a>

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Mi Asistencia</h1>
          <p class="text-slate-500 mt-1">Revisa tu historial detallado de asistencia y puntualidad</p>
        </div>
      </div>

      <!-- Month Selector -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <div [innerHTML]="getSafeIcon('calendar')" class="w-5 h-5"></div>
            </div>
            <div>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Periodo de consulta</p>
              <p class="text-sm font-bold text-slate-700">Selecciona un mes</p>
            </div>
          </div>
          <div class="flex-1">
            <select [(ngModel)]="selectedMonth" (change)="loadAttendance()" class="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer">
              <option *ngFor="let m of months" [value]="m.value">{{ m.label }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div *ngFor="let stat of statCards" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div [class]="'absolute top-0 left-0 w-1.5 h-full ' + stat.color"></div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex flex-col">
              <span class="text-3xl font-black text-slate-900">{{ stat.value }}</span>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ stat.label }}</p>
            </div>
            <div [class]="'p-3 rounded-2xl ' + stat.bgColor">
              <div [innerHTML]="getSafeIcon(stat.icon)" [class]="'w-6 h-6 ' + stat.textColor"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Attendance List -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 class="text-lg font-bold text-slate-900">Historial de Registros</h3>
          <span class="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider shadow-sm">
            {{ attendance.length }} total
          </span>
        </div>
        
        <div class="p-4 sm:p-8">
          <div *ngIf="loading" class="flex flex-col items-center justify-center py-20 gap-4">
            <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm font-bold text-slate-400 animate-pulse">CARGANDO HISTORIAL...</p>
          </div>

          <div *ngIf="!loading && attendance.length === 0" class="text-center py-24">
            <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <div [innerHTML]="getSafeIcon('calendar')" class="w-12 h-12 text-slate-200"></div>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Sin registros este mes</h3>
            <p class="text-slate-400 max-w-sm mx-auto font-medium">No se encontraron registros de asistencia para el periodo seleccionado. Intenta cambiar el mes.</p>
          </div>

          <div *ngIf="!loading && attendance.length > 0" class="space-y-4">
            <div *ngFor="let record of attendance" 
                 [class]="'p-5 rounded-2xl border-2 transition-all hover:shadow-xl hover:-translate-y-1 duration-300 ' + getStatusStyles(record.status).border">
              <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div class="flex items-start gap-5">
                  <div [class]="'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ' + getStatusStyles(record.status).bg">
                    <div [innerHTML]="getSafeIcon(getStatusStyles(record.status).icon)" [class]="'w-6 h-6 ' + getStatusStyles(record.status).text"></div>
                  </div>
                  <div>
                    <div class="flex items-center gap-3 mb-1.5 flex-wrap">
                      <span class="text-lg font-bold text-slate-900 leading-none">
                        {{ record.date | date:'EEEE, d MMMM yyyy':'':'es-PE' | titlecase }}
                      </span>
                    </div>
                    
                    <div class="flex items-center gap-2 mb-3">
                      <span class="px-2 py-0.5 bg-white border border-slate-200 text-slate-500 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm">
                        {{ record.course.code }}
                      </span>
                      <span class="text-sm font-bold text-slate-600">{{ record.course.name }}</span>
                    </div>
                    
                    <div *ngIf="record.justification" class="flex items-start gap-2 p-3 bg-white/60 rounded-xl border border-white/50 shadow-inner">
                       <div [innerHTML]="getSafeIcon('fileText')" class="w-4 h-4 text-slate-400 mt-0.5"></div>
                       <p class="text-sm text-slate-600 italic font-medium">Nota: {{ record.justification }}</p>
                    </div>

                    <!-- Justification Feedback -->
                    <div *ngIf="record.justification_data" class="mt-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <div class="flex items-center gap-3 mb-3">
                        <div class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                          <div [innerHTML]="getSafeIcon('fileText')" class="w-4 h-4 text-slate-400"></div>
                        </div>
                        <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Justificación Formal</span>
                        <span [class]="'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ml-auto ' + getJustificationStyles(record.justification_data.status)">
                          {{ record.justification_data.status }}
                        </span>
                      </div>
                      <p class="text-sm text-slate-800 font-bold mb-2">{{ record.justification_data.reason }}</p>
                      <div *ngIf="record.justification_data.review_notes" class="mt-3 text-xs text-blue-600 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500 font-bold italic">
                        REVISIÓN: {{ record.justification_data.review_notes }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="md:text-right shrink-0">
                  <span [class]="'px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg inline-block text-white ' + getStatusStyles(record.status).badgeColor">
                    {{ getStatusLabel(record.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background: #F8FAFC; min-h: 100vh; }
    select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.25rem; }
  `]
})
export class AttendanceStudentComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  
  loading = false;
  selectedMonth = new Date().toISOString().slice(0, 7);
  months: { value: string, label: string }[] = [];
  attendance: AttendanceRecord[] = [];
  stats = { presente: 0, tarde: 0, falta: 0, justificado: 0 };

  constructor() {
    this.generateMonths();
  }

  ngOnInit() {
    this.loadAttendance();
  }

  generateMonths() {
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const value = date.toISOString().slice(0, 7);
      const label = date.toLocaleDateString('es-PE', { year: 'numeric', month: 'long' });
      this.months.push({ 
        value, 
        label: label.charAt(0).toUpperCase() + label.slice(1) 
      });
    }
  }

  loadAttendance() {
    this.loading = true;
    // Mock simulation
    setTimeout(() => {
      this.attendance = [
        {
          id: '1',
          date: new Date().toISOString(),
          status: 'presente',
          justification: null,
          course: { name: 'Matemática Avanzada', code: 'MAT-SEC-01' }
        },
        {
          id: '2',
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'tarde',
          justification: 'Retraso por transporte escolar',
          course: { name: 'Comunicación y Literatura', code: 'COM-SEC-01' }
        },
        {
          id: '3',
          date: new Date(Date.now() - 172800000).toISOString(),
          status: 'falta',
          justification: null,
          course: { name: 'Biología y Anatomía', code: 'BIO-SEC-02' },
          justification_data: {
            id: 'j1',
            status: 'pendiente',
            reason: 'Descanso médico solicitado',
            review_notes: null
          }
        },
        {
          id: '4',
          date: new Date(Date.now() - 259200000).toISOString(),
          status: 'justificado',
          justification: null,
          course: { name: 'Historia Universal', code: 'HIS-SEC-01' },
          justification_data: {
            id: 'j2',
            status: 'aprobada',
            reason: 'Participación en olimpiada regional',
            review_notes: 'Mérito académico reconocido. Asistencia justificada.'
          }
        }
      ];
      this.calculateStats();
      this.loading = false;
    }, 1200);
  }

  calculateStats() {
    const newStats: Record<string, number> = { presente: 0, tarde: 0, falta: 0, justificado: 0 };
    this.attendance.forEach(r => {
      newStats[r.status] = (newStats[r.status] || 0) + 1;
    });
    this.stats = {
      presente: newStats['presente'],
      tarde: newStats['tarde'],
      falta: newStats['falta'],
      justificado: newStats['justificado']
    };
  }

  getSafeIcon(name: string): SafeHtml {
    const svg = (ICONS as any)[name] || ICONS.calendar;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getStatusStyles(status: string) {
    const styles: Record<string, any> = {
      presente: { border: 'border-green-100 bg-green-50/20', bg: 'bg-green-100', text: 'text-green-600', icon: 'checkCircle2', badgeColor: 'bg-green-600' },
      tarde: { border: 'border-yellow-100 bg-yellow-50/20', bg: 'bg-yellow-100', text: 'text-yellow-600', icon: 'clock', badgeColor: 'bg-yellow-500' },
      falta: { border: 'border-red-100 bg-red-50/20', bg: 'bg-red-100', text: 'text-red-700', icon: 'xCircle', badgeColor: 'bg-red-600' },
      justificado: { border: 'border-blue-100 bg-blue-50/20', bg: 'bg-blue-100', text: 'text-blue-600', icon: 'fileText', badgeColor: 'bg-blue-600' },
    };
    return styles[status] || styles['presente'];
  }

  getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      presente: 'Presente',
      tarde: 'Tardanza',
      falta: 'Falta',
      justificado: 'Justificado'
    };
    return labels[status] || labels['presente'];
  }

  getJustificationStyles(status: string) {
    if (status === 'aprobada') return 'bg-green-500 text-white';
    if (status === 'rechazada') return 'bg-red-500 text-white';
    return 'bg-blue-500 text-white';
  }

  get statCards() {
    return [
      { label: 'Presentes', value: this.stats.presente, icon: 'checkCircle2', color: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-600' },
      { label: 'Tardanzas', value: this.stats.tarde, icon: 'clock', color: 'bg-yellow-400', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
      { label: 'Faltas', value: this.stats.falta, icon: 'xCircle', color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-600' },
      { label: 'Justificadas', value: this.stats.justificado, icon: 'fileText', color: 'bg-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    ];
  }
}

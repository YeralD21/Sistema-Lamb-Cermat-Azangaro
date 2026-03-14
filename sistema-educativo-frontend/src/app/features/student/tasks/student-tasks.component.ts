import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@shared/components/back-button/back-button.component';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ICONS } from '@core/constants/icons';

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pendiente' | 'entregada' | 'calificada' | 'vencida';
  priority: 'alta' | 'media' | 'baja';
  course: {
    name: string;
    code: string;
    color: string;
  };
  has_attachment: boolean;
  score?: number;
  max_score?: number;
}

@Component({
  selector: 'app-tasks-student',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <app-back-button link="/app/dashboard/student"></app-back-button>

      <!-- Header -->
      <div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight mb-2">Mis Tareas</h1>
        <p class="text-slate-500 font-medium leading-relaxed">Organiza y entrega tus trabajos a tiempo</p>
      </div>

      <!-- Quick Filter Cards (React Design) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Today's Tasks -->
        <button (click)="activeFilter = 'today'; filterTasks()"
           [class]="'bg-white border rounded-[32px] p-6 text-left transition-all duration-300 group ' + (activeFilter === 'today' ? 'border-indigo-600 ring-2 ring-indigo-50 shadow-xl shadow-indigo-100' : 'border-slate-200 hover:border-indigo-300 hover:shadow-lg')">
          <div class="flex items-center justify-between mb-4">
            <div [innerHTML]="getSafeIcon('calendar')" class="w-10 h-10 text-indigo-700 group-hover:scale-110 transition-transform"></div>
            <span class="text-4xl font-black text-slate-900">{{ getFilterCount('today') }}</span>
          </div>
          <p class="text-sm font-black text-slate-500 uppercase tracking-widest">Para hoy</p>
        </button>

        <!-- Week's Tasks -->
        <button (click)="activeFilter = 'week'; filterTasks()"
           [class]="'bg-white border rounded-[32px] p-6 text-left transition-all duration-300 group ' + (activeFilter === 'week' ? 'border-blue-600 ring-2 ring-blue-50 shadow-xl shadow-blue-100' : 'border-slate-200 hover:border-blue-300 hover:shadow-lg')">
          <div class="flex items-center justify-between mb-4">
            <div [innerHTML]="getSafeIcon('clock')" class="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform"></div>
            <span class="text-4xl font-black text-slate-900">{{ getFilterCount('week') }}</span>
          </div>
          <p class="text-sm font-black text-slate-500 uppercase tracking-widest">Esta semana</p>
        </button>

        <!-- Overdue Tasks -->
        <button (click)="activeFilter = 'overdue'; filterTasks()"
           [class]="'bg-white border rounded-[32px] p-6 text-left transition-all duration-300 group ' + (activeFilter === 'overdue' ? 'border-red-600 ring-2 ring-red-50 shadow-xl shadow-red-100' : 'border-slate-200 hover:border-red-300 hover:shadow-lg')">
          <div class="flex items-center justify-between mb-4">
            <div [innerHTML]="getSafeIcon('alertCircle')" class="w-10 h-10 text-red-500 group-hover:scale-110 transition-transform"></div>
            <span class="text-4xl font-black text-red-600">{{ getFilterCount('overdue') }}</span>
          </div>
          <p class="text-sm font-black text-slate-500 uppercase tracking-widest">Atrasadas</p>
        </button>

        <!-- All Tasks -->
        <button (click)="activeFilter = 'all'; filterTasks()"
           [class]="'bg-white border rounded-[32px] p-6 text-left transition-all duration-300 group ' + (activeFilter === 'all' ? 'border-indigo-600 ring-2 ring-indigo-50 shadow-xl shadow-indigo-100' : 'border-slate-200 hover:border-indigo-300 hover:shadow-lg')">
          <div class="flex items-center justify-between mb-4">
            <div [innerHTML]="getSafeIcon('bookOpen')" class="w-10 h-10 text-indigo-800 group-hover:scale-110 transition-transform"></div>
            <span class="text-4xl font-black text-slate-900">{{ allTasks.length }}</span>
          </div>
          <p class="text-sm font-black text-slate-500 uppercase tracking-widest">Todas</p>
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex flex-col items-center justify-center py-32 gap-6 bg-white rounded-[40px] border border-slate-200 shadow-sm">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Buscando tareas...</p>
      </div>

      <!-- Empty State (React Design) -->
      <div *ngIf="!loading && filteredTasks.length === 0" class="text-center py-24 bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden relative group">
        <div class="absolute inset-0 bg-slate-50/30 group-hover:bg-indigo-50/20 transition-colors duration-700"></div>
        <div class="relative z-10 max-w-md mx-auto">
          <div class="w-24 h-24 bg-slate-100 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner transform group-hover:rotate-6 transition-transform">
             <div [innerHTML]="getSafeIcon('bookOpen')" class="w-12 h-12 text-slate-400"></div>
          </div>
          <h3 class="text-2xl font-black text-slate-900 mb-2 tracking-tight">No hay tareas</h3>
          <p class="text-slate-500 font-medium">Aún no tienes tareas asignadas</p>
        </div>
      </div>

      <!-- Tasks List -->
      <div *ngIf="!loading && filteredTasks.length > 0" class="space-y-4">
        <div *ngFor="let task of filteredTasks" 
             class="bg-white rounded-[32px] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 overflow-hidden flex flex-col pointer-events-auto">
          <div class="p-8 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <h3 class="text-xl font-black text-slate-900">{{ task.title }}</h3>
                  <span [class]="'px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ' + getStatusStyles(task.status).bg + ' ' + getStatusStyles(task.status).text">
                    {{ task.status | uppercase }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span [class]="'px-2 py-0.5 rounded-md text-[10px] font-black text-white ' + task.course.color">{{ task.course.code }}</span>
                  <span class="text-xs font-bold text-slate-400 uppercase tracking-tight">{{ task.course.name }}</span>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-black hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
                  <div [innerHTML]="getSafeIcon('fileText')" class="w-4 h-4 text-slate-400"></div>
                  VER DETALLE
                </button>
                <button *ngIf="task.status === 'pendiente' || task.status === 'vencida'" class="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2">
                  <div [innerHTML]="getSafeIcon('upload')" class="w-4 h-4"></div>
                  ENTREGAR
                </button>
              </div>
            </div>

            <p class="text-sm font-medium text-slate-500 leading-relaxed max-w-3xl" *ngIf="task.description">
              {{ task.description }}
            </p>

            <div class="flex flex-wrap items-center gap-6 text-xs font-bold">
              <div class="flex items-center gap-2 text-slate-400">
                <div [innerHTML]="getSafeIcon('clock')" class="w-4 h-4"></div>
                Límite: <span [class]="task.status === 'vencida' ? 'text-red-600' : 'text-slate-600'">{{ task.due_date | date:'short' }}</span>
              </div>
              <div *ngIf="task.status === 'calificada'" class="flex items-center gap-2 text-emerald-600">
                <div [innerHTML]="getSafeIcon('award')" class="w-4 h-4"></div>
                Nota: {{ task.score }}/{{ task.max_score }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
v>
  `,
  styles: [`
    :host { display: block; background: #F8FAFC; min-h: 100vh; }
  `]
})
export class TasksStudentComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  
  loading = false;
  activeFilter = 'all';
  pendingCount = 0;

  filters = [
    { id: 'all', label: 'Todas', count: 0 },
    { id: 'today', label: 'Cierran hoy', count: 1 },
    { id: 'week', label: 'Esta semana', count: 3 },
    { id: 'overdue', label: 'Vencidas', count: 1 },
    { id: 'submitted', label: 'Entregadas', count: 0 },
  ];

  allTasks: Task[] = [];
  filteredTasks: Task[] = [];

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;
    setTimeout(() => {
      this.allTasks = [
        {
          id: '1',
          title: 'Cálculo de Áreas y Perímetros',
          description: 'Resolver los ejercicios de la página 45 a 48 del libro de trabajo. Subir fotos de los procedimientos claros.',
          due_date: new Date().toISOString(),
          status: 'pendiente',
          priority: 'alta',
          course: { name: 'Matemática', code: 'MAT-301', color: 'bg-blue-600' },
          has_attachment: true
        },
        {
          id: '2',
          title: 'Análisis de la Obra "Moby Dick"',
          description: 'Elaborar un ensayo de 500 palabras sobre la obsesión del capitán Ahab y el simbolismo de la ballena blanca.',
          due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
          status: 'pendiente',
          priority: 'media',
          course: { name: 'Comunicación', code: 'COM-301', color: 'bg-rose-600' },
          has_attachment: false
        },
        {
          id: '3',
          title: 'Laboratorio: Célula Animal vs Vegetal',
          description: 'Completar el informe de laboratorio con las observaciones del microscopio realizadas en clase.',
          due_date: new Date(Date.now() - 86400000).toISOString(),
          status: 'vencida',
          priority: 'alta',
          course: { name: 'Ciencia y Tecnología', code: 'CYT-302', color: 'bg-emerald-600' },
          has_attachment: true
        },
        {
          id: '4',
          title: 'Proyecto: Historia de mi Localidad',
          description: 'Entrevista a una persona mayor sobre cómo ha cambiado la ciudad en los últimos 30 años.',
          due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
          status: 'entregada',
          priority: 'media',
          course: { name: 'DPCC', code: 'DPCC-301', color: 'bg-amber-600' },
          has_attachment: true
        },
        {
          id: '5',
          title: 'Práctica Dirigida: Vectores',
          description: 'Resolver el PDF adjunto y marcar las respuestas en el formulario online.',
          due_date: new Date(Date.now() - 86400000 * 2).toISOString(),
          status: 'calificada',
          priority: 'baja',
          course: { name: 'Física', code: 'FIS-301', color: 'bg-indigo-600' },
          has_attachment: true,
          score: 18,
          max_score: 20
        }
      ];
      this.filterTasks();
      this.loading = false;
    }, 1200);
  }

  getFilterCount(filter: string): number {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(todayStart);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    switch (filter) {
      case 'today':
        return this.allTasks.filter(t => {
          const d = new Date(t.due_date);
          return d >= todayStart && d < new Date(todayStart.getTime() + 86400000);
        }).length;
      case 'week':
        return this.allTasks.filter(t => {
          const d = new Date(t.due_date);
          return d >= todayStart && d <= weekFromNow;
        }).length;
      case 'overdue':
        return this.allTasks.filter(t => t.status === 'vencida').length;
      default:
        return this.allTasks.length;
    }
  }

  filterTasks() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(todayStart);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    if (this.activeFilter === 'all') {
      this.filteredTasks = this.allTasks;
    } else if (this.activeFilter === 'today') {
      this.filteredTasks = this.allTasks.filter(t => {
        const d = new Date(t.due_date);
        return d >= todayStart && d < new Date(todayStart.getTime() + 86400000);
      });
    } else if (this.activeFilter === 'week') {
      this.filteredTasks = this.allTasks.filter(t => {
        const d = new Date(t.due_date);
        return d >= todayStart && d <= weekFromNow;
      });
    } else if (this.activeFilter === 'overdue') {
      this.filteredTasks = this.allTasks.filter(t => t.status === 'vencida');
    }
  }

  getSafeIcon(name: string): SafeHtml {
    const map: Record<string, string> = {
      calendar: ICONS.calendar,
      clock: ICONS.clock,
      alertCircle: ICONS.alertTriangle,
      bookOpen: ICONS.bookOpen,
      fileText: ICONS.fileText,
      upload: ICONS.megaphone, // Usingmegaphone as placeholder if upload missing
      award: ICONS.award,
      paperclip: ICONS.paperclip
    };
    const svg = map[name] || ICONS.calendar;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getPriorityClass(p: string): string {
    const map: Record<string, string> = {
      'alta': 'bg-red-50 text-red-600 border border-red-100 font-black',
      'media': 'bg-orange-50 text-orange-600 border border-orange-100 font-black',
      'baja': 'bg-blue-50 text-blue-600 border border-blue-100 font-black',
    };
    return map[p] || 'bg-slate-50 text-slate-500 font-bold';
  }

  getStatusStyles(status: string) {
    const styles: Record<string, any> = {
      pendiente: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: 'clock' },
      entregada: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'checkCircle2' },
      calificada: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'award' },
      vencida: { bg: 'bg-red-50', text: 'text-red-600', icon: 'alertCircle' },
    };
    return styles[status] || styles['pendiente'];
  }
}

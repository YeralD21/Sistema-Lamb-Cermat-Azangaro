import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metrics-student',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Mi Progreso Académico</h2>
      <p class="text-slate-600">Aquí podrás visualizar tus métricas de rendimiento...</p>
    </div>
  `
})
export class MetricsStudentComponent {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance-student',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Registro de Asistencia</h2>
      <p class="text-slate-600">Aquí podrás visualizar tu récord de asistencias...</p>
    </div>
  `
})
export class AttendanceStudentComponent {}

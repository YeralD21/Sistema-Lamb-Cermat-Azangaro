import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule-student',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Mi Horario</h2>
      <p class="text-slate-600">Aquí podrás consultar tu horario de clases...</p>
    </div>
  `
})
export class ScheduleStudentComponent {}

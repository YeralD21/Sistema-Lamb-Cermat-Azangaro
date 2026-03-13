import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks-student',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Mis Tareas</h2>
      <p class="text-slate-600">Aquí podrás gestionar tus tareas y entregas pendientes...</p>
    </div>
  `
})
export class TasksStudentComponent {}

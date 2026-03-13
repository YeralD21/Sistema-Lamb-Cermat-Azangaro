import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grades-student',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Mis Calificaciones</h2>
      <p class="text-slate-600">Aquí podrás visualizar tus notas y promedios...</p>
    </div>
  `
})
export class GradesStudentComponent {}

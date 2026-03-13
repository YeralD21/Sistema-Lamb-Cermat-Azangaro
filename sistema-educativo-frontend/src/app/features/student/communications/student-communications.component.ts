import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-communications-student',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8">
      <h2 class="text-2xl font-bold mb-4">Comunicados</h2>
      <p class="text-slate-600">Aquí podrás leer los comunicados oficiales del colegio...</p>
    </div>
  `
})
export class CommunicationsStudentComponent {}

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createIcons, icons } from 'lucide';

@Component({
  selector: 'app-teacher-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-tasks.component.html',
  styleUrls: ['./teacher-tasks.component.css']
})
export class TeacherTasksComponent implements OnInit, AfterViewInit {
  tasks = [
    { id: '1', title: 'Resolver ejercicios de la página 45', description: 'Ejercicios de fracciones', courseName: 'Matemáticas', gradeLevelName: '1ro Secundaria', sectionLetter: 'A', dueDate: '2025-10-15', status: 'active', submissionsCount: 15, expectedSubmissions: 25 },
    { id: '2', title: 'Ensayo sobre Don Quijote', description: 'Mínimo 500 palabras', courseName: 'Comunicación', gradeLevelName: '2do Secundaria', sectionLetter: 'B', dueDate: '2025-10-20', status: 'active', submissionsCount: 5, expectedSubmissions: 20 },
    { id: '3', title: 'Maqueta del Sistema Solar', description: 'Debe incluir planetas y descripciones', courseName: 'Ciencia', gradeLevelName: '3ro Secundaria', sectionLetter: 'A', dueDate: '2025-09-10', status: 'closed', submissionsCount: 22, expectedSubmissions: 22 }
  ];

  Math = Math;

  isModalOpen = false;
  editingTask: any = null;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    createIcons({ icons });
  }

  deleteTask(id: string) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.tasks = this.tasks.filter(t => t.id !== id);
    }
  }

  openModal(task?: any) {
    this.editingTask = task ? { ...task } : { status: 'active' };
    this.isModalOpen = true;
    setTimeout(() => createIcons({ icons }), 0);
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingTask = null;
  }

  saveTask() {
    if (this.editingTask.id) {
      const index = this.tasks.findIndex(t => t.id === this.editingTask.id);
      if (index > -1) this.tasks[index] = { ...this.editingTask };
    } else {
      this.editingTask.id = Date.now().toString();
      this.editingTask.courseName = 'Curso Ejemplo';
      this.editingTask.gradeLevelName = '1ro Sec';
      this.editingTask.sectionLetter = 'A';
      this.editingTask.submissionsCount = 0;
      this.editingTask.expectedSubmissions = 30;
      this.tasks.push({ ...this.editingTask });
    }
    this.closeModal();
  }
}

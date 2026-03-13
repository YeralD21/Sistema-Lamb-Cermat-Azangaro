import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createIcons, icons } from 'lucide';

@Component({
  selector: 'app-teacher-grading',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-grading.component.html',
  styleUrls: ['./teacher-grading.component.css']
})
export class TeacherGradingComponent implements OnInit, AfterViewInit {
  submissions = [
    { id: '1', studentName: 'Pérez, Juan', taskTitle: 'Resolver ejercicios de la página 45', date: 'Hace 2 horas', status: 'pending', courseName: 'Matemáticas 1ro A', score: '' },
    { id: '2', studentName: 'González, María', taskTitle: 'Ensayo sobre Don Quijote', date: 'Ayer', status: 'graded', score: 'A', courseName: 'Comunicación 2do B' },
    { id: '3', studentName: 'López, Carlos', taskTitle: 'Maqueta del Sistema Solar', date: 'Hace 3 días', status: 'pending', courseName: 'Ciencia 3ro A', score: '' },
  ];

  isModalOpen = false;
  gradingSubmission: any = null;
  grades = ['AD', 'A', 'B', 'C'];
  feedback = '';
  saving = false;

  get pendingCount() {
    return this.submissions.filter(s => s.status === 'pending').length;
  }

  get gradedCount() {
    return this.submissions.filter(s => s.status === 'graded').length;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    createIcons({ icons });
  }

  openGradeModal(submission: any) {
    this.gradingSubmission = { ...submission };
    this.feedback = submission.score ? 'Buen trabajo.' : '';
    this.isModalOpen = true;
    setTimeout(() => createIcons({ icons }), 50);
  }

  closeModal() {
    this.isModalOpen = false;
    this.gradingSubmission = null;
    this.feedback = '';
  }

  saveGrade() {
    if (!this.gradingSubmission.score) {
      alert("Por favor seleccione una calificación.");
      return;
    }
    this.saving = true;
    setTimeout(() => {
        const index = this.submissions.findIndex(s => s.id === this.gradingSubmission.id);
        if (index > -1) {
          this.submissions[index].score = this.gradingSubmission.score;
          this.submissions[index].status = 'graded';
        }
        this.saving = false;
        this.closeModal();
        alert("¡Calificación guardada y notificada al estudiante!");
        setTimeout(() => createIcons({ icons }), 50);
    }, 1000);
  }
}

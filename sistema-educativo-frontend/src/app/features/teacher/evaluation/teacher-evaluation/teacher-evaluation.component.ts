import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createIcons, icons } from 'lucide';

@Component({
  selector: 'app-teacher-evaluation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-evaluation.component.html',
  styleUrls: ['./teacher-evaluation.component.css']
})
export class TeacherEvaluationComponent implements OnInit, AfterViewInit {
  loading = false;
  saving = false;
  selectedCourse = '';
  selectedPeriod = '';
  error = '';
  success = '';
  planillaStatus = 'borrador';
  isPeriodClosed = false;

  courses = [
    { id: '1', course: { id: 'c1', name: 'Matemáticas', code: 'MAT101' }, section: { id: 's1', section_letter: 'A', grade_level: { name: '1ro Secundaria' } } },
    { id: '2', course: { id: 'c2', name: 'Comunicación', code: 'COM101' }, section: { id: 's2', section_letter: 'B', grade_level: { name: '2do Secundaria' } } }
  ];

  periods = [
    { id: '1', name: 'Primer Bimestre', is_closed: false },
    { id: '2', name: 'Segundo Bimestre', is_closed: true }
  ];

  competencies = [
    { id: 'comp1', code: 'C1', description: 'Resuelve problemas de cantidad' },
    { id: 'comp2', code: 'C2', description: 'Resuelve problemas de regularidad, equivalencia y cambio' }
  ];

  students = [
    { id: '1', student_code: 'STD-001', first_name: 'Juan', last_name: 'Pérez', photo_url: null },
    { id: '2', student_code: 'STD-002', first_name: 'María', last_name: 'González', photo_url: null }
  ];

  evaluations: Record<string, any> = {
    '1-comp1': { grade: 'AD', observations: 'Excelente' },
    '1-comp2': { grade: 'A', observations: '' },
    '2-comp1': { grade: 'B', observations: 'Mejorar cálculos' },
    '2-comp2': { grade: 'C', observations: 'Necesita apoyo' }
  };

  grades = ['AD', 'A', 'B', 'C'];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    createIcons({ icons });
  }

  updateEvaluation(studentId: string, competencyId: string, field: string, value: string) {
    if (this.isPeriodClosed) return;
    const key = `${studentId}-${competencyId}`;
    if (!this.evaluations[key]) {
      this.evaluations[key] = { grade: null, observations: '' };
    }
    this.evaluations[key][field] = value;
  }

  handleSaveDraft() {
    this.saveEvaluations('borrador');
  }

  handlePublish() {
    if (confirm('¿Estás seguro de publicar estas calificaciones?')) {
      this.saveEvaluations('publicada');
    }
  }

  saveEvaluations(status: string) {
    this.saving = true;
    setTimeout(() => {
      this.saving = false;
      this.planillaStatus = status;
      this.success = status === 'publicada' ? 'Calificaciones publicadas correctamente' : 'Borrador guardado correctamente';
      setTimeout(() => this.success = '', 3000);
    }, 1000);
  }

  onPeriodChange() {
    const period = this.periods.find(p => p.id === this.selectedPeriod);
    this.isPeriodClosed = period ? period.is_closed : false;
  }
}

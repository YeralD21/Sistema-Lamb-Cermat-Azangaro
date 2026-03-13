import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createIcons, icons } from 'lucide';

@Component({
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-attendance.component.html',
  styleUrls: ['./teacher-attendance.component.css']
})
export class TeacherAttendanceComponent implements OnInit, AfterViewInit {
  loading = false;
  saving = false;
  selectedCourse = '';
  selectedSection = '';
  selectedDate = new Date().toISOString().split('T')[0];
  error = '';
  success = '';

  courses = [
    { id: '1', course: { id: 'c1', name: 'Matemáticas', code: 'MAT101' }, section: { id: 's1', section_letter: 'A', grade_level: { name: '1ro Secundaria' } } },
    { id: '2', course: { id: 'c2', name: 'Comunicación', code: 'COM101' }, section: { id: 's2', section_letter: 'B', grade_level: { name: '2do Secundaria' } } }
  ];

  students = [
    { id: '1', student_code: 'STD-001', first_name: 'Juan', last_name: 'Pérez', photo_url: null },
    { id: '2', student_code: 'STD-002', first_name: 'María', last_name: 'González', photo_url: null },
    { id: '3', student_code: 'STD-003', first_name: 'Carlos', last_name: 'López', photo_url: null }
  ];

  attendanceRecords: Record<string, any> = {
    '1': { status: 'presente', justification: '' },
    '2': { status: 'tarde', justification: 'Tráfico' },
    '3': { status: 'falta', justification: '' }
  };

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    createIcons({ icons });
  }

  updateAttendance(studentId: string, field: string, value: string) {
    if (!this.attendanceRecords[studentId]) {
      this.attendanceRecords[studentId] = { status: 'presente', justification: '' };
    }
    this.attendanceRecords[studentId][field] = value;
  }

  handleSaveAttendance() {
    this.saving = true;
    setTimeout(() => {
      this.saving = false;
      this.success = 'Asistencia guardada correctamente';
      setTimeout(() => this.success = '', 3000);
    }, 1000);
  }
}

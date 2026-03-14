import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createIcons, icons } from 'lucide';
import { AttendanceService } from '@core/services/attendance.service';
import { AcademicService } from '@core/services/academic.service';
import { AuthService } from '@core/services/auth.service';
import { environment } from '../../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-attendance.component.html',
  styleUrls: ['./teacher-attendance.component.css']
})
export class TeacherAttendanceComponent implements OnInit, AfterViewInit {
  private attendanceService = inject(AttendanceService);
  private academicService = inject(AcademicService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  loading = false;
  saving = false;
  selectedCourseId = '';
  selectedSectionId = '';
  selectedDate = new Date().toISOString().split('T')[0];
  error = '';
  success = '';

  courses: any[] = [];
  students: any[] = [];
  attendanceRecords: Record<string, any> = {};

  ngOnInit(): void {
    this.loadTeacherAssignments();
  }

  ngAfterViewInit(): void {
    this.initIcons();
  }

  private initIcons() {
    createIcons({ icons });
  }

  loadTeacherAssignments() {
    this.loading = true;
    const user = this.authService.currentUser();
    
    // Si es admin/director, podemos cargar todas o filtrar. 
    // Por ahora, buscaremos el teacher_id si el rol es teacher.
    if (user?.role === 'teacher') {
      this.http.get<any>(`${environment.apiUrl}/teachers`, { params: { user_id: user.id } }).subscribe({
        next: (res) => {
          const teacher = res.data?.[0];
          if (teacher) {
            this.fetchAssignments({ teacher_id: teacher.id });
          } else {
            this.error = 'No se encontró registro de docente';
            this.loading = false;
          }
        },
        error: () => {
          this.error = 'Error al verificar perfil de docente';
          this.loading = false;
        }
      });
    } else {
      // Admin ve todas
      this.fetchAssignments({});
    }
  }

  private fetchAssignments(params: any) {
    this.academicService.getTeacherCourseAssignments(params).subscribe({
      next: (res: any) => {
        this.courses = res.data || [];
        this.loading = false;
        if (this.courses.length > 0) {
          this.selectedAssignment = this.courses[0];
          this.selectedCourseId = this.selectedAssignment.course_id;
          this.selectedSectionId = this.selectedAssignment.section_id;
          this.loadStudents();
        }
      },
      error: () => {
        this.error = 'Error al cargar asignaciones';
        this.loading = false;
      }
    });
  }

  selectedAssignment: any = null;

  onAssignmentChange(event: any) {
    const id = event.target.value;
    this.selectedAssignment = this.courses.find(c => c.id === id);
    if (this.selectedAssignment) {
      this.selectedCourseId = this.selectedAssignment.course_id;
      this.selectedSectionId = this.selectedAssignment.section_id;
      this.loadStudents();
    }
  }

  loadStudents() {
    this.loading = true;
    this.attendanceService.getStudentsForAttendance(this.selectedCourseId, this.selectedSectionId).subscribe({
      next: (res) => {
        this.students = (res.data || []).map((e: any) => e.students);
        this.initRecords();
        this.loading = false;
        setTimeout(() => this.initIcons(), 100);
      },
      error: () => {
        this.error = 'Error al cargar estudiantes';
        this.loading = false;
      }
    });
  }

  private initRecords() {
    this.attendanceRecords = {};
    this.students.forEach(s => {
      this.attendanceRecords[s.id] = { status: 'presente', justification: '' };
    });
  }

  updateAttendance(studentId: string, field: string, value: string) {
    if (!this.attendanceRecords[studentId]) {
      this.attendanceRecords[studentId] = { status: 'presente', justification: '' };
    }
    this.attendanceRecords[studentId][field] = value;
  }

  handleSaveAttendance() {
    if (!this.selectedCourseId || !this.selectedSectionId || !this.selectedDate) {
      Swal.fire('Atención', 'Selecciona curso, sección y fecha', 'warning');
      return;
    }

    this.saving = true;
    const data = {
      date: this.selectedDate,
      course_id: this.selectedCourseId,
      section_id: this.selectedSectionId,
      records: Object.entries(this.attendanceRecords).map(([id, rec]) => ({
        student_id: id,
        status: rec.status,
        justification: rec.justification
      }))
    };

    this.attendanceService.saveBatchAttendance(data).subscribe({
      next: (res) => {
        this.saving = false;
        Swal.fire('Guardado', res.message, 'success');
        this.success = 'Asistencia guardada correctamente';
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.saving = false;
        Swal.fire('Error', err.error?.message || 'Error al guardar asistencia', 'error');
      }
    });
  }
}

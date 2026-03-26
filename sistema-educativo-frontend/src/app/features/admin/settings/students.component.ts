//src/app/features/admin/settings/students.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingMetricCardComponent } from '@shared/components/setting-metric-card/setting-metric-card.component';
import { SettingFilterDropdownComponent } from '@shared/components/setting-filter-dropdown/setting-filter-dropdown.component';
import { AcademicService, StudentCourseEnrollment } from '@core/services/academic.service';
import { UserService, UserProfile } from '@core/services/user.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { AdminBackButtonComponent } from "@shared/components/back-button/admin-back-button.component";

interface StudentRecord {
  id: string;
  user_id?: string | null;
  student_code?: string;
  first_name?: string;
  last_name?: string;
  status?: string;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, SettingMetricCardComponent, SettingFilterDropdownComponent, AdminBackButtonComponent],
  template: `
    <div class="min-h-[calc(100vh-80px)] p-6 sm:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in text-slate-700">

    <app-admin-back-button></app-admin-back-button>

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-[#0F172A] tracking-tight">Gestión de Estudiantes</h1>
          <p class="text-slate-500 text-sm font-medium">Visualiza los estudiantes y su información de matrícula</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="flex flex-wrap gap-3 mt-2 mb-6">
        <app-setting-metric-card label="Total Estudiantes" [value]="totalStudents"></app-setting-metric-card>
        <app-setting-metric-card label="Activos" [value]="activeStudents"></app-setting-metric-card>
        <app-setting-metric-card label="Inactivos" [value]="inactiveStudents"></app-setting-metric-card>
        <app-setting-metric-card label="Prom. Cursos" [value]="avgCourses | number:'1.0-1'"></app-setting-metric-card>
      </div>

      <!-- Filter Pill -->
      <div class="bg-white border border-slate-100/50 rounded-[2rem] p-4 shadow-sm flex flex-col lg:flex-row items-center gap-4 px-6">
        <div class="flex items-center gap-4 flex-1 w-full">
          <div class="text-slate-400">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input type="text" [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()" placeholder="Buscar por nombre o email..." class="flex-1 bg-transparent border-none text-sm font-bold text-[#0F172A] focus:ring-0 placeholder-slate-300">
        </div>
        <div class="flex items-center gap-3 w-full lg:w-auto">
          <div class="w-full lg:w-48">
            <app-setting-filter-dropdown
              [options]="[{id: 'true', name: 'Activos'}, {id: 'false', name: 'Inactivos'}]"
              [selectedId]="statusFilter"
              placeholder="Todos los estados"
              (selectionChange)="updateStatusFilter($event)">
            </app-setting-filter-dropdown>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center p-12">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent flex items-center justify-center rounded-full animate-spin"></div>
      </div>

      <!-- Students Table -->
      <div *ngIf="!loading" class="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Estudiante</th>
                <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Cursos Inscritos</th>
                <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                <th class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Fecha Registro</th>
                <th class="px-8 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr *ngFor="let student of filteredStudents" class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-8 py-5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-white shadow-sm flex items-center justify-center text-[#0E3A8A] font-bold text-xs uppercase">
                      {{ student.profile.full_name.charAt(0) }}
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-[#0F172A] leading-tight tracking-tight uppercase">{{ student.profile.full_name }}</span>
                      <span class="text-[10px] font-semibold text-slate-400 lowercase">{{ student.profile.email }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-5 text-center">
                  <button class="px-4 py-2 bg-white text-[#0E3A8A] border-2 border-slate-50 hover:border-[#0E3A8A] rounded-2xl text-[10px] font-bold uppercase tracking-tighter transition-all shadow-sm">
                    {{ student.enrollments.length }} cursos
                  </button>
                </td>
                <td class="px-8 py-5">
                  <span [class]="'px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ' + (student.profile.is_active ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100')">
                    {{ student.profile.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-8 py-5 text-[11px] font-semibold text-slate-400 uppercase tracking-tighter">
                  {{ student.profile.created_at | date:'dd MMM yyyy' }}
                </td>
                <td class="px-8 py-5">
                  <div class="flex justify-end gap-2">
                    <button class="p-2.5 bg-white text-[#0E3A8A] border-2 border-slate-50 hover:border-[#0E3A8A] rounded-xl transition-all shadow-sm active:scale-95 group/edit" title="Ver Detalle">
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="filteredStudents.length === 0" class="p-12 text-center">
            <p class="text-slate-400 font-bold uppercase tracking-widest text-center">No se encontraron estudiantes correspondientes</p>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class StudentsComponent implements OnInit {
  studentsData: { profile: UserProfile, enrollments: StudentCourseEnrollment[] }[] = [];
  filteredStudents: { profile: UserProfile, enrollments: StudentCourseEnrollment[] }[] = [];

  enrollmentsList: StudentCourseEnrollment[] = [];
  studentRecords: StudentRecord[] = [];

  loading = false;
  searchTerm = '';
  statusFilter = '';

  constructor(
    private userService: UserService,
    private academicService: AcademicService
  ) { }

  get totalStudents() { return this.studentsData.length; }
  get activeStudents() { return this.studentsData.filter(s => s.profile.is_active).length; }
  get inactiveStudents() { return this.studentsData.filter(s => !s.profile.is_active).length; }
  get avgCourses() {
    const totalEnrollments = this.studentsData.reduce((acc, curr) => acc + curr.enrollments.length, 0);
    return this.totalStudents === 0 ? 0 : totalEnrollments / this.totalStudents;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    forkJoin({
      students: this.userService.getProfiles({ role: 'student', per_page: 100 } as any),
      studentRows: this.academicService.getStudents({ per_page: 100 }),
      enrollments: this.academicService.getEnrolledStudents({ per_page: 100 })
    }).subscribe({
      next: (res: any) => {
        const studentProfiles = this.extractCollection<UserProfile>(res.students);
        this.studentRecords = this.extractCollection<StudentRecord>(res.studentRows);
        this.enrollmentsList = this.extractCollection<StudentCourseEnrollment>(res.enrollments);

        const studentByUserId = new Map<string, StudentRecord>();
        const studentById = new Map<string, StudentRecord>();

        this.studentRecords.forEach((student) => {
          if (student.user_id) {
            studentByUserId.set(student.user_id, student);
          }
          if (student.id) {
            studentById.set(student.id, student);
          }
        });

        this.studentsData = studentProfiles.map((p: any) => ({
          profile: p,
          enrollments: this.resolveStudentEnrollments(p, studentByUserId, studentById)
        }));

        console.log('[students] profiles:', studentProfiles.length);
        console.log('[students] student rows:', this.studentRecords.length);
        console.log('[students] enrollments:', this.enrollmentsList.length);
        console.log('[students] mapped with enrollments:', this.studentsData.filter((item) => item.enrollments.length > 0).length);

        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        Swal.fire('Error', 'No se pudieron cargar los estudiantes', 'error');
      }
    });
  }

  applyFilters() {
    this.filteredStudents = this.studentsData.filter(student => {
      const matchSearch = this.searchTerm === '' ||
        student.profile.full_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        student.profile.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchStatus = this.statusFilter === '' ||
        student.profile.is_active.toString() === this.statusFilter;

      return matchSearch && matchStatus;
    });
  }

  updateStatusFilter(val: string) {
    this.statusFilter = val;
    this.applyFilters();
  }

  private resolveStudentEnrollments(
    profile: UserProfile,
    studentByUserId: Map<string, StudentRecord>,
    studentById: Map<string, StudentRecord>
  ): StudentCourseEnrollment[] {
    const student = studentByUserId.get(profile.user_id) || studentById.get(profile.id);

    if (!student?.id) {
      return [];
    }

    return this.enrollmentsList.filter((enrollment) => enrollment.student_id === student.id);
  }

  private extractCollection<T>(response: any): T[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.data)) {
      return response.data.data;
    }

    return [];
  }
}

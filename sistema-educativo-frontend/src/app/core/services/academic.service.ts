import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AcademicYear } from '../models/AcademicYear';


export interface GradeLevel {
  id: string;
  name: string;
  level: string;
  grade: number;
}

export interface Section {
  id: string;
  name?: string;
  section_letter?: string;
  grade_level_id: string;
  capacity: number;
  vacancies?: number;
  is_active: boolean;
}

export interface Period {
  id: string;
  name: string;
  academic_year_id: string;
  start_date: string;
  end_date: string;
  is_closed: boolean;
  period_number: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  grade_level_id: string;
  weekly_hours: number;
  color?: string;
}

export interface Competency {
  id: string;
  course_id: string;
  name?: string;
  description: string;
  order?: number;
}

export interface TeacherCourseAssignment {
  id: string;
  user_id: string;
  course_id: string;
  section_id: string;
  academic_year_id: string;
}

export interface StudentCourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  academic_year_id: string;
  status: string;
  enrollment_date?: string;
  user?: any; // The backend usually includes the user object
}

@Injectable({
  providedIn: 'root'
})
export class AcademicService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAcademicYears(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/academic-years`, { params });
  }

  createAcademicYear(data: Partial<AcademicYear>): Observable<any> {
    return this.http.post(`${this.apiUrl}/academic-years`, data);
  }

  updateAcademicYear(id: string, data: Partial<AcademicYear>): Observable<any> {
    return this.http.put(`${this.apiUrl}/academic-years/${id}`, data);
  }

  deleteAcademicYear(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/academic-years/${id}`);
  }

  getGradeLevels(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/grade-levels`, { params });
  }

  createGradeLevel(data: Partial<GradeLevel>): Observable<any> {
    return this.http.post(`${this.apiUrl}/grade-levels`, data);
  }

  updateGradeLevel(id: string, data: Partial<GradeLevel>): Observable<any> {
    return this.http.put(`${this.apiUrl}/grade-levels/${id}`, data);
  }

  deleteGradeLevel(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/grade-levels/${id}`);
  }

  getSections(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/sections`, { params });
  }

  createSection(data: Partial<Section>): Observable<any> {
    return this.http.post(`${this.apiUrl}/sections`, data);
  }

  updateSection(id: string, data: Partial<Section>): Observable<any> {
    return this.http.put(`${this.apiUrl}/sections/${id}`, data);
  }

  deleteSection(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sections/${id}`);
  }

  getPeriods(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/periods`, { params });
  }

  createPeriod(data: Partial<Period>): Observable<any> {
    return this.http.post(`${this.apiUrl}/periods`, data);
  }

  updatePeriod(id: string, data: Partial<Period>): Observable<any> {
    return this.http.put(`${this.apiUrl}/periods/${id}`, data);
  }

  deletePeriod(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/periods/${id}`);
  }

  getCourses(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses`, { params });
  }

  createCourse(data: Partial<Course>): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses`, data);
  }

  updateCourse(id: string, data: Partial<Course>): Observable<any> {
    return this.http.put(`${this.apiUrl}/courses/${id}`, data);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${id}`);
  }

  getCompetencies(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/competencies`, { params });
  }

  createCompetency(data: Partial<Competency>): Observable<any> {
    return this.http.post(`${this.apiUrl}/competencies`, data);
  }

  updateCompetency(id: string, data: Partial<Competency>): Observable<any> {
    return this.http.put(`${this.apiUrl}/competencies/${id}`, data);
  }

  deleteCompetency(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/competencies/${id}`);
  }

  getTeacherCourseAssignments(params?: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/teacher-course-assignments`, { params });
  }

  createTeacherCourseAssignment(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/teacher-course-assignments`, data);
  }

  updateTeacherCourseAssignment(id: string, data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/teacher-course-assignments/${id}`, data);
  }

  deleteTeacherCourseAssignment(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/teacher-course-assignments/${id}`);
  }

  getTeachers(params?: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/teachers`, { params });
  }

  getStudentCourseEnrollments(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/student-course-enrollments`);
  }

  getEnrolledStudents(params?: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}/student-course-enrollments`, { params });
  }
}

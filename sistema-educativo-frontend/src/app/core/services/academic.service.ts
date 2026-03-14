import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AcademicYear {
  id: string;
  year: number;
  is_active: boolean;
}

export interface GradeLevel {
  id: string;
  level: string;
  grade: number;
  section_count?: number;
}

export interface Section {
  id: string;
  academic_year_id: string;
  grade_level_id: string;
  section_letter: string;
  capacity: number;
  vacancies: number;
}

export interface Period {
  id: string;
  academic_year_id: string;
  name: string;
  period_number: number;
  start_date: string;
  end_date: string;
  is_closed: boolean;
  status?: string;
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  credits?: number;
}

export interface Competency {
  id: string;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AcademicService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAcademicYears(): Observable<any> {
    return this.http.get(`${this.apiUrl}/academic-years`);
  }

  getGradeLevels(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/grade-levels`, { params });
  }

  getSections(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/sections`, { params });
  }

  getPeriods(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/periods`, { params });
  }

  getCourses(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/courses`, { params });
  }

  getCompetencies(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/competencies`, { params });
  }

  getEnrolledStudents(params?: any): Observable<any> {
    // Evaluation workflows often need to fetch students enrolled in a specific course/section
    return this.http.get(`${this.apiUrl}/student-course-enrollments`, { params });
  }

  updatePeriod(id: string, data: Partial<Period>): Observable<any> {
    return this.http.put(`${this.apiUrl}/periods/${id}`, data);
  }
}

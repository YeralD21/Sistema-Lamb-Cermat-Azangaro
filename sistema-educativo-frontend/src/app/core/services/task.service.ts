import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Assignment {
  id: string;
  course_id: string;
  section_id: string;
  title: string;
  description?: string;
  instructions?: string;
  due_date: string;
  max_score?: number;
  attachment_url?: string;
  created_by?: string;
  created_at?: string;
}

export interface TaskSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  submission_date?: string;
  content?: string;
  attachment_url?: string;
  status: 'submitted' | 'graded' | 'pending';
  grade?: number;
  grade_letter?: string;
  feedback?: string;
  graded_by?: string;
  graded_at?: string;
  // Relations
  assignment?: Assignment;
  student?: any;
  grader?: any;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // ─── Assignments ──────────

  getAssignments(params?: { course_id?: string; section_id?: string }): Observable<any> {
    return this.http.get(`${this.apiUrl}/assignments`, { params: params as any });
  }

  getAssignment(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/assignments/${id}`);
  }

  createAssignment(data: Partial<Assignment>): Observable<any> {
    return this.http.post(`${this.apiUrl}/assignments`, data);
  }

  updateAssignment(id: string, data: Partial<Assignment>): Observable<any> {
    return this.http.put(`${this.apiUrl}/assignments/${id}`, data);
  }

  deleteAssignment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/assignments/${id}`);
  }

  // ─── Task Submissions ──────

  getSubmissions(params?: {
    assignment_id?: string;
    student_id?: string;
    status?: string;
  }): Observable<any> {
    return this.http.get(`${this.apiUrl}/task-submissions`, { params: params as any });
  }

  gradeSubmission(submissionId: string, data: {
    grade?: number;
    grade_letter?: string;
    feedback?: string;
    status?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/task-submissions/${submissionId}/grade`, data);
  }
}

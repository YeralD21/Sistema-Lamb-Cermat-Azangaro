import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AttendanceJustification {
  id: string;
  attendance_id: string;
  guardian_id: string;
  reason: string;
  status: 'pendiente' | 'aprobada' | 'rechazada';
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getJustifications(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get(`${this.apiUrl}/attendance-justifications`, { params: httpParams });
  }

  approveJustification(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/attendance-justifications/${id}/approve`, {});
  }

  rejectJustification(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/attendance-justifications/${id}/reject`, {});
  }

  // --- Attendance Management ---

  getStudentsForAttendance(courseId: string, sectionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/student-course-enrollments`, {
      params: { course_id: courseId, section_id: sectionId, status: 'active' }
    });
  }

  getAttendanceHistory(params: any): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key]) httpParams = httpParams.set(key, params[key]);
    });
    return this.http.get(`${this.apiUrl}/attendance`, { params: httpParams });
  }

  saveBatchAttendance(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/attendance/batch`, data);
  }
}

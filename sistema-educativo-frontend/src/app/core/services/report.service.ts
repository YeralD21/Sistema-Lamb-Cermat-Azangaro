import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StudentAttendanceJustificationData {
  id: string;
  status: 'pendiente' | 'aprobada' | 'rechazada';
  reason: string;
  review_notes: string | null;
  reviewed_at?: string | null;
}

export interface StudentAttendanceRecord {
  id: string;
  date: string;
  status: 'presente' | 'tarde' | 'falta' | 'justificado';
  justification: string | null;
  course_id: string;
  course_name: string;
  course_code: string;
  justification_data?: StudentAttendanceJustificationData | string | null;
}

export interface StudentAttendanceSummaryResponse {
  student_id: string;
  filters: {
    date_from?: string;
    date_to?: string;
  };
  counts_by_status: Array<{
    status: 'presente' | 'tarde' | 'falta' | 'justificado';
    total: number;
  }>;
  records: StudentAttendanceRecord[];
  recent: StudentAttendanceRecord[];
}

export interface StudentReportCardCompetency {
  evaluation_id: string;
  competency_id: string;
  competency_name: string;
  grade: 'AD' | 'A' | 'B' | 'C' | null;
  status: 'borrador' | 'publicada' | 'cerrada' | string;
  comments: string;
}

export interface StudentReportCardCourse {
  course_id: string;
  course_name: string;
  course_code?: string | null;
  period_id: string;
  period_name: string;
  competencies: StudentReportCardCompetency[];
}

export interface StudentReportCardResponse {
  student: {
    id: string;
    full_name?: string | null;
    dni?: string | null;
    student_code?: string | null;
  };
  filters: {
    period_id?: string | null;
  };
  report: StudentReportCardCourse[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  getReportCard(studentId: string, periodId?: string): Observable<StudentReportCardResponse> {
    let params = new HttpParams();
    if (periodId) params = params.set('period_id', periodId);
    return this.http.get<StudentReportCardResponse>(`${this.apiUrl}/reports/students/${studentId}/report-card`, { params });
  }

  getAttendanceSummary(studentId: string, dateFrom?: string, dateTo?: string): Observable<StudentAttendanceSummaryResponse> {
    let params = new HttpParams();
    if (dateFrom) params = params.set('date_from', dateFrom);
    if (dateTo) params = params.set('date_to', dateTo);
    return this.http.get<StudentAttendanceSummaryResponse>(`${this.apiUrl}/reports/students/${studentId}/attendance`, { params });
  }
}

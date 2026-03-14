import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  getReportCard(studentId: string, periodId?: string): Observable<any> {
    let params = new HttpParams();
    if (periodId) params = params.set('period_id', periodId);
    return this.http.get(`${this.apiUrl}/reports/students/${studentId}/report-card`, { params });
  }

  getAttendanceSummary(studentId: string, dateFrom?: string, dateTo?: string): Observable<any> {
    let params = new HttpParams();
    if (dateFrom) params = params.set('date_from', dateFrom);
    if (dateTo) params = params.set('date_to', dateTo);
    return this.http.get(`${this.apiUrl}/reports/students/${studentId}/attendance`, { params });
  }
}

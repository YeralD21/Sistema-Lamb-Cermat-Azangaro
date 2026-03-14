import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EnrollmentApplication {
  id: string;
  student_first_name: string;
  student_last_name: string;
  student_document_number: string;
  status: 'pending' | 'approved' | 'rejected';
  grade_level_id: string;
  academic_year_id: string;
  created_at: string;
  rejection_reason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/enrollment-applications`;

  getApplications(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }
    return this.http.get(this.apiUrl, { params: httpParams });
  }

  approveApplication(id: string, sectionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve`, { section_id: sectionId });
  }

  rejectApplication(id: string, reason: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reject`, { rejection_reason: reason });
  }
}

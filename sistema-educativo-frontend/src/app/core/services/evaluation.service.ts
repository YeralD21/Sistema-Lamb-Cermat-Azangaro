import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Evaluation {
  id?: string;
  student_id: string;
  course_id: string;
  period_id: string;
  competency_id: string;
  grade: 'AD' | 'A' | 'B' | 'C' | null;
  comments?: string;
  status: 'borrador' | 'publicada' | 'cerrada';
  evaluated_by?: string;
  evaluated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/evaluations`;

  getEvaluations(params: any = {}): Observable<any> {
    return this.http.get<any>(this.apiUrl, { params });
  }

  saveEvaluation(data: Partial<Evaluation>): Observable<Evaluation> {
    // EvaluationController.php uses updateOrCreate
    return this.http.post<Evaluation>(this.apiUrl, data);
  }

  updateEvaluation(id: string, data: Partial<Evaluation>): Observable<Evaluation> {
    return this.http.put<Evaluation>(`${this.apiUrl}/${id}`, data);
  }

  publishEvaluation(id: string): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.apiUrl}/${id}/publish`, {});
  }

  closeEvaluation(id: string): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.apiUrl}/${id}/close`, {});
  }

  deleteEvaluation(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

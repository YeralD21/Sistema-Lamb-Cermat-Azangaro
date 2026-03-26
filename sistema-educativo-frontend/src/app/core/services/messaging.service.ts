import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  status: 'borrador' | 'pendiente_aprobacion' | 'publicado' | 'archivado';
  audience: 'todos' | 'docentes' | 'estudiantes' | 'apoderados' | 'seccion_especifica';
  section_id?: string;
  created_by?: string;
  approved_by?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  creator?: any;
  approver?: any;
  section?: any;
}

export interface Message {
  id: string;
  student_id: string;
  sender_role: 'teacher' | 'guardian';
  sender_id: string;
  title?: string;
  content: string;
  is_read: boolean;
  created_at?: string;
  student?: any;
  sender?: any;
}

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // --- Announcements ---
  getAnnouncements(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.audience) params = params.set('audience', filters.audience);
    }
    return this.http.get<any>(`${this.apiUrl}/announcements`, { params });
  }

  getAnnouncement(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/announcements/${id}`);
  }

  createAnnouncement(data: Partial<Announcement>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/announcements`, data);
  }

  updateAnnouncement(id: string, data: Partial<Announcement>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/announcements/${id}`, data);
  }

  deleteAnnouncement(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/announcements/${id}`);
  }

  requestApproval(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/announcements/${id}/request-approval`, {});
  }

  approveAnnouncement(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/announcements/${id}/approve`, {});
  }

  archiveAnnouncement(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/announcements/${id}/archive`, {});
  }

  // --- Messages ---
  getMessages(filters?: any): Observable<any> {
    let params = new HttpParams();
    if (filters) {
      if (filters.student_id) params = params.set('student_id', filters.student_id);
      if (filters.sender_role) params = params.set('sender_role', filters.sender_role);
      if (filters.is_read !== undefined) params = params.set('is_read', filters.is_read);
    }
    return this.http.get<any>(`${this.apiUrl}/messages`, { params });
  }

  sendMessage(data: Partial<Message>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/messages`, data);
  }

  markAsRead(id: string, data: { is_read: boolean }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/messages/${id}`, data);
  }
}

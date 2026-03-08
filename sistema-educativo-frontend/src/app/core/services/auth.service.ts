import { Injectable, signal } from '@angular/core';
import { User, UserRole } from '../models/user.model';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'cermat_mock_user';
  
  // Using BehaviorSubject for standard RxJS reactivity and a Signal for newer Angular 16+ features
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();
  public currentUser = signal<User | null>(this.getStoredUser());

  constructor(private router: Router) {}

  private getStoredUser(): User | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  // Intercept the login. We don't check for passwords since this is purely a frontend mock routing.
  // We'll map specific emails to roles for fast testing.
  mockLogin(email: string): Observable<{success: boolean; error?: string}> {
    return new Observable(subscriber => {
      // Simulate network delay
      setTimeout(() => {
        let role: UserRole = 'student'; // default
        let name = 'Usuario de Prueba';
        
        email = email.toLowerCase().trim();

        if (email.includes('admin')) {
          role = 'admin';
          name = 'Administrador Sistema';
        } else if (email.includes('teacher') || email.includes('profesor')) {
          role = 'teacher';
          name = 'Profesor Juan';
        } else if (email.includes('student') || email.includes('alumno')) {
          role = 'student';
          name = 'Alumno Pedro';
        } else if (email.includes('guardian') || email.includes('apoderado')) {
          role = 'guardian';
          name = 'Apoderado Maria';
        } else if (email.includes('cashier') || email.includes('caja')) {
          role = 'cashier';
          name = 'Cajero Local';
        } else if (email.includes('administrative') || email.includes('secretaria')) {
          role = 'administrative';
          name = 'Secretaria Ana';
        } else {
          subscriber.next({ success: false, error: 'Por favor usa un correo que contenga el rol, ej: admin@cermat.pe, teacher@...' });
          subscriber.complete();
          return;
        }

        const user: User = {
          id: Math.random().toString(36).substring(7),
          email,
          name,
          role
        };

        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.currentUser.set(user);
        
        subscriber.next({ success: true });
        subscriber.complete();
      }, 800);
    });
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getRole(): UserRole | null {
    return this.currentUserSubject.value?.role || null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}

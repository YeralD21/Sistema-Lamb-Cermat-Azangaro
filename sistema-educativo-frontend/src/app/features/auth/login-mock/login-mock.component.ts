import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login-mock',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-mock.component.html',
})
export class LoginMockComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async handleSubmit() {
    this.error = '';
    this.loading = true;

    this.authService.mockLogin(this.email).subscribe({
      next: (res) => {
        if (!res.success) {
          this.error = res.error || 'Autenticación fallida.';
          this.loading = false;
        } else {
          // Success! Redirect. Since we don't have dashboard yet, we'll redirect to /app
          // In the future this will be the private dashboard
          this.router.navigate(['/app']);
        }
      },
      error: (err) => {
        console.error('Error inesperado en login', err);
        this.error = 'Error al iniciar sesión. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }
}

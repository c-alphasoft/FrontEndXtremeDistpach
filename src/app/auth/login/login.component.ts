import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  isLoading = false;
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  usuario = 'testxtremedispatch@gmail.com';
  usuario2 = 'xtremedispatch@gmail.com';
  contrasena = 12345;
  contrasena2 = 12345;

  constructor(private authService: AuthService, private routes: Router) {}

  ngOnInit() {
    // Cargar credenciales guardadas si existen
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');

    if (savedEmail && savedPassword) {
      this.email = savedEmail;
      this.password = savedPassword;
      this.rememberMe = true;
    }
  }

  check(email: string, password: string) {
    if (!email || !password) {
      Swal.fire('Error de validación', 'Email y password requeridos!', 'error');
      return;
    }

    if (!this.validateEmail(email)) {
      Swal.fire(
        'Error de validación',
        'El email no tiene un formato válido!',
        'error'
      );
      return;
    }

    // Guardar credenciales si el checkbox está marcado
    if (this.rememberMe) {
      localStorage.setItem('savedEmail', email);
      localStorage.setItem('savedPassword', password);
    } else {
      // Borrar credenciales si el checkbox no está marcado
      localStorage.removeItem('savedEmail');
      localStorage.removeItem('savedPassword');
    }

    this.authService.loginUser({ email, password }).subscribe({
      next: (response) => {
        const token = response.token;
        const payload = this.authService.getPayload(token);
        const login = {
          user: payload.username,
          email: payload.email,
          isAuth: true,
          isAdmin: payload.isAdmin,
        };
        this.authService.token = token;
        this.authService.user = login;

        // Guardar datos del usuario en localStorage
        localStorage.setItem('userData', JSON.stringify(login));

        const userRoutes: Record<string, string> = {
          admin: '/admin',
          planner: '/planner',
          user: '/user',
          manager: '/manager',
          customer: '/customer',
        };
        const route = userRoutes[login.user.toLowerCase()] || '/';

        this.routes.navigate([route]).then(() => {
          location.reload();
        });
      },
      error: (error) => {
        if (error.status === 401) {
          Swal.fire('Error en el Login', error.error.message, 'error');
        } else {
          throw error;
        }
      },
    });
  }

  validateEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}

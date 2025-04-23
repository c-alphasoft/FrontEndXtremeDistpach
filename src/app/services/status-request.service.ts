import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { BACKEND_URL } from '../config/config';

@Injectable({
  providedIn: 'root',
})
export class StatusRequestService {
  private url: string = 'http://localhost:8080/api/orders/statusRequests';
  //private url: string = `${BACKEND_URL}/api/orders/statusRequests`;

  constructor(private http: HttpClient, private router: Router) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token'); // Obtiene el token del almacenamiento local
    if (!token) {
      // Si no hay token, puedes manejar el caso de error, como redirigir al login
      throw new Error('Token no encontrado');
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Siempre agrega el token si existe
    });
  }

  updateStatusRequest(orderPayload: any): Observable<any> {
    return this.http
      .put<any>(this.url, orderPayload, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            // Redirigir a la página de login si el token ha expirado o es inválido
            this.router.navigate(['/login']);
          }
          return throwError(error);
        })
      );
  }
}

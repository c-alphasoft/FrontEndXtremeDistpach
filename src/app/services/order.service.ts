import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../modules/interfaces/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private url: string = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Obtiene el token del almacenamiento local
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '', // Solo agrega el token si existe
    });
  }

  findAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.url, { headers: this.getHeaders() });
  }

  findById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.url}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(this.url, order, {
      headers: this.getHeaders(),
    });
  }

  update(id: number, order: any): Observable<Order> {
    return this.http.put<Order>(`${this.url}/${id}`, order, {
      headers: this.getHeaders(),
    });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  findApprovedAll() {
    return this.http.get<Order[]>(`${this.url}/approved`, {
      headers: this.getHeaders(),
    });
  }

  getScheduledOrders(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/scheduled/${email}`);
  }

  getClientOrders(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.url}/by-client-email/${email}`);
  }
}

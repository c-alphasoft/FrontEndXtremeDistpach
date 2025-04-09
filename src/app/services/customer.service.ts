import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../modules/interfaces/customer';
import { BACKEND_URL } from '../config/config';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  //private url: string = 'http://localhost:8080/api/customers';
  private url: string = `${BACKEND_URL}/api/customers`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.url);
  }
}

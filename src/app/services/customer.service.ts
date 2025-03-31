import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../modules/interfaces/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private url: string = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.url);
  }
}

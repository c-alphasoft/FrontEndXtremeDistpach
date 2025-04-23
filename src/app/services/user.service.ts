import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailCustomer } from '../modules/interfaces/emailCustomer';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url: string = 'http://localhost:8080/api/users';
  //private url: string = `${BACKEND_URL}/api/users`;

  constructor(private http: HttpClient) {}

  findByCustomer(email: string): Observable<EmailCustomer> {
    return this.http.get<EmailCustomer>(`${this.url}/by-email`, {
      params: { email },
    });
  }
}

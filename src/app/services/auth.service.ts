import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_URL } from '../config/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string = 'http://localhost:8080/login';
  //private url: string = `${BACKEND_URL}/login`;

  constructor(private http: HttpClient) {}

  private _token: string | undefined;

  private _user: any = {
    isAuth: false,
    isAdmin: false,
    user: undefined,
  };

  loginUser({ email, password }: any): Observable<any> {
    return this.http.post<any>(this.url, { email, password });
  }

  getPayload(token: string) {
    if (token != null) {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    }
    return null;
  }

  authenticated() {
    return this.user.isAuth;
  }

  isAdmin() {
    return this.user.isAdmin;
  }

  getUserRole() {
    return this._user.user;
  }

  logout() {
    this._token = undefined;
    this._user = {
      isAuth: false,
      isAdmin: false,
      user: undefined,
    };
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('token');
  }

  set token(token: string) {
    this._token = token;
    sessionStorage.setItem('token', token);
  }

  get token() {
    if (this._token != undefined) {
      return this._token;
    } else if (sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token') || '';
      return this._token;
    }
    return this._token!;
  }

  set user(user: any) {
    this._user = user;
    sessionStorage.setItem('login', JSON.stringify(user));
  }

  get user() {
    if (this._user.isAuth) {
      return this._user;
    } else if (sessionStorage.getItem('login') != null) {
      this._user = JSON.parse(sessionStorage.getItem('login') || '{}');
      return this._user;
    }
    return this._user;
  }
}

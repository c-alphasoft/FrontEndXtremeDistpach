import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DispatchStatusCount } from '../modules/interfaces/dispatchStatusCount';
import { DispatchClientCount } from '../modules/interfaces/dispatchClientCount';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private url: string = 'http://localhost:8080/api/dashboard';
  //private url: string = `${BACKEND_URL}/api/customers`;

  constructor(private http: HttpClient) {}

  getStatusCounts(): Observable<DispatchStatusCount[]> {
    return this.http.get<DispatchStatusCount[]>(`${this.url}/status-counts`);
  }

  getDispatchClientCounts(
    startDate: string,
    endDate: string
  ): Observable<DispatchClientCount[]> {
    return this.http.get<DispatchClientCount[]>(
      `${this.url}/dispatch-client?startDate=${startDate}&endDate=${endDate}`
    );
  }
}

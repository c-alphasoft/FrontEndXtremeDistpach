// request-dispatch.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';

@Injectable({
  providedIn: 'root'
})
export class RequestDispatchService {
  // Array para almacenar los eventos localmente
  private dispatches: CalendarEvent<any>[] = [];
  private dispatchesSubject: BehaviorSubject<CalendarEvent<any>[]> = new BehaviorSubject<CalendarEvent<any>[]>([]);

  constructor() {}

  // Guarda el evento localmente y emite el nuevo listado
  saveDispatch(event: CalendarEvent<any>): Observable<CalendarEvent<any>> {
    this.dispatches.push(event);
    this.dispatchesSubject.next(this.dispatches);
    return of(event);
  }

  // Método para obtener la lista de eventos
  getDispatches(): Observable<CalendarEvent<any>[]> {
    return this.dispatchesSubject.asObservable();
  }
}


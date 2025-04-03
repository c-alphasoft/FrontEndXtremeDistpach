import { Injectable } from '@angular/core';
import { Order } from '../modules/interfaces/order';
import {
  apiOrdersByShift,
  OrderResponse,
  StatusRequest,
} from '../modules/interfaces/apiOrdersByShift';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderStatusService {
  private Orders: Order[] = [];
  private url: string = 'http://localhost:8080/api/orders/all-orders-by-shift';

  constructor(private http: HttpClient) {}

  getOrdersByShift(): Observable<Order[]> {
    return this.http.get<apiOrdersByShift>(`${this.url}`).pipe(
      map((response) => {
        // Extraer órdenes de ambos turnos
        const ordersTurnoA = response['Turno A'] || [];
        const ordersTurnoB = response['Turno B'] || [];
        const allOrders = [...ordersTurnoA, ...ordersTurnoB];

        // Mapear las órdenes a la clase Order
        return allOrders.map((order: OrderResponse) => ({
          idorders: order.idorders,
          codOrder: order.codOrder,
          client: order.client,
          clientEmail: order.clientEmail,
          applicant: order.applicant,
          product: order.product,
          thunder: order.thunder,
          cod_product: order.cod_product,
          application_date: order.application_date,
          coordinator_concrete: order.coordinator_concrete,
          frequency_radial: order.frequency_radial,
          point_delivery: order.point_delivery,
          final_destination: order.final_destination,
          observation: order.observation,
          time_delivery: order.time_delivery,
          m3: order.m3, // Ya es un número
          dispatch_frequency: order.dispatch_frequency, // Ya es un número
          status: {
            id: order.status.id,
            name: order.status.name,
          },
          statusRequests: order.statusRequests.map(
            (request: StatusRequest) => ({
              id: request.id,
              dispatchCode: request.dispatchCode,
              dispatchTime: request.dispatchTime,
              timeDelivery: request.timeDelivery,
              m3: request.m3,
              status: {
                id: request.status.id,
                name: request.status.name,
              },
              shift: request.shift,
            })
          ),
        }));
      }),
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        return throwError(() => new Error('Error al cargar las órdenes'));
      })
    );
  }
}

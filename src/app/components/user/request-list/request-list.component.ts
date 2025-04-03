import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../modules/interfaces/order';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    TablerIconsModule,
    MatCardModule,
    MatTableModule,
  ],
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss',
})
export class RequestListComponent implements OnInit {
  events: Order[] = [];
  detalle = 'Lista de Despachos';
  panelOpenState = false;
  displayedColumns1: string[] = ['order', 'id', 'm3', 'timeDelivery', 'status'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        const userEmail = userData.email;
        this.loadOrderScheduledAll(userEmail);
      } catch (error) {
        console.error('Error al parsear userData:', error);
      }
    } else {
      console.warn('No se encontraron datos de usuario en localStorage');
    }
  }

  loadOrderScheduledAll(userEmail: string) {
    this.orderService.getClientOrders(userEmail).subscribe((data: Order[]) => {
      this.events = data;
    });
  }
}

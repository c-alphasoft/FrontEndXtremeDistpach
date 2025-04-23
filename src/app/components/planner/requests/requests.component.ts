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

@Component({
  selector: 'app-requests',
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
  ],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss',
})
export class RequestsComponent implements OnInit {
  events: Order[] = [];
  detalle = 'Lista de Despachos';
  panelOpenState = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrderApprovedAll();
  }

  loadOrderApprovedAll() {
    this.orderService.findApprovedAll().subscribe((data: Order[]) => {
      this.events = data;
    });
  }
}

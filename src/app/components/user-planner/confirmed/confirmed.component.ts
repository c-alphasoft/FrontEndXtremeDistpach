import { ConfirmedDetailComponent } from '../../user-planner/confirmed/confirmed-detail/confirmed-detail.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrderService } from '../../../services/order.service';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../../material.module';
import { Order } from '../../../modules/interfaces/order';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-confirmed',
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
  templateUrl: './confirmed.component.html',
  styleUrl: './confirmed.component.scss',
})
export class ConfirmedComponent {
  events: Order[] = [];
  detalle = 'Lista de Despachos Confirmados';
  panelOpenState = false;
  eventForm: FormGroup;

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadOrderApprovedAll();
  }

  loadOrderApprovedAll() {
    this.orderService.findApprovedAll().subscribe((data: Order[]) => {
      this.events = data;
    });
  }

  openProcesarModal(order: any): void {
    const dialogRef = this.dialog.open(ConfirmedDetailComponent, {
      width: '900px',
      data: { order: order },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Modal cerrado con resultado:', result);
      }
    });
  }

  onEdit() {
    throw new Error('Method not implemented.');
  }
}

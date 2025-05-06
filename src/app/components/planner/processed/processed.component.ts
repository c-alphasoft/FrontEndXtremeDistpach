import { ProcessedDetailComponent } from './processed-detail/processed-detail.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrderService } from '../../../services/order.service';
import { CommonModule, formatDate } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Order } from '../../../modules/interfaces/order';
import { MaterialModule } from '../../../material.module';
import { MatInputModule } from '@angular/material/input';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-processed',
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
  templateUrl: './processed.component.html',
  styleUrl: './processed.component.scss',
})
export class ProcessedComponent {
  events: Order[] = [];
  orderForm: FormGroup;
  detalle = 'Lista de Despachos Procesados';

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.orderForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadOrderProcessedAll();
  }

  loadOrderProcessedAll() {
    this.orderService.findProcessedAll().subscribe((data: Order[]) => {
      this.events = data;
      if (this.events.length > 0) {
        this.initializeForm(this.events[0]);
      }
    });
  }

  initializeForm(order: Order) {
    this.orderForm = this.fb.group({
      applicant: [order.applicant],
      application_date: [order.application_date],
      client: [order.client],
      clientEmail: [order.clientEmail],
      codOrder: [order.codOrder],
      cod_product: [order.cod_product],
      coordinator_concrete: [order.coordinator_concrete],
      dispatch_frequency: [order.dispatch_frequency],
      final_destination: [order.final_destination],
      frequency_radial: [order.frequency_radial],
      idorders: [order.idorders],
      m3: [order.m3],
      observation: [order.observation],
      point_delivery: [order.point_delivery],
      product: [order.product],
      thunder: [order.thunder],
      time_delivery: [order.time_delivery],

      // Estos campos deben ser vacíos pero obligatorios
      seal: ['', Validators.required],
      patent: ['', Validators.required],
      conduits: ['', Validators.required],
      conductorRut: ['', Validators.required],

      // status como FormGroup
      status: this.fb.group({
        id: [order.status?.id],
        name: [order.status?.name],
      }),

      // statusRequests como FormArray
      statusRequests: this.fb.array(
        order.statusRequests?.map((req) =>
          this.fb.group({
            dispatchCode: [req.dispatchCode],
            dispatchTime: [req.dispatchTime],
            id: [req.id],
            m3: [req.m3],
            modifiedBy: [req.modifiedBy],
            shift: [req.shift],
            timeDelivery: [req.timeDelivery],

            status: this.fb.group({
              id: [req.status?.id],
              name: [req.status?.name],
            }),

            additionalInformation: this.fb.group({
              aprobado: this.fb.group({
                user: [req.additionalInformation?.aprobado?.user],
                confirmer: [req.additionalInformation?.aprobado?.confirmer],
                approveTime: [req.additionalInformation?.aprobado?.approveTime],
                observation: [req.additionalInformation?.aprobado?.observation],
                confirmation_time: [
                  req.additionalInformation?.aprobado?.confirmation_time,
                ],
              }),
              procesado: this.fb.group({
                seal: [req.additionalInformation?.procesado?.seal],
                patent: [req.additionalInformation?.procesado?.patent],
                conduits: [req.additionalInformation?.procesado?.conduits],
                conductorRut: [
                  req.additionalInformation?.procesado?.conductorRut,
                ],
                processedTime: [
                  req.additionalInformation?.procesado?.processedTime,
                ],
                usuarioProcess: [
                  req.additionalInformation?.procesado?.usuarioProcess,
                ],
              }),
            }),
          })
        ) || []
      ),
    });
  }

  openDistpachedModal(order: Order) {
    const dialogRef = this.dialog.open(ProcessedDetailComponent, {
      width: '900px',
      data: { order: order },
    });
  }
}

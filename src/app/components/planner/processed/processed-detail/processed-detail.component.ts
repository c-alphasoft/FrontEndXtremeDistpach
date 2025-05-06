import { StatusRequestService } from '../../../../services/status-request.service';
import { SharedDataService } from '../../../../services/shared-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { Order } from '../../../../modules/interfaces/order';
import { MaterialModule } from '../../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-processed-detail',
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
  templateUrl: './processed-detail.component.html',
  styleUrl: './processed-detail.component.scss',
})
export class ProcessedDetailComponent {
  receivedData: Order;
  orderForm: FormGroup;
  detalle = 'Procesar Despacho';

  constructor(
    public dialogRef: MatDialogRef<ProcessedDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: Order },
    private StatusRequestService: StatusRequestService,
    private sharedDataService: SharedDataService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.orderForm = this.fb.group({});
    this.receivedData = data.order;
  }

  ngOnInit(): void {
    this.initializeForm(this.data.order);
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
              confirmer: [req.additionalInformation?.aprobado?.confirmer],
              observation: [req.additionalInformation?.aprobado?.observation],
              user: [req.additionalInformation?.aprobado?.user],
              confirmation_time: [
                req.additionalInformation?.aprobado?.confirmation_time,
              ],
            }),
          })
        ) || []
      ),
    });
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onProcesar(): void {
    this.dialogRef.close(true);
  }

  saveDispatch() {
    if (this.orderForm.valid) {
      const formData = this.orderForm.value;
    } else {
      console.log('Formulario inválido, mostrando errores...');
    }
  }
}

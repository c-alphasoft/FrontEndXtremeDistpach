import { StatusRequestService } from '../../../../services/status-request.service';
import { SharedDataService } from '../../../../services/shared-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MaterialModule } from '../../../../material.module';
import { Order } from '../../../../modules/interfaces/order';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-confirmed-detail',
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
  templateUrl: './confirmed-detail.component.html',
  styleUrl: './confirmed-detail.component.scss',
})
export class ConfirmedDetailComponent {
  receivedData: Order;
  orderForm: FormGroup;
  detalle = 'Procesar Despacho';

  constructor(
    public dialogRef: MatDialogRef<ConfirmedDetailComponent>,
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
      this.saveData(formData);
    } else {
      console.log('Formulario inválido, mostrando errores...');
    }
  }

  saveData(formData: any) {
    try {
      const userDataString = localStorage.getItem('userData');
      const userData = userDataString ? JSON.parse(userDataString) : null;
      const statusRequest = formData.statusRequests?.[0] || {};
      const payload = {
        statusRequests: [
          {
            id: statusRequest.id || formData.statusRequests.id || null,
            dispatch_code: statusRequest.dispatchCode || null,
            status: {
              id: 3,
              name: 'Procesado',
            },
            additionalInformation: {
              usuarioProcess: userData?.email || '',
              seal: formData.seal || null,
              patent: formData.patent || null,
              conduits: formData.conduits || null,
              conductorRut: formData.conductorRut || null,
              processedTime: new Date()
                .toISOString()
                .replace(/\..+/, '')
                .replace('Z', ''),
            },
            modifiedBy: 2,
            dispatchTime: statusRequest.dispatchTime || null,
            timeDelivery: statusRequest.timeDelivery || null,
            m3: statusRequest.m3 || formData.m3 || null,
            shift: statusRequest.shift || null,
          },
        ],
      };

      console.log('Datos guardados temporalmente:', payload);
      this.StatusRequestService.updateStatusRequestProcessed(payload).subscribe(
        {
          next: (response) => {
            if (response.success) {
              Swal.fire({
                title: '¡Éxito!',
                text: response.message,
                icon: 'success',
              });
              this.onNoClick();
              this.router.navigate(['/admin/planner/processed']);
            } else {
              Swal.fire({
                title: 'Advertencia',
                text: response.message,
                icon: 'warning',
              });
            }
          },
          error: (err) => {
            console.error('Error completo:', err);
            const errorMsg =
              err.error?.message ||
              (typeof err.error === 'string'
                ? err.error
                : 'Error al procesar la solicitud');

            Swal.fire({
              title: 'Error',
              text: errorMsg,
              icon: 'error',
            });
          },
        }
      );
    } catch (error) {
      console.error('Error al guardar los datos:', error);
    }
  }
}

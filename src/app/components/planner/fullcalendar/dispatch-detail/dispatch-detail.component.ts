import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { CommonModule, formatDate } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatCardModule } from '@angular/material/card';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { EgretCalendarEvent } from '../event.model';
import { OrderService } from '../../../../services/order.service';
import Swal from 'sweetalert2';
import { StatusRequestService } from '../../../../services/status-request.service';

@Component({
  selector: 'app-dispatch-detail',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
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
  templateUrl: './dispatch-detail.component.html',
  styleUrl: './dispatch-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DispatchDetailComponent {
  receivedData: any;
  detalle = 'Detalle de Despacho';
  eventForm: UntypedFormGroup;

  constructor(
    private router: Router,
    private StatusRequestService: StatusRequestService
  ) {
    this.receivedData = history.state.datos;
    this.eventForm = this.buildEventForm(this.receivedData);
  }

  buildEventForm(receivedData: any): UntypedFormGroup {
    // Si no hay datos, crear objeto vacío
    if (!receivedData) {
      receivedData = {};
    }

    // Extraer datos del pedido (order) si existen
    const orderData = receivedData.order || {};
    // Extraer datos del despacho si existen
    const dispatchData = receivedData.despacho || {};

    // Función para formatear la hora a formato 12h AM/PM
    const formatTo12Hour = (dateTimeString: string): string => {
      if (!dateTimeString) return '';

      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '';

      return date.toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    };

    // Función para formatear a solo fecha (sin hora)
    const formatToDateOnly = (dateTimeString: string): string => {
      if (!dateTimeString) return '';

      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '';

      // Formato: YYYY-MM-DD (puedes cambiar el formato según necesites)
      return date.toISOString().split('T')[0];
    };

    // Crear el FormGroup con los valores correspondientes
    const formGroup = new UntypedFormGroup({
      m3_dispatch: new UntypedFormControl(dispatchData.m3, Validators.required),
      dispatch_code: new UntypedFormControl(
        dispatchData.dispatch_code,
        Validators.required
      ),
      m3Order: new UntypedFormControl(orderData.m3 || '', Validators.required),
      shift_dispatch: new UntypedFormControl(
        dispatchData.shift,
        Validators.required
      ),
      observation: new UntypedFormControl('', Validators.required),
      observationOrder: new UntypedFormControl(
        orderData.observation || '',
        Validators.required
      ),
      applicant: new UntypedFormControl(
        orderData.applicant || '',
        Validators.required
      ),
      client: new UntypedFormControl(
        orderData.client || '',
        Validators.required
      ),
      codOrder: new UntypedFormControl(
        orderData.codOrder || '',
        Validators.required
      ),
      clientEmail: new UntypedFormControl(
        orderData.clientEmail || '',
        Validators.required
      ),
      idorders: new UntypedFormControl(
        orderData.idorders || '',
        Validators.required
      ),
      product: new UntypedFormControl(
        orderData.product || '',
        Validators.required
      ),
      status_dispatch: new UntypedFormControl(
        dispatchData.status.name,
        Validators.required
      ),
      cod_product: new UntypedFormControl(
        orderData.cod_product || '',
        Validators.required
      ),
      time_delivery_dispatch: new UntypedFormControl(
        formatTo12Hour(dispatchData.timeDelivery),
        Validators.required
      ),
      time_delivery_order: new UntypedFormControl(
        formatTo12Hour(orderData.time_delivery),
        Validators.required
      ),
      date_delivery_order: new UntypedFormControl(
        formatToDateOnly(orderData.time_delivery),
        Validators.required
      ),
      dispatchTime_dispatch: new UntypedFormControl(
        formatTo12Hour(dispatchData.dispatchTime),
        Validators.required
      ),
      application_date: new UntypedFormControl(
        orderData.application_date,
        Validators.required
      ),
      coordinator_concrete: new UntypedFormControl(
        orderData.coordinator_concrete || '',
        Validators.required
      ),
      dispatch_frequency: new UntypedFormControl(
        orderData.dispatch_frequency || '',
        Validators.required
      ),
      final_destination: new UntypedFormControl(
        orderData.final_destination || '',
        Validators.required
      ),
      frequency_radial: new UntypedFormControl(
        orderData.frequency_radial || '',
        Validators.required
      ),
      point_delivery: new UntypedFormControl(
        orderData.point_delivery || '',
        Validators.required
      ),
    });
    return formGroup;
  }

  ngOnInit(): void {}

  // 1 basic
  panelOpenState = false;

  // 3 accordian
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  saveDispatch(): void {
    if (this.eventForm.valid) {
      const formData = this.eventForm.value;
      const isValid = this.updateOrderData(formData);
    } else {
      console.log('Formulario inválido, mostrando errores...');
    }
  }

  updateOrderData(formData: any) {
    console.log('Datos para guardar:', formData);

    // Función mejorada para conversión de fecha/hora
    const convertToDateTimeISO = (
      dateString: string,
      time12h: string
    ): string => {
      if (!dateString || !time12h) return '';

      // Parsear la fecha en formato YYYY-MM-DD
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);

      // Parsear la hora en formato 12h (ej: "02:15 p. m.")
      const timeParts = time12h.match(/(\d+):(\d+)\s*([apAP])\.?\s*[mM]\.?/);
      if (!timeParts) return '';

      let hours = parseInt(timeParts[1]);
      const minutes = parseInt(timeParts[2]);
      const period = timeParts[3].toLowerCase();

      // Convertir a 24h
      if (period === 'p' && hours !== 12) {
        hours += 12;
      } else if (period === 'a' && hours === 12) {
        hours = 0;
      }

      // Ajustar la hora en la fecha (sin cambiar la zona horaria)
      const adjustedDate = new Date(date);
      adjustedDate.setHours(hours, minutes, 0, 0);

      // Formatear a ISO sin alteración de zona horaria
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${adjustedDate.getFullYear()}-${pad(
        adjustedDate.getMonth() + 1
      )}-${pad(adjustedDate.getDate())}T${pad(hours)}:${pad(minutes)}:00`;
    };

    const orderPayload = {
      statusRequests: [
        {
          id: this.receivedData.despacho.id,
          dispatch_code: this.receivedData.despacho.dispatch_code,
          status: {
            id: 2,
            name: 'Aprobado',
          },
          additionalInformation: {
            observation: formData.observation,
          },
          modifiedBy: 1,
          dispatchTime: convertToDateTimeISO(
            formData.application_date,
            formData.dispatchTime_dispatch
          ),
          timeDelivery: convertToDateTimeISO(
            formData.application_date,
            formData.time_delivery_dispatch
          ),
          m3: formData.m3_dispatch,
          shift: formData.shift_dispatch,
        },
      ],
      application_date: formData.application_date,
    };

    console.log('Payload a enviar:', JSON.stringify(orderPayload, null, 2));
    this.StatusRequestService.updateStatusRequest(orderPayload).subscribe({
      next: (response) => {
        if (response.success) {
          Swal.fire({
            title: '¡Éxito!',
            text: response.message,
            icon: 'success',
          });
          this.router.navigate(['/admin/planner/calendar']);
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
    });
  }
}

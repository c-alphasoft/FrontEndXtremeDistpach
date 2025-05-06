import { StatusRequestService } from '../../../../services/status-request.service';
import { SharedDataService } from '../../../../services/shared-data.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MaterialModule } from '../../../../material.module';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';

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
    NgxMatTimepickerModule,
    MatCardModule,
  ],
  templateUrl: './dispatch-detail.component.html',
  styleUrl: './dispatch-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DispatchDetailComponent {
  receivedData: any;
  detalle = 'Detalle de Despacho';
  eventForm: FormGroup;
  panelOpenState = false;
  step = 0;
  required: boolean = false;
  roads = [
    { name: 'Email' },
    { name: 'WhatsApp' },
    { name: 'Llamada' },
    { name: 'Mensaje' },
  ];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private sharedDataService: SharedDataService,
    private StatusRequestService: StatusRequestService
  ) {
    this.eventForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.receivedData = history.state.datos;
    console.log('Datos activos', this.receivedData);

    this.initializeForm(this.receivedData);
  }
  initializeForm(receivedData: any) {
    const orderData = receivedData.order || {};
    const dispatchData = receivedData.despacho || {};
    const formatTo12Hour = (dateTimeString: string): string => {
      if (!dateTimeString) return '';

      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '';

      const rawTime = date.toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      // Reemplazar "a. m." o "p. m." con "AM"/"PM"
      return rawTime
        .replace(/\s*a\.?\s*m\.?/i, ' AM')
        .replace(/\s*p\.?\s*m\.?/i, ' PM');
    };

    this.eventForm = this.fb.group({
      // Dispatch
      dispatchId: [dispatchData.id || '', Validators.required],
      dispatchCode: [dispatchData.dispatchCode || '', Validators.required],
      dispatchM3: [dispatchData.m3 || '', Validators.required],
      dispatchShift: [dispatchData.shift || '', Validators.required],
      dispatchStatus: [dispatchData.status.name || '', Validators.required],
      dispatchConfirmationTime: [dayjs().format('HH:mm'), Validators.required],
      dispatchConfirmationRoute: ['', Validators.required],
      dispatchConfirmer: ['', Validators.required],
      dispatchObservation: ['', Validators.required],
      dispatchTime: [
        formatTo12Hour(dispatchData.dispatchTime) || '',
        Validators.required,
      ],
      dispatchTimeDelivery: [
        formatTo12Hour(dispatchData.timeDelivery) || '',
        Validators.required,
      ],

      // Order
      m3Order: [orderData.m3 || '', Validators.required],
      observationOrder: [orderData.observation || '', Validators.required],
      applicant: [orderData.applicant || '', Validators.required],
      client: [orderData.client || '', Validators.required],
      codOrder: [orderData.codOrder || '', Validators.required],
      clientEmail: [orderData.clientEmail || '', Validators.required],
      idorders: [orderData.idorders || '', Validators.required],
      cod_product: [orderData.cod_product || '', Validators.required],
      product: [orderData.product || '', Validators.required],
      application_date: [orderData.application_date || '', Validators.required],
      frequency_radial: [orderData.frequency_radial || '', Validators.required],
      point_delivery: [orderData.point_delivery || '', Validators.required],
      time_delivery_order: [
        formatTo12Hour(orderData.time_delivery) || '',
        Validators.required,
      ],
      date_delivery_order: [
        orderData.application_date || '',
        Validators.required,
      ],
      coordinator_concrete: [
        orderData.coordinator_concrete || '',
        Validators.required,
      ],
      dispatch_frequency: [
        orderData.dispatch_frequency || '',
        Validators.required,
      ],
      final_destination: [
        orderData.final_destination || '',
        Validators.required,
      ],
    });
    this.cdr.detectChanges();
  }

  updateRoadInfo(selectedRoad: string): void {
    const roadSelect = this.roads.find((road) => road.name === selectedRoad);
  }

  openFromIcon(timepicker: { open: () => void }) {
    if (!this.eventForm.disabled) {
      timepicker.open();
    }
  }

  onClear($event: Event) {
    this.eventForm.get('dispatchConfirmationTime')?.reset();
  }

  saveDispatch(): void {
    if (this.eventForm.valid) {
      const formData = this.eventForm.value;
      this.updateOrderData(formData);
    } else {
      console.log('Formulario inválido, mostrando errores...');
    }
  }

  updateOrderData(formData: any) {
    const userDataString = localStorage.getItem('userData');

    if (userDataString) {
      const userData = JSON.parse(userDataString);

      const convertToDateTimeISO = (
        dateString: string,
        timeString: string
      ): string => {
        if (!dateString || !timeString) return '';

        // Parsear la fecha (YYYY-MM-DD)
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);

        let hours = 0;
        let minutes = 0;

        const is12HourFormat = /(am|pm)/i.test(timeString);

        if (is12HourFormat) {
          // Formato 12h como "11:00 am"
          const timeParts = timeString.match(/(\d+):(\d+)\s*(am|pm)/i);
          if (!timeParts) return '';

          hours = parseInt(timeParts[1]);
          minutes = parseInt(timeParts[2]);
          const period = timeParts[3];

          if (period === 'pm' && hours !== 12) hours += 12;
          if (period === 'am' && hours === 12) hours = 0;
        } else {
          // Formato 24h como "14:45"
          const [h, m] = timeString.split(':').map(Number);
          if (isNaN(h) || isNaN(m)) return '';
          hours = h;
          minutes = m;
        }

        // Asignar la hora en el objeto Date
        date.setHours(hours, minutes, 0, 0);

        // Formatear como ISO sin zona horaria
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
          date.getDate()
        )}T${pad(hours)}:${pad(minutes)}:00`;
      };

      const orderPayload = {
        statusRequests: [
          {
            id: formData.dispatchId || '',
            dispatch_code: formData.codOrder || '',
            status: {
              id: 2,
              name: 'Aprobado',
            },
            additionalInformation: {
              confirmation_time:
                convertToDateTimeISO(
                  formData.application_date,
                  formData.dispatchConfirmationTime
                ) || '',
              user: userData?.email || 'Usuario desconocido',
              approveTime: new Date()
                .toISOString()
                .replace(/\..+/, '')
                .replace('Z', ''),
              confirmer: formData.dispatchConfirmer || '',
              observation: formData.dispatchObservation,
            },
            modifiedBy: 1,
            dispatchTime:
              convertToDateTimeISO(
                formData.application_date,
                formData.dispatchTime
              ) || '',
            timeDelivery:
              convertToDateTimeISO(
                formData.application_date,
                formData.dispatchTimeDelivery
              ) || '',
            m3: formData.dispatchM3 || '',
            shift: formData.dispatchShift || '',
          },
        ],
      };

      console.log('Payload final a enviar:', orderPayload);
      this.StatusRequestService.updateStatusRequest(orderPayload).subscribe({
        next: (response) => {
          if (response.success) {
            Swal.fire({
              title: '¡Éxito!',
              text: response.message,
              icon: 'success',
            });
            this.sharedDataService.setData(orderPayload);
            this.router.navigate(['/admin/planner/confirmed']);
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
    } else {
      console.warn('No se encontró información del usuario en localStorage');
    }
  }

  onEdit() {
    const formData = this.eventForm.value;

    const finalData = {
      order: {
        idorders: formData.idorders,
        codOrder: formData.codOrder,
        client: formData.client,
        clientEmail: formData.clientEmail,
        applicant: formData.applicant,
        product: formData.product,
        cod_product: formData.cod_product,
        m3: formData.m3Order,
        application_date: formData.application_date,
        coordinator_concrete: formData.coordinator_concrete,
        frequency_radial: formData.frequency_radial,
        point_delivery: formData.point_delivery,
        final_destination: formData.final_destination,
        observation: formData.observationOrder,
        dispatch_frequency: formData.dispatch_frequency,
        time_delivery:
          formData.date_delivery_order +
          'T' +
          this.convertTo24Hour(formData.time_delivery_order) +
          ':00',
      },
      despacho: {
        id: formData.dispatchId,
        dispatchCode: formData.dispatchCode,
        dispatchTime: this.convertToDateTime(
          formData.date_delivery_order,
          formData.dispatchTime
        ),
        timeDelivery: this.convertToDateTime(
          formData.date_delivery_order,
          formData.dispatchTimeDelivery
        ),
        m3: formData.dispatchM3,
        status: {
          id: 1, // Puedes obtenerlo dinámicamente si lo tienes
          name: formData.dispatchStatus,
        },
        shift: formData.dispatchShift,
      },
    };

    console.log('FINAL JSON', finalData);
    sessionStorage.setItem('datosParaEditar', JSON.stringify(finalData));
    this.router.navigate(['/admin/planner/edit-dispatch'], {
      state: { datos: finalData },
    });
  }

  convertToDateTime(date: string, time12h: string): string {
    const [hours, minutes] = this.convertTo24Hour(time12h).split(':');
    return `${date}T${hours}:${minutes}:00`;
  }

  convertTo24Hour(time12h: string): string {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (modifier === 'PM' && hours !== '12') {
      hours = String(parseInt(hours) + 12);
    }
    if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }
    return `${hours}:${minutes}`;
  }
}

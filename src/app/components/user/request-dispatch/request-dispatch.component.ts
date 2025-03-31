import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { DateTime } from 'luxon';
import { MaterialModule } from '../../../material.module';
import { Customer } from '../../../modules/interfaces/customer';
import { Product } from '../../../modules/interfaces/product';
import { Turno } from '../../../modules/interfaces/thunder';
import { CustomerService } from '../../../services/customer.service';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { EgretCalendarEvent } from '../../planner/fullcalendar/event.model';
import { Order } from '../../../modules/interfaces/order';

@Component({
  selector: 'app-request-dispatch',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    NgxMatTimepickerModule,
  ],
  templateUrl: './request-dispatch.component.html',
  styleUrl: './request-dispatch.component.scss',
  providers: [provideNativeDateAdapter(), DatePipe],
})
export class RequestDispatchComponent implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  datosRecibidos: any;
  eventForm: UntypedFormGroup;
  event = signal<any>(null);
  clientes: Customer[] = [];
  productos: Product[] = [];

  turnos: Turno[] = [
    { value: 'A', viewValue: 'A' },
    { value: 'B', viewValue: 'B' },
  ];

  required: boolean = false;
  maxTime: DateTime = DateTime.local().set({ hour: 16 });
  minTime: DateTime = DateTime.local().set({ hour: 14 });

  @ViewChild('timepicker') timepicker: any;

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private productService: ProductService,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {
    this.datosRecibidos = history.state?.datos || {};

    this.event.set(
      new EgretCalendarEvent({
        start: this.datosRecibidos.date,
      })
    );
    this.eventForm = this.buildEventForm(this.event());
  }

  ngOnInit(): void {
    this.getCustomer();
    this.getProduct();
    this.setDefaultTime();
  }

  getCustomer(): void {
    this.customerService.findAll().subscribe(
      (data) => (this.clientes = data),
      (error) => console.error('Error al cargar clientes', error)
    );
  }

  updateClientInfo(clientName: string): void {
    const clienteSeleccionado = this.clientes.find(
      (cliente) => cliente.customer === clientName
    );

    if (clienteSeleccionado) {
      this.eventForm.patchValue({
        applicant: clienteSeleccionado.applicant || '',
        coordinator_concrete: clienteSeleccionado.concrete_coordinator || '',
        frequency_radial: clienteSeleccionado.radial_frequency || '',
        final_destination: clienteSeleccionado.final_destinacion || '',
        point_delivery: clienteSeleccionado.delivery_point || '',
      });
    }
  }

  updateProductName(codProduct: string): void {
    const productoEncontrado = this.productos.find(
      (product) => product.codProduct === codProduct
    );

    if (productoEncontrado) {
      this.eventForm.get('product')?.setValue(productoEncontrado.nameProduct);
    } else {
      this.eventForm.get('product')?.setValue('');
    }
  }

  setDefaultTime() {
    const now = DateTime.local().toFormat('HH:mm');
    this.eventForm.get('time_delivery')?.setValue(now);
    this.cdr.detectChanges();
  }

  buildEventForm(event: any): any {
    if (!event) {
      event = {};
    }
    const formattedDate = event.start ? new Date(event.start) : null;
    const formGroup = new UntypedFormGroup({
      client: new UntypedFormControl(event.client, Validators.required),
      applicant: new UntypedFormControl(event.applicant, Validators.required),
      product: new UntypedFormControl(event.product, Validators.required),
      thunder: new UntypedFormControl(event.thunder, Validators.required),
      m3: new UntypedFormControl(event.m3, Validators.required),
      application_date: new UntypedFormControl(formattedDate),
      dispatch_frequency: new UntypedFormControl(
        event.dispatch_frequency,
        Validators.required
      ),
      cod_product: new UntypedFormControl(
        event.cod_product,
        Validators.required
      ),
      coordinator_concrete: new UntypedFormControl(
        event.coordinator_concrete,
        Validators.required
      ),
      frequency_radial: new UntypedFormControl(
        event.frequency_radial,
        Validators.required
      ),
      point_delivery: new UntypedFormControl(
        event.point_delivery,
        Validators.required
      ),
      final_destination: new UntypedFormControl(
        event.final_destination,
        Validators.required
      ),
      observation: new UntypedFormControl(
        event.observation,
        Validators.required
      ),
      time_delivery: new UntypedFormControl(
        event.time_delivery || '',
        Validators.required
      ),
    });
    return formGroup;
  }

  openFromIcon(timepicker: { open: () => void }) {
    if (!this.eventForm.disabled) {
      timepicker.open();
    }
  }

  onClear($event: Event) {
    this.eventForm.get('time_delivery')?.reset();
  }

  getProduct(): void {
    this.productService.findAll().subscribe(
      (data) => {
        this.productos = data;
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const formData = this.eventForm.value;
      const isValid = this.validateFormData(formData);
      if (isValid) {
        this.addOrderData(this.eventForm.value);
      }
    }
  }

  addOrderData(order_obj: Order): void {
    // Recuperar los datos del localStorage
    let userEmail = '';
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      console.warn('No se encontraron datos de usuario en el localStorage.');
    } else {
      try {
        const userData = JSON.parse(userDataString);
        userEmail = userData.email;
      } catch (error) {
        console.error('Error al parsear los datos del usuario:', error);
      }
    }

    if (!order_obj.time_delivery) {
      console.error('⚠️ Error: timeDelivery está vacío o indefinido.');
      return;
    }

    // Combina application_date y time_delivery para crear un objeto Date completo
    const [hours, minutes] = order_obj.time_delivery.split(':').map(Number);
    const selectedDateTime = new Date(order_obj.application_date);
    const selectedDate = new Date(order_obj.application_date);
    selectedDateTime.setHours(hours, minutes, 0);

    if (isNaN(selectedDateTime.getTime())) {
      console.error('⚠️ Error: No se pudo crear la fecha completa.');
      return;
    }
    if (isNaN(selectedDate.getTime())) {
      console.error('⚠️ Error: No se pudo crear la fecha completa.');
      return;
    }

    // Formatear application_date si es necesario
    const applicationDateTimeFormatted = dayjs(selectedDateTime).format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    const applicationDateFormatted =
      dayjs(selectedDateTime).format('YYYY-MM-DD');

    const normalizeAndConvertToNumber = (value: string | number): number => {
      if (typeof value === 'number') {
        return value; // Si ya es un número, devuélvelo tal cual
      }
      // Reemplazar comas por puntos y convertir a número
      const normalizedValue = value.replace(',', '.');
      const numericValue = parseFloat(normalizedValue);
      return isNaN(numericValue) ? 0.0 : numericValue; // Si no es un número, devuelve 0.0
    };

    // Normalizar y convertir m3 a string
    const m3AsString = normalizeAndConvertToNumber(order_obj.m3);

    const orderPayload: Order = {
      idorders: 0,
      codOrder: '',
      client: order_obj.client?.trim() || '',
      clientEmail: userEmail,
      applicant: order_obj.applicant?.trim() || '',
      product: order_obj.product?.trim() || '',
      thunder: order_obj.thunder?.trim() || '',
      cod_product: order_obj.cod_product?.trim() || '',
      application_date: applicationDateFormatted,
      coordinator_concrete: order_obj.coordinator_concrete?.trim() || '',
      frequency_radial: order_obj.frequency_radial?.trim() || '',
      point_delivery: order_obj.point_delivery?.trim() || '',
      final_destination: order_obj.final_destination?.trim() || '',
      observation: order_obj.observation?.trim() || '',
      time_delivery: applicationDateTimeFormatted,
      m3: m3AsString,
      dispatch_frequency: order_obj.dispatch_frequency,
      status: {
        id: 1,
        name: 'Programado',
      },
      statusRequests: [],
    };
    console.log('Orden', orderPayload);
    this.orderService.create(orderPayload).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Creada nueva Solicitud!',
          text: 'Creada con éxito!',
          icon: 'success',
        });
        this.router.navigate(['/user/solicitud']);
      },
      error: (err) => {
        console.error('Error al crear la solicitud:', err);
        if (err.status === 400) {
          Swal.fire({
            title: 'Error!',
            text: err.error.message,
            icon: 'error',
          });
        } else {
          Swal.fire({
            title: 'Error inesperado!',
            text: 'Intenta nuevamente más tarde.',
            icon: 'error',
          });
        }
      },
    });
  }

  validateFormData(data: any): boolean {
    let isValid = true;
    console.log('Data', data);

    if (data.application_date && data.time_delivery) {
      let selectedDate: Date;

      // Procesar la fecha de aplicación
      if (typeof data.application_date === 'string') {
        const [day, month, year] = data.application_date.split('/');
        selectedDate = new Date(`${year}-${month}-${day}`);
      } else if (data.application_date instanceof Date) {
        selectedDate = data.application_date;
      } else {
        return false;
      }

      // Convertir time_delivery de 12 horas a 24 horas correctamente
      const timeString = data.time_delivery.trim();
      let hours: number;
      let minutes: number;

      if (timeString.includes('AM') || timeString.includes('PM')) {
        const timeParts = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!timeParts) {
          return false;
        }
        hours = parseInt(timeParts[1], 10);
        minutes = parseInt(timeParts[2], 10);
        const period = timeParts[3].toUpperCase();

        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }
      } else {
        // Si ya está en formato 24 horas, solo separar
        [hours, minutes] = timeString.split(':').map(Number);
      }

      data.time_delivery = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        Swal.fire({
          title: 'Error!',
          text: 'No se pueden hacer solicitudes con fechas anteriores al día actual.',
          icon: 'error',
        });
        isValid = false;
      } else if (
        selectedDate.getDate() === today.getDate() &&
        selectedDate.getMonth() === today.getMonth() &&
        selectedDate.getFullYear() === today.getFullYear()
      ) {
        // Convertir data.time_delivery (HH:mm) a objeto Date
        const [hours24, minutes24] = data.time_delivery.split(':').map(Number);
        const selectedTime = new Date(selectedDate);
        selectedTime.setHours(hours24, minutes24, 0, 0);

        // Calcular 3 horas después de la hora actual
        const now = new Date();
        if (hours24 < now.getHours()) {
          selectedTime.setDate(selectedTime.getDate() + 1);
        }
        const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

        // Validar si la hora seleccionada es menor a 3 horas después
        if (selectedTime < threeHoursLater) {
          const formattedMinTime = threeHoursLater.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
          Swal.fire({
            title: 'Error!',
            text: `Horas disponibles para despachos a partir de las: ${formattedMinTime}`,
            icon: 'error',
          });
          isValid = false;
        }
      }

      // Convertir dispatch_frequency a número
      const dispatchFrequency = parseInt(data.dispatch_frequency, 10);
      if (isNaN(dispatchFrequency) || dispatchFrequency < 15) {
        Swal.fire({
          title: 'Error!',
          text: 'La frecuencia de despachos debe ser como mínimo de 15 minutos.',
          icon: 'error',
        });
        isValid = false;
      }
    }
    return isValid;
  }
}

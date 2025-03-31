import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { DateTime } from 'luxon';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../../material.module';
import { Order } from '../../../modules/interfaces/order';
import { Customer } from '../../../modules/interfaces/customer';
import { Product } from '../../../modules/interfaces/product';
import { Turno } from '../../../modules/interfaces/thunder';
import { OrderService } from '../../../services/order.service';
import { CustomerService } from '../../../services/customer.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CommonModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    NgxMatTimepickerModule,
  ],
  templateUrl: './edit-order.component.html',
  styleUrl: './edit-order.component.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CL' }, // 📅 Cambia el formato de fecha
  ],
})
export class EditOrderComponent implements OnInit {
  receivedData: any;
  order!: Order;
  orderForm!: FormGroup;
  eventForm: UntypedFormGroup;
  clientes: Customer[] = [];
  productos: Product[] = [];
  required: boolean = false;
  maxTime: DateTime = DateTime.local().set({ hour: 16 });
  minTime: DateTime = DateTime.local().set({ hour: 14 });

  turnos: Turno[] = [
    { value: 'A', viewValue: 'A' },
    { value: 'B', viewValue: 'B' },
  ];

  constructor(
    private router: Router,
    private orderService: OrderService,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.receivedData = history.state.datos;
    this.eventForm = this.buildEventForm(
      this.receivedData?.date?.meta?.order || {}
    );
  }

  ngOnInit(): void {
    if (this.receivedData?.date?.meta?.order) {
      this.validateData(this.receivedData.date.meta.order);
    }
    this.getCustomer();
    this.getProduct();

    if (this.receivedData?.date?.meta?.order?.time_delivery) {
      this.setDeliveryTime(this.receivedData.date.meta.order.time_delivery);
    }

    const fechaString = this.eventForm.get('application_date')?.value;
    if (fechaString) {
      this.eventForm.patchValue({
        application_date: this.convertToDate(fechaString),
      });
    }
  }

  setDeliveryTime(time: string) {
    const date = new Date(time);

    if (!isNaN(date.getTime())) {
      const formattedTime = date.toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      this.eventForm.get('time_delivery')?.setValue(formattedTime);
      this.cdr.detectChanges();
    } else {
      console.error('❌ Error: Formato de hora no válido →', time);
    }
  }

  formatTime(isoString: string): Date {
    return new Date(isoString);
  }

  private convertToDate(date: string | Date): Date {
    if (typeof date === 'string') {
      const [year, month, day] = date.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return date;
  }

  buildEventForm(event: any): any {
    if (!event) {
      event = {};
    }

    const formGroup = new UntypedFormGroup({
      client: new UntypedFormControl(event.client, Validators.required),
      product: new UntypedFormControl(event.product, Validators.required),
      applicant: new UntypedFormControl(event.applicant, Validators.required),
      m3: new UntypedFormControl(event.m3, Validators.required),
      thunder: new UntypedFormControl(event.thunder, Validators.required),
      coordinator_concrete: new UntypedFormControl(
        event.coordinator_concrete,
        Validators.required
      ),
      frequency_radial: new UntypedFormControl(
        event.frequency_radial,
        Validators.required
      ),
      final_destination: new UntypedFormControl(
        event.final_destination,
        Validators.required
      ),
      point_delivery: new UntypedFormControl(
        event.point_delivery,
        Validators.required
      ),
      cod_product: new UntypedFormControl(
        event.cod_product,
        Validators.required
      ),
      application_date: new UntypedFormControl(
        event.application_date,
        Validators.required
      ),
      time_delivery: new UntypedFormControl(
        event.time_delivery || '',
        Validators.required
      ),
      dispatch_frequency: new UntypedFormControl(
        event.dispatch_frequency,
        Validators.required
      ),
      observation: new UntypedFormControl(
        event.observation,
        Validators.required
      ),
    });
    return formGroup;
  }

  validateData(receivedData: any) {
    if (receivedData) {
      this.order = receivedData;
      this.eventForm.patchValue(this.order);
    }
  }

  getCustomer(): void {
    this.customerService.findAll().subscribe(
      (data) => (this.clientes = data),
      (error) => console.error('Error al cargar clientes', error)
    );
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

  onClear($event: Event) {
    this.eventForm.get('time_delivery')?.reset();
  }

  openFromIcon(timepicker: { open: () => void }) {
    if (!this.eventForm.disabled) {
      timepicker.open();
    }
  }

  saveOrder(): void {
    if (this.eventForm.valid) {
      const formData = this.eventForm.value;
      const isValid = this.validateFormData(formData);
      if (isValid) {
        this.addOrderData(this.eventForm.value);
      }
    }
  }
  validateFormData(data: any): boolean {
    let isValid = true;
    if (data.application_date && data.time_delivery) {
      let selectedDate: Date;

      // Procesar la fecha (ya viene como Date)
      if (data.application_date instanceof Date) {
        selectedDate = new Date(data.application_date);
      } else {
        return false;
      }

      // Verificar formato de hora (aceptar tanto 24h como 12h)
      const timeString = data.time_delivery.trim();
      let hours: number, minutes: number;

      // Intenta parsear formato 24h (HH:mm)
      const time24Parts = timeString.match(/^(\d{1,2}):(\d{2})$/);

      if (time24Parts) {
        hours = parseInt(time24Parts[1], 10);
        minutes = parseInt(time24Parts[2], 10);

        // Validar rango horario
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
          return false;
        }

        data.time_delivery = `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}`;
      }
      // Si no es 24h, intenta parsear formato 12h (hh:mm AM/PM)
      else {
        const time12Parts = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!time12Parts) {
          return false;
        }

        hours = parseInt(time12Parts[1], 10);
        minutes = parseInt(time12Parts[2], 10);
        const period = time12Parts[3].toUpperCase();

        // Validar rango horario
        if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
          return false;
        }

        // Convertir a 24h
        if (period === 'PM' && hours !== 12) {
          hours += 12;
        } else if (period === 'AM' && hours === 12) {
          hours = 0;
        }

        data.time_delivery = `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}`;
      }

      // Resto de la validación (fecha y frecuencia)
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
        const [hours24, minutes24] = data.time_delivery.split(':').map(Number);
        const selectedTime = new Date(selectedDate);
        selectedTime.setHours(hours24, minutes24, 0, 0);

        const now = new Date();
        const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

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

      // Validar frecuencia de despachos
      const dispatchFrequency = Number(data.dispatch_frequency);
      if (isNaN(dispatchFrequency) || dispatchFrequency < 15) {
        Swal.fire({
          title: 'Error!',
          text: 'La frecuencia de despachos debe ser como mínimo de 15 minutos.',
          icon: 'error',
        });
        isValid = false;
      }
    } else {
      isValid = false;
    }
    return isValid;
  }

  addOrderData(order_obj: any): void {
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

    const orderPayload = {
      codOrder: this.receivedData?.date?.meta?.order?.codOrder,
      client: order_obj.client?.trim() || '',
      applicant: order_obj.applicant?.trim() || '',
      product: order_obj.product?.trim() || '',
      coordinator_concrete: order_obj.coordinator_concrete?.trim() || '',
      frequency_radial: order_obj.frequency_radial?.trim() || '',
      cod_product: order_obj.cod_product?.trim() || '',
      point_delivery: order_obj.point_delivery?.trim() || '',
      final_destination: order_obj.final_destination?.trim() || '',
      application_date: applicationDateFormatted,
      time_delivery: applicationDateTimeFormatted,
      dispatch_frequency: order_obj.dispatch_frequency,
      m3: m3AsString,
      observation: order_obj.observation?.trim() || '',
      thunder: order_obj.thunder?.trim() || '',
      clientEmail: userEmail,
      status: {
        id: 1,
        name: 'Programado',
      },
    };
    this.orderService.update(this.receivedData.id, orderPayload).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Solicitud Modificada!',
          text: 'Editada con éxito!',
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
}

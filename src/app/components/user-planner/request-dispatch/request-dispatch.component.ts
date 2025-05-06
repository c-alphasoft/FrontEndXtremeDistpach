import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Customer } from '../../../modules/interfaces/customer';
import { OrderService } from '../../../services/order.service';
import { Product } from '../../../modules/interfaces/product';
import { MaterialModule } from '../../../material.module';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DateTime } from 'luxon';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';

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
  @ViewChild('timepicker') timepicker: any;
  eventForm: UntypedFormGroup;
  clientes: Customer[] = [];
  selectedCustomerProducts: Product[] = [];
  required: boolean = false;
  maxTime: DateTime = DateTime.local().set({ hour: 16 });
  minTime: DateTime = DateTime.local().set({ hour: 14 });
  showFrequencyField = false;
  selectedCustomer: Customer | null = null;

  constructor(
    private customerService: CustomerService,
    private fb: UntypedFormBuilder,
    private router: Router,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {
    const today = new Date();
    this.eventForm = this.fb.group({
      customer: ['', Validators.required],
      applicant: ['', Validators.required],
      concreteCoordinator: ['', Validators.required],
      radialFrequency: ['', Validators.required],
      deliveryPoint: ['', Validators.required],
      finalDestination: ['', Validators.required],
      codProduct: ['', Validators.required],
      nameProduct: ['', Validators.required],
      application_date: [today, Validators.required],
      time_delivery: ['', Validators.required],
      m3: ['', Validators.required],
      dispatch_frequency: [15],
      observation: ['', Validators.required],
    });

    this.eventForm.get('m3')?.valueChanges.subscribe((value) => {
      const numericValue = parseFloat(value) || 0;
      this.showFrequencyField = numericValue > 7;

      const frequencyControl = this.eventForm.get('dispatch_frequency');

      if (!this.showFrequencyField) {
        frequencyControl?.setValue(15);
        frequencyControl?.clearValidators();
        frequencyControl?.disable();
      } else {
        frequencyControl?.enable();
        frequencyControl?.setValidators([
          Validators.required,
          Validators.min(15),
        ]);
      }
    });
    this.eventForm.get('dispatch_frequency')?.disable();
  }

  ngOnInit(): void {
    this.getCustomer();
    this.setDefaultTime();
  }

  setDefaultTime() {
    const now = DateTime.local().toFormat('HH:mm');
    this.eventForm.get('time_delivery')?.setValue(now);
    this.cdr.detectChanges();
  }

  getCustomer(): void {
    this.customerService.findAll().subscribe(
      (data) => {
        this.clientes = data;
      },
      (error) => console.error('Error al cargar clientes', error)
    );
  }

  updateClientInfo(customerName: string) {
    // Busca el cliente seleccionado en el array clientes
    this.selectedCustomer =
      this.clientes.find((cliente) => cliente.customer === customerName) ||
      null;

    if (this.selectedCustomer) {
      // Actualiza los valores del formulario con los datos del cliente
      this.eventForm.patchValue({
        id: this.selectedCustomer.id,
        customer: this.selectedCustomer.customer,
        applicant: this.selectedCustomer.applicant,
        concreteCoordinator: this.selectedCustomer.concreteCoordinator,
        radialFrequency: this.selectedCustomer.radialFrequency,
        deliveryPoint: this.selectedCustomer.deliveryPoint,
        finalDestination: this.selectedCustomer.finalDestination,
      });

      // Actualiza los productos del cliente seleccionado
      this.selectedCustomerProducts = this.selectedCustomer.products || [];
    } else {
      this.selectedCustomerProducts = [];
    }
  }

  updateProductName(codProduct: string): void {
    const productoEncontrado = this.selectedCustomerProducts.find(
      (product) => product.codProduct === codProduct
    );

    if (productoEncontrado) {
      this.eventForm.patchValue({
        codProduct: productoEncontrado.codProduct,
        nameProduct: productoEncontrado.nameProduct,
      });
    } else {
      this.eventForm.patchValue({
        codProduct: '',
        nameProduct: '',
      });
    }
  }

  openFromIcon(timepicker: { open: () => void }) {
    if (!this.eventForm.disabled) {
      timepicker.open();
    }
  }

  onClear($event: Event) {
    this.eventForm.get('time_delivery')?.reset();
  }

  onSubmit(): void {
    if (!this.eventForm.valid) {
      console.warn('⚠️ Formulario inválido');
      return;
    }

    const formData = this.eventForm.getRawValue();
    const isValid = this.validateFormData(formData);

    if (isValid) {
      this.addOrderData(formData);
    }
  }

  // 📦 Crear la orden
  addOrderData(order_obj: any): void {
    const userEmail = this.getUserEmail();
    if (!userEmail) return;

    const [hours, minutes] = order_obj.time_delivery.split(':').map(Number);
    const applicationDate = this.parseApplicationDate(
      order_obj.application_date
    );
    const fullDate = new Date(applicationDate!);
    fullDate.setHours(hours, minutes, 0);

    if (isNaN(fullDate.getTime())) {
      console.error('⚠️ Fecha inválida');
      return;
    }

    const applicationDateTimeFormatted = dayjs(fullDate).format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    const applicationDateFormatted =
      dayjs(applicationDate).format('YYYY-MM-DD');

    const m3AsNumber = this.normalizeAndConvertToNumber(order_obj.m3);

    const orderPayload: any = {
      idorders: 0,
      codOrder: '',
      client: order_obj.customer?.trim() || '',
      customer_id: this.selectedCustomer?.id || 0,
      clientEmail: userEmail,
      applicant: order_obj.applicant?.trim() || '',
      product: order_obj.nameProduct?.trim() || '',
      thunder: order_obj.thunder?.trim() || '',
      cod_product: order_obj.codProduct?.trim() || '',
      application_date: applicationDateFormatted,
      coordinator_concrete: order_obj.concreteCoordinator?.trim() || '',
      frequency_radial: order_obj.radialFrequency?.trim() || '',
      point_delivery: order_obj.deliveryPoint?.trim() || '',
      final_destination: order_obj.finalDestination?.trim() || '',
      observation: order_obj.observation?.trim() || '',
      time_delivery: applicationDateTimeFormatted,
      m3: m3AsNumber,
      dispatch_frequency: order_obj.dispatch_frequency,
      status: { id: 1, name: 'Programado' },
      statusRequests: [],
    };

    this.orderService.create(orderPayload).subscribe({
      next: () => {
        Swal.fire({
          title: 'Creada nueva Solicitud!',
          text: 'Creada con éxito!',
          icon: 'success',
        });
        this.router.navigate(['/planner/calendar-planner']);
      },
      error: (err) => {
        console.error('Error al crear la solicitud:', err);
        const text =
          err.status === 400
            ? err.error.message
            : 'Intenta nuevamente más tarde.';
        Swal.fire({ title: 'Error!', text, icon: 'error' });
      },
    });
  }

  // 📤 Obtener email de localStorage
  getUserEmail(): string | null {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      this.showError('No se encontraron datos de usuario en el localStorage.');
      return null;
    }
    try {
      const userData = JSON.parse(userDataString);
      return userData.email;
    } catch (error) {
      console.error('Error al parsear los datos del usuario:', error);
      return null;
    }
  }

  // 🔢 Normalizar m3
  normalizeAndConvertToNumber(value: string | number): number {
    if (typeof value === 'number') return value;
    const normalizedValue = value.replace(',', '.');
    const numericValue = parseFloat(normalizedValue);
    return isNaN(numericValue) ? 0.0 : numericValue;
  }

  // ✅ Validaciones modulares
  validateFormData(data: any): boolean {
    if (!this.validateDateAndTime(data)) return false;
    if (!this.validateDispatchFrequency(data.dispatch_frequency)) return false;
    return true;
  }

  validateDateAndTime(data: any): boolean {
    const date = this.parseApplicationDate(data.application_date);
    const time24 = this.convertTo24HourFormat(data.time_delivery);
    if (!date || !time24) return false;

    const [hours, minutes] = time24.split(':').map(Number);
    data.time_delivery = time24;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date < today) {
      this.showError(
        'No se pueden hacer solicitudes con fechas anteriores al día actual.'
      );
      return false;
    }

    if (this.isSameDay(date, today)) {
      const selectedTime = new Date(date);
      selectedTime.setHours(hours, minutes, 0, 0);
      const minAllowed = new Date(Date.now() + 3 * 60 * 60 * 1000);
      if (selectedTime < minAllowed) {
        const minTime = minAllowed.toLocaleTimeString('es-CL', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        const horaElegida = `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}`;
        this.showError(
          `La hora ${horaElegida} ya no está disponible para hoy. ` +
            `Por favor, selecciona el día siguiente si quieres agendar a esa hora. ` +
            `Las horas disponibles para hoy son desde las ${minTime} hasta las 23:59 PM.`
        );
        return false;
      }
    }

    return true;
  }

  validateDispatchFrequency(value: any): boolean {
    const freq = parseInt(value, 10);
    if (isNaN(freq) || freq < 15) {
      this.showError(
        'La frecuencia de despachos debe ser como mínimo de 15 minutos.'
      );
      return false;
    }
    return true;
  }

  // 🧰 Utilidades auxiliares
  parseApplicationDate(date: any): Date | null {
    if (typeof date === 'string') {
      const [day, month, year] = date.split('/');
      return new Date(`${year}-${month}-${day}`);
    } else if (date instanceof Date) {
      return date;
    }
    return null;
  }

  convertTo24HourFormat(time: string): string | null {
    const match = time.trim().match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) {
      console.warn('⚠️ Hora inválida:', time);
      return null;
    }

    let [_, hour, minute, period] = match;
    let hours = parseInt(hour, 10);
    let minutes = parseInt(minute, 10);

    if (period) {
      if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
      if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  }

  isSameDay(d1: Date, d2: Date): boolean {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }

  showError(message: string): void {
    Swal.fire({ title: 'Error!', text: message, icon: 'error' });
  }
}

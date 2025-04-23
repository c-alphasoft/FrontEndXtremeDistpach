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
import { UserService } from '../../../services/user.service';

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
  receivedData: any = {};
  eventForm: FormGroup;
  clientes: Customer[] = [];
  productos: Product[] = [];
  required: boolean = false;
  showFrequencyField: boolean = false;
  selectedCustomerProducts: Product[] = [];
  maxTime: DateTime = DateTime.local().set({ hour: 16 });
  minTime: DateTime = DateTime.local().set({ hour: 14 });

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private orderService: OrderService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.eventForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.receivedData = history.state.datos;
    const email = this.receivedData?.date?.meta?.order?.clientEmail;
    this.getCustomer(email);
    this.setDefaultTime();
    this.setupM3FrequencyLogic();
  }

  getCustomer(email: any): void {
    this.userService.findByCustomer(email).subscribe({
      next: (user) => {
        if (user?.customers?.length) {
          this.initializeForm(user.customers[0]);
          this.productos = user.customers[0].products;
        }
      },
      error: (err) => console.error('Error al obtener cliente:', err),
    });
  }

  private initializeForm(data: any): void {
    const order = this.receivedData?.date?.meta?.order;
    this.eventForm = this.fb.group({
      customer: [data.customer || '', Validators.required],
      applicant: [data.applicant || '', Validators.required],
      radialFrequency: [data.radialFrequency, Validators.required],
      deliveryPoint: [data.deliveryPoint, Validators.required],
      finalDestination: [data.finalDestination, Validators.required],
      codProduct: [order.cod_product, Validators.required],
      nameProduct: [order.product, Validators.required],
      application_date: [order.application_date, Validators.required],
      m3: [order.m3, Validators.required],
      observation: [order.observation, Validators.required],
      dispatch_frequency: [order.dispatch_frequency || 15],
      concreteCoordinator: [
        order.coordinator_concrete || '',
        Validators.required,
      ],
      time_delivery: [
        dayjs(order.time_delivery).format('HH:mm'),
        Validators.required,
      ],
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
    this.cdr.detectChanges();
  }

  setDefaultTime() {
    const now = DateTime.local().toFormat('HH:mm');
    this.eventForm.get('time_delivery')?.setValue(now);
    this.cdr.detectChanges();
  }

  private setupM3FrequencyLogic(): void {
    this.eventForm.get('m3')?.valueChanges.subscribe((value) => {
      const numericValue = parseFloat(value) || 0;
      this.showFrequencyField = numericValue > 7;

      const frequencyControl = this.eventForm.get('dispatch_frequency');

      if (!this.showFrequencyField) {
        frequencyControl?.setValue(15);
        frequencyControl?.disable();
        frequencyControl?.clearValidators();
      } else {
        frequencyControl?.enable();
        frequencyControl?.setValidators([
          Validators.required,
          Validators.min(15),
        ]);
      }
      frequencyControl?.updateValueAndValidity();
    });

    // Inicializar estado basado en valor actual
    const initialM3 = parseFloat(this.eventForm.get('m3')?.value) || 0;
    if (initialM3 <= 7) {
      this.eventForm.get('dispatch_frequency')?.disable();
    }
  }

  updateProductName(codProduct: string): void {
    const productoEncontrado = this.productos.find(
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
      codOrder: this.receivedData?.date?.meta?.order?.codOrder,
      client: order_obj.customer?.trim() || '',
      clientEmail: userEmail,
      applicant: order_obj.applicant?.trim() || '',
      product: order_obj.nameProduct?.trim() || '',
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

    console.log('Pay load', orderPayload);
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

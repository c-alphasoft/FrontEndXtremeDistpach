import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialModule } from '../../../../material.module';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-edit-dispatch',
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
  templateUrl: './edit-dispatch.component.html',
  styleUrl: './edit-dispatch.component.scss',
})
export class EditDispatchComponent implements OnInit {
  eventForm: FormGroup;
  receivedData: any;
  required: boolean = false;
  panelOpenState = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.receivedData = history.state.datos;

    if (!this.receivedData) {
      const stored = sessionStorage.getItem('datosParaEditar');
      if (stored) {
        this.receivedData = JSON.parse(stored);
      } else {
        this.router.navigate(['/admin/planner/calendar']);
        return;
      }
    }

    // Limpia el sessionStorage para evitar datos viejos en futuras ediciones
    sessionStorage.removeItem('datosParaEditar');

    console.log('Datos recibidos en editar:', this.receivedData);
    this.initializeForm(this.receivedData);
  }

  loadDispatchData() {
    this.receivedData = history.state.datos;
    console.log('Datos new activos', this.receivedData);
    this.initializeForm(this.receivedData);
  }

  initializeForm(data: any): void {
    const formatTo12Hour = (dateTimeString: string): string => {
      if (!dateTimeString) return '';

      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '';

      const rawTime = date.toLocaleTimeString('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      return rawTime
        .replace(/\s*a\.?\s*m\.?/i, ' AM')
        .replace(/\s*p\.?\s*m\.?/i, ' PM');
    };

    const order = data.order;
    const despacho = data.despacho;

    this.eventForm = this.fb.group({
      // Dispatch
      dispatchId: [despacho.id || '', Validators.required],
      dispatchCode: [despacho.dispatchCode || '', Validators.required],
      dispatchM3: [despacho.m3 || '', Validators.required],
      dispatchShift: [despacho.shift || '', Validators.required],
      dispatchStatus: [despacho.status?.name || '', Validators.required],
      dispatchObservation: ['', Validators.required],
      dispatchTime: [
        formatTo12Hour(despacho.dispatchTime) || '',
        Validators.required,
      ],
      dispatchConfirmationTime: [dayjs().format('HH:mm'), Validators.required],
      dispatchTimeDelivery: [
        formatTo12Hour(despacho.timeDelivery) || '',
        Validators.required,
      ],

      // Order
      m3Order: [order.m3 || '', Validators.required],
      observationOrder: [order.observation || '', Validators.required],
      applicant: [order.applicant || '', Validators.required],
      client: [order.client || '', Validators.required],
      codOrder: [order.codOrder || '', Validators.required],
      clientEmail: [order.clientEmail || '', Validators.required],
      idorders: [order.idorders || '', Validators.required],
      cod_product: [order.cod_product || '', Validators.required],
      product: [order.product || '', Validators.required],
      application_date: [order.application_date || '', Validators.required],
      frequency_radial: [order.frequency_radial || '', Validators.required],
      point_delivery: [order.point_delivery || '', Validators.required],
      date_delivery_order: [order.application_date || '', Validators.required],
      dispatch_frequency: [order.dispatch_frequency || '', Validators.required],
      final_destination: [order.final_destination || '', Validators.required],
      time_delivery_order: [
        formatTo12Hour(order.time_delivery) || '',
        Validators.required,
      ],
      coordinator_concrete: [
        order.coordinator_concrete || '',
        Validators.required,
      ],
    });
    console.log('this.eventForm', this.eventForm.value);

    this.cdr.detectChanges();
  }

  onDelete() {
    Swal.fire({
      title: 'Confirma eliminar Solicitud?',
      text: 'No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Eliminado!',
          text: 'Solicitud eliminada',
          icon: 'success',
        });
      }
    });
  }

  openFromIcon(timepicker: { open: () => void }) {
    if (!this.eventForm.disabled) {
      timepicker.open();
    }
  }

  onClear($event: Event) {
    this.eventForm.get('dispatchConfirmationTime')?.reset();
  }

  onSubmit() {
    Swal.fire({
      title: 'Solicitud Modificada!',
      text: 'Editada con éxito!',
      icon: 'success',
    });
  }

  /* onCancel() {
    const newData = {
      date: this.receivedData,
    };
    console.log('para enviar', newData);
    this.router.navigate(['/admin/planner/dispatch-detail'], {
      state: { datos: newData },
    });
  }*/

  onCancel() {
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
    this.router.navigate(['/admin/planner/dispatch-detail'], {
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

import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  signal,
  LOCALE_ID,
  OnInit,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  CommonModule,
  DOCUMENT,
  NgSwitch,
  registerLocaleData,
} from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  isSameDay,
  isSameMonth,
  subMonths,
  addMonths,
  parseISO,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarModule,
  CalendarView,
  DateAdapter,
} from 'angular-calendar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import localeEs from '@angular/common/locales/es';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MaterialModule } from '../../../material.module';
import { Router } from '@angular/router';
import { OrderStatusService } from '../../../services/order-status.service';
import { Order } from '../../../modules/interfaces/order';
import { TablerIconsModule } from 'angular-tabler-icons';
import Swal from 'sweetalert2';
import { OrderService } from '../../../services/order.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

const colors: any = {
  red: {
    primary: '#fa896b',
    secondary: '#fdede8',
  },
  blue: {
    primary: '#5d87ff',
    secondary: '#ecf2ff',
  },
  yellow: {
    primary: '#ffae1f',
    secondary: '#fef5e5',
  },
  green: {
    primary: '#53e609',
    secondary: '#53e609',
  },
};

// Registra el idioma español
registerLocaleData(localeEs);

@Component({
  selector: 'app-fullcalendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fullcalendar.component.html',
  styleUrls: ['./fullcalendar.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgSwitch,
    CalendarModule,
    CommonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    TablerIconsModule,
    NgxSpinnerModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: DateAdapter,
      useFactory: adapterFactory,
    },
    CalendarDateFormatter,
  ],
})
export class AppFullcalendarComponent implements OnInit {
  view = signal<any>('month');
  viewDate = signal<Date>(new Date());
  activeDayIsOpen = signal<boolean>(true);
  refresh: Subject<any> = new Subject();
  events = signal<CalendarEvent[]>([]);

  constructor(
    public dialog: MatDialog,
    @Inject(DOCUMENT) doc: any,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private serviceStatus: OrderStatusService,
    private orderService: OrderService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.showSpinner();
    this.loadOrdersByStatus();
  }

  loadOrdersByStatus(): void {
    this.serviceStatus.getOrdersByShift().subscribe(
      (data: Order[]) => {
        const newEvents = data.flatMap((order) =>
          this.transformOrderToEvent(order)
        );
        this.events.set([...this.events(), ...newEvents]);
        this.refresh.next(null);
        this.cdr.detectChanges();
        this.hideSpinner();
      },
      (error) => {
        console.error('Error al cargar las órdenes:', error);
      }
    );
  }

  private transformOrderToEvent(order: Order): CalendarEvent[] {
    const totalM3 = order.m3;
    const detallesDespachos = order.statusRequests.map((request) => ({
      horaEntrega: request.dispatchTime,
      m3: request.m3,
      turno: request.shift,
    }));

    const events: CalendarEvent[] = [];

    // Convertir `time_delivery` a objeto Date y corregir posibles errores de zona horaria
    let deliveryDate = parseISO(order.time_delivery);

    // Ajustar la fecha si es medianoche (00:00:00), sumando un día para evitar mostrarla en el día anterior
    if (deliveryDate.getHours() === 0 && deliveryDate.getMinutes() === 0) {
      deliveryDate = addHours(deliveryDate, 2); // Ajustamos para evitar desajustes en el calendario
    }

    // Evento para Turno A
    const detallesTurnoA = detallesDespachos.filter(
      (detalle) => detalle.turno === 'Turno A'
    );
    if (detallesTurnoA.length > 0) {
      events.push({
        start: deliveryDate,
        end: deliveryDate,
        color: colors.green,
        title: order.client,
        meta: {
          client: order.client,
          productName: order.codOrder,
          dispatch_frequency: order.dispatch_frequency,
          final_destination: order.final_destination,
          m3: totalM3,
          status: order.status.name,
          turno: 'A',
          detallesDespachos: detallesTurnoA,
          order,
        },
      });
    }

    // Evento para Turno B
    const detallesTurnoB = detallesDespachos.filter(
      (detalle) => detalle.turno === 'Turno B'
    );
    if (detallesTurnoB.length > 0) {
      events.push({
        start: deliveryDate,
        end: deliveryDate,
        color: colors.blue,
        title: order.client,
        meta: {
          client: order.client,
          productName: order.codOrder,
          dispatch_frequency: order.dispatch_frequency,
          final_destination: order.final_destination,
          m3: totalM3,
          status: order.status.name,
          turno: 'B',
          detallesDespachos: detallesTurnoB,
          order,
        },
      });
    }
    return events;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate())) {
      if (
        (isSameDay(this.viewDate(), date) && this.activeDayIsOpen() === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen.set(false);
      } else {
        this.activeDayIsOpen.set(true);
        this.viewDate.set(date);
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events.set(
      this.events().map((iEvent: CalendarEvent<any>) => {
        if (iEvent === event) {
          return {
            ...event,
            start: newStart,
            end: newEnd,
          };
        }
        return iEvent;
      })
    );
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    const newData = {
      action: action,
      date: event,
    };
    this.router.navigate(['/admin/planner/detail-dispatch'], {
      state: { datos: newData },
    });
  }

  editEvent(eventEdit: CalendarEvent, id: number): void {
    const newData = {
      id: id,
      date: eventEdit,
    };
    this.router.navigate(['/admin/planner/edit'], {
      state: { datos: newData },
    });
  }

  handleHourClick(
    event: CalendarEvent,
    hora: { horaEntrega: string; m3: number; turno: string }
  ): void {
    const officeFound = event.meta.order.statusRequests.find(
      (despacho: any) => despacho.dispatchTime === hora.horaEntrega
    );

    if (officeFound) {
      const dataToSend = {
        order: {
          idorders: event.meta.order.idorders ?? null,
          codOrder: event.meta.order.codOrder,
          client: event.meta.order.client,
          clientEmail: event.meta.order.clientEmail,
          applicant: event.meta.order.applicant,
          product: event.meta.order.product,
          cod_product: event.meta.order.cod_product,
          m3: event.meta.order.m3,
          application_date: event.meta.order.application_date,
          coordinator_concrete: event.meta.order.coordinator_concrete,
          frequency_radial: event.meta.order.frequency_radial,
          point_delivery: event.meta.order.point_delivery,
          final_destination: event.meta.order.final_destination,
          observation: event.meta.order.observation,
          dispatch_frequency: event.meta.order.dispatch_frequency,
          time_delivery: event.meta.order.time_delivery,
        },
        despacho: officeFound,
      };
      console.log('ful calendar', dataToSend);

      this.router.navigate(['/admin/planner/dispatch-detail'], {
        state: { datos: dataToSend },
      });
    } else {
      console.warn(
        'No se encontró un despacho con la hora de entrega:',
        hora.horaEntrega
      );
    }
  }

  addEvent(): void {
    const newData = {
      action: 'add',
      date: new Date(),
    };
    this.router.navigate(['/admin/planner/new-dispatch'], {
      state: { datos: newData },
    });
  }

  deleteEvent(eventToDelete: CalendarEvent, id: number): void {
    if (!this.events) {
      console.error('Error: events no está definido.');
      return;
    }

    if (eventToDelete && id) {
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
          this.orderService.remove(id).subscribe({
            next: () => {
              Swal.fire({
                title: 'Eliminado!',
                text: 'Solicitud eliminada',
                icon: 'success',
              });
              this.events.set(
                this.events().filter((e) => e.meta.order.idorders !== id)
              );
              this.refresh.next(null);
              this.cdr.detectChanges();
            },
            error: (error) => {
              console.error('Error eliminando la orden:', error);
              Swal.fire({
                title: 'Error!',
                text: 'No se pudo eliminar la solicitud.',
                icon: 'error',
              });
            },
          });
        }
      });
    }
  }

  setView(view: CalendarView | any): void {
    this.view.set(view);
  }

  goToPreviousMonth(): void {
    this.viewDate.set(subMonths(this.viewDate(), 1));
  }

  goToNextMonth(): void {
    this.viewDate.set(addMonths(this.viewDate(), 1));
  }

  goToToday() {
    this.viewDate.set(new Date());
  }

  showSpinner() {
    this.spinner.show();
  }
  hideSpinner() {
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }
}

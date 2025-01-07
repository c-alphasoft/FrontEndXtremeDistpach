import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  signal,
  LOCALE_ID,
} from '@angular/core';
import {
  CommonModule,
  DOCUMENT,
  NgSwitch,
  registerLocaleData,
} from '@angular/common';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { CalendarFormDialogComponent } from './calendar-form-dialog/calendar-form-dialog.component';
import {
  startOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  subMonths,
  addMonths,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarModule,
  CalendarView,
  DateAdapter,
} from 'angular-calendar';
import { MaterialModule } from 'src/app/material.module';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import localeEs from '@angular/common/locales/es';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TablerIconsModule } from 'angular-tabler-icons';
import { IconEdit, IconTrash } from 'angular-tabler-icons/icons';

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
};

// Registra el idioma español
registerLocaleData(localeEs);

@Component({
  selector: 'app-calendar-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatNativeDateModule,
    MatDialogModule,
    MatDatepickerModule,
    TablerIconsModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDialogComponent {
  options!: UntypedFormGroup;

  event: CalendarEvent;

  constructor(
    public dialogRef: MatDialogRef<CalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
        // Asegúrate de que los datos lleguen correctamente
        this.event = data.event;
        console.log('Datos del evento:', this.event);
  }
}

@Component({
  selector: 'app-fullcalendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fullcalendar.component.html',
  styleUrls: ['./fullcalendar.component.scss'],
  standalone: true,
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
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: DateAdapter,
      useFactory: adapterFactory, // Usa el adaptador de `date-fns`
    },
    CalendarDateFormatter,
  ],
})
export class AppFullcalendarComponent {
  dialogRef = signal<MatDialogRef<CalendarDialogComponent> | any>(null);
  dialogRef2 = signal<MatDialogRef<CalendarFormDialogComponent> | any>(null);
  lastCloseResult = signal<string>('');
  actionsAlignment = signal<string>('');
  view = signal<any>('month');
  viewDate = signal<Date>(new Date());
  activeDayIsOpen = signal<boolean>(true);

  config: MatDialogConfig = {
    disableClose: false,
    width: '',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: '',
    },
    data: {
      action: '',
      event: [],
    },
  };
  numTemplateOpens = 0;

  actions: CalendarEventAction[] = [
    {
      label: '<span class="text-white link m-l-5">: Editar</span>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Editar', event);
      },
    },
    {
      label: '<span class="text-danger m-l-5">Eliminar</span>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events.set(
          this.events().filter((iEvent: CalendarEvent<any>) => iEvent !== event)
        );
        this.handleEvent('Eliminar', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events = signal<CalendarEvent[] | any>([
    {
      start: startOfDay(new Date()),
      end: startOfDay(new Date()),
      title: 'ACOP',
      client: "ACOP",
      product: "XM-DC-DH-001",
      volume: "m3",
      color: colors.red,
      actions: this.actions,
    },
    {
      start: startOfDay(new Date()),
      end: startOfDay(new Date()),
      title: 'GEOVITA',
      client: "ACOP",
      product: "XM-DC-DH-001",
      volume: "m3",
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: startOfDay(new Date()),
      end: startOfDay(new Date()),
      title: 'GARDALIC',
      client: "ACOP",
      product: "XM-DC-DH-001",
      volume: "m3",
      color: colors.blue,
      actions: this.actions,
    },
  ]);

  constructor(public dialog: MatDialog, @Inject(DOCUMENT) doc: any) {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log('Fecha seleccionada:', date);
    console.log('Eventos en ese día:', events);
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

    this.config.data = { event, action };
    this.dialogRef.set(this.dialog.open(CalendarDialogComponent, this.config));

    this.dialogRef()
      .afterClosed()
      .subscribe((result: string) => {
        this.lastCloseResult.set(result);
        this.dialogRef.set(null);
        this.refresh.next(result);
      });
  }

  addEvent(): void {
    this.dialogRef2.set(
      this.dialog.open(CalendarFormDialogComponent, {
        panelClass: 'calendar-form-dialog',
        data: {
          action: 'add',
          date: new Date(),
        },
      })
    );
    this.dialogRef2()
      .afterClosed()
      .subscribe((res: { action: any; event: any }) => {        
        if (!res) {
          return;
        }
        const dialogAction = res.action;
        const responseEvent = res.event;
        responseEvent.actions = this.actions;        
        this.events.set([...this.events(), responseEvent]);
        this.dialogRef2.set(null);
        this.refresh.next(res);
      });
  }

  deleteEvent(eventToDelete: CalendarEvent): void {
    const updatedEvents = this.events().filter(
      (event: CalendarEvent<any>) => event !== eventToDelete
    );
    this.events.set(updatedEvents);
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
}

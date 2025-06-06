import { CalendarEventAction, CalendarEvent } from 'angular-calendar';
import {
  startOfDay,
} from 'date-fns';

export class EgretCalendarEvent implements CalendarEvent {
  // tslint:disable-next-line - Disables all
  _id?: string;
  start: Date;
  end: Date;
  title: string;
  client: string;
  volume: string;
  turno: string;
  solicitante: string;
  coordinadorHormigon: string;
  frecuenciaRadial: string;
  conProducto: string;
  descripcionProducto: string;
  cantidad: string;
  puntoEntrega: string;
  destinoFinal: string;
  horaEntrega: string;
  observacion: string;
  product: string;
  color?: {
    primary: string;
    secondary: string;
  };
  actions?: CalendarEventAction[];
  allDay?: boolean;
  cssClass?: string;
  resizable?: {
    beforeStart?: boolean;
    afterEnd?: boolean;
  };
  draggable?: boolean;
  meta?: {
    location: string;
    notes: string;
  };

  constructor(data: any) {    
    data = data || {};
    this.start = new Date(data.start) || startOfDay(new Date());
    this.end = new Date(data.end);
    this._id = data._id || '';
    this.title = data.title || '';
    this.client = data.client || '';
    this.product = data.product || '';
    this.volume = data.volume || '';
    this.turno = data.turno || '';
    this.solicitante = data.solicitante || '';
    this.coordinadorHormigon = data.coordinadorHormigon || '';
    this.frecuenciaRadial = data.frecuenciaRadial || '';
    this.conProducto = data.conProducto || '';
    this.descripcionProducto = data.descripcionProducto || '';
    this.cantidad = data.cantidad || '';
    this.puntoEntrega = data.puntoEntrega || '';
    this.destinoFinal = data.destinoFinal || '';
    this.horaEntrega = data.horaEntrega || '';
    this.observacion = data.observacion || '';
    this.color = {
      primary: (data.color && data.color.primary) || '#247ba0',
      secondary: (data.color && data.color.secondary) || '#D1E8FF',
    };
    this.draggable = data.draggable || true;
    this.resizable = {
      beforeStart: (data.resizable && data.resizable.beforeStart) || true,
      afterEnd: (data.resizable && data.resizable.afterEnd) || true,
    };
    this.actions = data.actions || [];
    this.allDay = data.allDay || false;
    this.cssClass = data.cssClass || '';
    this.meta = {
      location: (data.meta && data.meta.location) || '',
      notes: (data.meta && data.meta.notes) || '',
    };
  }
}

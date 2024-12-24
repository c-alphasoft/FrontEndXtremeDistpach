import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Camion {
  camion_id: number;
  estado: string;
  hora_cambio: string;
  intervalo: number;
}

@Injectable({
  providedIn: 'root',
})
export class StatesService {
  private camiones: Camion[] = [
    {
      camion_id: 1,
      estado: 'cargando',
      hora_cambio: '2024-12-24 08:00:00',
      intervalo: 0,
    },
  ];

  constructor() {}

  private camionesSubject = new BehaviorSubject<Camion[]>(this.camiones);

  getCamiones() {
    return this.camionesSubject.asObservable();
  }

  registrarCambio(camion_id: number, nuevo_estado: string) {
    const camion = this.camiones.find((c) => c.camion_id === camion_id);
    if (camion) {
      const hora_actual = new Date();
      const hora_anterior = new Date(camion.hora_cambio);
      const intervalo =
        (hora_actual.getTime() - hora_anterior.getTime()) / 60000;

      camion.estado = nuevo_estado;
      camion.hora_cambio = hora_actual.toISOString();
      camion.intervalo = Math.round(intervalo);

      this.camionesSubject.next([...this.camiones]);
    }
  }
}

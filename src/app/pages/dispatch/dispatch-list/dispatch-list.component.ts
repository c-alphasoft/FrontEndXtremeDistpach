import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const ELEMENT_DATA: PeriodicElement[] = [
  {
    id: 1,
    fecha: '01-08-2024',
    cliente: 'ACOP',
    turno: 'A',
    guia_despacho: '91887',
    remito: '1956',
    sello: '4352627',
    detalle: 'SG30(10)10-22-5KGFPP',
    volumen: '7',
    camion: 'PMCHS-CATC-S32',
    estado: 'PROGRAMADO',
  },
  {
    id: 2,
    fecha: '01-08-2024',
    cliente: 'ACOP',
    turno: 'A',
    guia_despacho: '91887',
    remito: '1956',
    sello: '4352621',
    detalle: 'GB50(10)13-70',
    volumen: '5',
    camion: 'PMCHS-CATC-V25',
    estado: 'ENTREGADO',
  },
  {
    id: 3,
    fecha: '01-08-2024',
    cliente: 'GEOVITA',
    turno: 'A',
    guia_despacho: '',
    remito: '1956',
    sello: '4352644',
    detalle: 'SG30(10)10-22-5KGFPP',
    volumen: '7',
    camion: 'PMCHS-CATC-S36',
    estado: 'EN PROCESO',
  },
  {
    id: 4,
    fecha: '01-08-2024',
    cliente: 'GARDARLIC',
    turno: 'A',
    guia_despacho: '',
    remito: '',
    sello: '',
    detalle: 'GB50(10)20-12-R3-3,5FFPP54',
    volumen: '6',
    camion: '',
    estado: 'CANCELADO',
  },
];

@Component({
  selector: 'app-dispatch-list',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './dispatch-list.component.html',
  styleUrl: './dispatch-list.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class DispatchListComponent {
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['id', 'fecha', 'cliente', 'turno', 'guia_despacho', 'remito'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: PeriodicElement | null = null;

  constructor() {}

  ngOnInit(): void {}
}

export interface PeriodicElement {
  id: number;
  fecha: string;
  cliente: string;
  turno: string;
  guia_despacho: string;
  remito: string;
  sello: string;
  detalle: string;
  volumen: string;
  camion: string;
  estado: string;
}

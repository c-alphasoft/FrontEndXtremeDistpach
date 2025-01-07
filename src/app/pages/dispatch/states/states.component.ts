import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ThemePalette } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-states',
  standalone: true,
  imports: [
    MatProgressBarModule,
    MatCardModule,
    FormsModule,
    MatSliderModule,
    MatRadioModule,
    MatTableModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './states.component.html',
  styleUrl: './states.component.scss',
})
export class StatesComponent implements OnInit {
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 50;
  bufferValue = 75;

  constructor() {}

  ngOnInit(): void {}

  columns = [
    'Inicio',
    'Cargando',
    'A Obra',
    'En Obra',
    'A Planta',
    'En Planta',
  ];

  data = [
    {
      color: 'green',
      progress: 75, // Progreso en porcentaje
      stages: [
        { label: 'Cargando', time: '09:34', duration: '30min' },
        { label: 'A Obra', time: '10:03', duration: '30min' },
        { label: 'En Obra', time: '10:33', duration: '38min' },
        { label: 'A Planta', time: '11:11', duration: '00:02:29' },
        { label: 'En Planta', time: '--', duration: '--' },
      ],
    },
    {
      color: 'yellow',
      progress: 50,
      stages: [
        { label: 'Cargando', time: '09:59', duration: '23min' },
        { label: 'A Obra', time: '10:21', duration: '30min' },
        { label: 'En Obra', time: '10:50', duration: '02:03:03' },
        { label: 'A Planta', time: '--', duration: '--' },
        { label: 'En Planta', time: '--', duration: '--' },
      ],
    },
    {
      color: 'blue',
      progress: 25,
      stages: [
        { label: 'Cargando', time: '10:22', duration: '20min' },
        { label: 'A Obra', time: '10:41', duration: '32:41min' },
        { label: 'En Obra', time: '--', duration: '--' },
        { label: 'A Planta', time: '--', duration: '--' },
        { label: 'En Planta', time: '--', duration: '--' },
      ],
    },
  ];

  // Acción al presionar el botón
  onAction(row: any) {
    alert(`Acción realizada para la fila con color: ${row.color}`);
  }
}

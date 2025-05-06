import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { DashboardService } from '../../../../services/dashboard.service';
import { DispatchClientCount } from '../../../../modules/interfaces/dispatchClientCount';
import { MaterialModule } from '../../../../material.module';

@Component({
  selector: 'dispatch',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
  ],
  templateUrl: './dispatch.component.html',
  styleUrl: './dispatch.component.scss',
})
export class DispatchComponent implements OnInit {
  clientsCounts: DispatchClientCount[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  filteredData: { name: string; value: number }[] = [];
  selectedClients: string[] = [];
  yAxisTicks: number[] = [];
  maxYValue: number = 0;

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#7AA3E5'],
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.getDispatchCount();
  }

  getDispatchCount() {
    const today = new Date();
    const endDate = this.formatDate(today);
    const startDateObj = new Date(today);
    startDateObj.setMonth(startDateObj.getMonth() - 2);
    const startDate = this.formatDate(startDateObj);

    this.dashboardService
      .getDispatchClientCounts(startDate, endDate)
      .subscribe({
        next: (data) => {
          this.clientsCounts = data;
          this.selectedClients = this.getUniqueClients(); // Seleccionar todos por defecto
          this.updateFilteredData();
        },
        error: (err) => console.error('Error al cargar los datos', err),
      });
  }

  filterByDates(): void {
    if (!this.startDate || !this.endDate) {
      console.warn('Debe seleccionar ambas fechas para filtrar.');
      return;
    }

    const start = this.formatDate(this.startDate);
    const end = this.formatDate(this.endDate);

    this.dashboardService.getDispatchClientCounts(start, end).subscribe({
      next: (data) => {
        this.clientsCounts = data;
        this.updateFilteredData(); // Mantener la selección actual de clientes
      },
      error: (err) => console.error('Error al cargar datos filtrados', err),
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getUniqueClients(): string[] {
    return [...new Set(this.clientsCounts.map((item) => item.client))];
  }

  formatXTicks(value: string): string {
    return value.length > 10 ? value.substring(0, 8) + '...' : value;
  }

  formatYTicks(value: number): string {
    return value.toString();
  }

  toggleClientSelection(client: string): void {
    const index = this.selectedClients.indexOf(client);
    if (index === -1) {
      this.selectedClients.push(client);
    } else {
      this.selectedClients.splice(index, 1);
    }
    this.updateFilteredData();
  }

  isClientSelected(client: string): boolean {
    return this.selectedClients.includes(client);
  }

  updateFilteredData(): void {
    if (this.selectedClients.length === 0) {
      this.filteredData = this.clientsCounts.map((item) => ({
        name: item.client,
        value: item.count,
      }));
    } else {
      this.filteredData = this.clientsCounts
        .filter((item) => this.selectedClients.includes(item.client))
        .map((item) => ({
          name: item.client,
          value: item.count,
        }));
    }
    // Calcular el máximo valor y ticks dinámicos
    this.maxYValue = Math.max(
      ...this.filteredData.map((item) => item.value),
      10
    );
    this.generateYTicks();
  }

  generateYTicks(): void {
    const step = this.calculateStep(this.maxYValue);
    const ticks = [];
    for (let i = 0; i <= this.maxYValue; i += step) {
      ticks.push(i);
    }
    this.yAxisTicks = ticks;
  }

  calculateStep(maxValue: number): number {
    if (maxValue <= 10) return 2;
    if (maxValue <= 50) return 5;
    if (maxValue <= 100) return 10;
    if (maxValue <= 500) return 50;
    if (maxValue <= 1000) return 100;
    return 200;
  }
}

import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexXAxis,
  ApexTooltip,
  ApexTheme,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../../material.module';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: any;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: any;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  labels: string[];
};

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule],
  templateUrl: './column.component.html',
})
export class ColumnComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public columnChartOptions: Partial<ChartOptions> | any;
  constructor() {
    //Column chart.
    this.columnChartOptions = {
      series: [
        {
          name: 'Aprobados',
          data: [400, 120, 140, 320, 200, 450, 340, 430, 400, 520, 240, 450],
        },
        {
          name: 'Rechazados',
          data: [200, 88, 142, 300, 200, 400, 230, 300, 200, 400, 180, 300],
        },
      ],
      chart: {
        fontFamily: 'DM Sans,sans-serif',
        foreColor: '#a1aab2',
        height: 300,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '40%',
          barHeight: '40%',
        },
      },
      dataLabels: {
        enabled: true,
      },
      markers: {
        size: 3,
      },
      stroke: {
        curve: 'straight',
        width: '0',
      },
      colors: ['#06d79c', '#d70606'],
      legend: {
        show: true,
      },
      grid: {
        show: true,
        strokeDashArray: 0,
        borderColor: 'rgba(0,0,0,0.1)',
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        type: 'category',
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nob', 'Dic'],
      },
      tooltip: {
        theme: 'dark',
      },
    };
  }
}
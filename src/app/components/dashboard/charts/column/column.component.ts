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
          name: "Programado",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 56, 40, 62]
        },
        {
          name: "Real",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 100, 140, 158]
        },
        {
          name: "Confirmado",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 54, 47, 32]
        }
      ],
      chart: {
        type: "bar",
        height: 307
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      colors: ['#faf02f', '#06d79c', '#d70606'],
      xaxis: {
        categories: [
          "Ene",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ]
      },
      yaxis: {
        title: {
          text: ""
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val: string) {
            return "$ " + val + " thousands";
          }
        }
      }
    };
  }
}

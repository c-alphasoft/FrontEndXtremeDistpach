import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TopCardsComponent } from './top-cards/top-cards.component';
import { ColumnComponent } from './charts/column/column.component';
import { DoughnutComponent } from './charts/doughnut/doughnut.component';
import { DispatchComponent } from './charts/dispatch/dispatch.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MaterialModule,
    TopCardsComponent,
    ColumnComponent,
    DoughnutComponent,
    DispatchComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {}

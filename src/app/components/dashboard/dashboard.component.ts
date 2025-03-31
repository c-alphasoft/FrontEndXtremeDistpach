import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TopCardsComponent } from './top-cards/top-cards.component';
import { ColumnComponent } from './charts/column/column.component';
import { DoughnutComponent } from './charts/doughnut/doughnut.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MaterialModule,
    TopCardsComponent,
    ColumnComponent,
    DoughnutComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}

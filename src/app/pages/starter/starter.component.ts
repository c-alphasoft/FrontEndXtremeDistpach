import { Component, ViewEncapsulation } from '@angular/core';
import { TopCardsComponent } from 'src/app/components/dashboard/top-cards/top-cards.component';
import { MaterialModule } from 'src/app/material.module';
import { ColumnComponent } from '../charts/column/column.component';
import { DoughnutComponent } from '../charts/doughnut/doughnut.component';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  standalone: true,
  imports: [MaterialModule, TopCardsComponent, ColumnComponent, DoughnutComponent],
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent {}

import { Component } from '@angular/core';
import { LayoutsComponent } from '../../components/layouts/layouts.component';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [LayoutsComponent],
  templateUrl: './planner.component.html',
})
export class PlannerComponent {}

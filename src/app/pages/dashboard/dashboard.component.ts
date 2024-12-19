import { Component } from '@angular/core';
import { AppTopCardsComponent } from 'src/app/components/dashboard/top-cards/top-cards.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AppTopCardsComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

}

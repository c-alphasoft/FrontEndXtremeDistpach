import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';

interface topcards {
  id: number;
  img: string;
  color: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-top-cards',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './top-cards.component.html',
})
export class TopCardsComponent {
  topcards: topcards[] = [
    {
      id: 1,
      color: 'success',
      img: '/assets/images/svgs/icon-truck.svg',
      title: 'Despachos',
      subtitle: '112,000m3',
    },
    {
      id: 2,
      color: 'primary',
      img: '/assets/images/svgs/icon-user-male.svg',
      title: 'Clientes',
      subtitle: '14',
    },
    {
      id: 3,
      color: 'success',
      img: '/assets/images/svgs/view-list-success.svg',
      title: 'GDA',
      subtitle: '12',
    },
    {
      id: 4,
      color: 'warning',
      img: '/assets/images/svgs/view-list-warning.svg',
      title: 'GDP',
      subtitle: '112',
    },
  ];
}

import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';

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
export class AppTopCardsComponent {
  topcards: topcards[] = [
    {
      id: 1,
      color: 'primary',
      img: '/assets/images/svgs/truck-icon.svg',
      title: 'Despachos',
      subtitle: '112.000 m3',
    },
    {
      id: 2,
      color: 'accent',
      img: '/assets/images/svgs/user-icon.svg',
      title: 'Clientes',
      subtitle: '7',
    },
    {
      id: 3,
      color: 'success',
      img: '/assets/images/svgs/clipboard-icon.svg',
      title: 'GD Aceptadas',
      subtitle: '5',
    },
    {
      id: 4,
      color: 'error',
      img: '/assets/images/svgs/clipboard-icon.svg',
      title: 'GD Pendientes',
      subtitle: '112',
    },
  ];
}

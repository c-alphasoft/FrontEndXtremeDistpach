import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { DispatchStatusCount } from '../../../modules/interfaces/dispatchStatusCount';
import { DashboardService } from '../../../services/dashboard.service';

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
export class TopCardsComponent implements OnInit {
  statusCounts: DispatchStatusCount[] = [];
  topcards: topcards[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.getStatusCount();
  }

  getStatusCount() {
    this.dashboardService.getStatusCounts().subscribe({
      next: (data) => {
        this.statusCounts = data;
        this.mapStatusCountsToCards();
      },
      error: (err) => console.error('Error al cargar los datos', err),
    });
  }

  mapStatusCountsToCards() {
    const iconMap: { [key: string]: string } = {
      Programado: '/assets/images/svgs/icon-truck.svg',
      Aprobado: '/assets/images/svgs/icon-truck.svg',
      Procesado: '/assets/images/svgs/icon-truck.svg',
      Despachado: '/assets/images/svgs/icon-truck.svg',
      Finalizado: '/assets/images/svgs/icon-truck.svg',
      Rechazado: '/assets/images/svgs/icon-truck.svg',
    };

    const colorMap: { [key: string]: string } = {
      Programado: 'accent',
      Aprobado: 'accent',
      Procesado: 'accent',
      Despachado: 'accent',
      Finalizado: 'accent',
      Rechazado: 'warning',
    };

    this.topcards = this.statusCounts.map((status, index) => ({
      id: index + 1,
      title: status.status,
      subtitle: `${status.count}`,
      img: iconMap[status.status] || '/assets/images/svgs/view-list.svg',
      color: colorMap[status.status] || 'primary',
    }));
  }
}

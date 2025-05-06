import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from '../../material.module';
import { MatDialog } from '@angular/material/dialog';
import { profiledd } from '../../modules/interfaces/profiled';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    NgxSpinnerModule,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;
  profiledd!: profiledd;

  constructor(
    public dialog: MatDialog,
    private routes: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.userLoad();
  }

  userLoad() {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        this.profiledd = {
          id: 1,
          img: '/assets/images/svgs/icon-account.svg',
          title: 'Mi Perfil',
          subtitle: 'Configuración de Cuenta',
          link: '/authentication/login',
          name: userData.name,
          lastname: userData.lastname,
          email: userData.email,
          rol: userData.user,
        };
      } catch (error) {
        console.error('Error al parsear userData:', error);
      }
    } else {
      console.warn('No se encontró userData en localStorage');
    }
  }

  onLogout() {
    this.spinner.show();
    // Redirige y recarga la página después de la navegación
    this.routes.navigate(['/authentication/login']).then(() => {
      location.reload();
      setTimeout(() => {
        this.spinner.hide();
      }, 2000);
    });
    sessionStorage.clear();
  }
}

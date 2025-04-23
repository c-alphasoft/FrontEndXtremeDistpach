import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CoreService } from '../../services/core.service';
import { navItemsAdmin } from '../../modules/data/sidebar-admin';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header.component';
import { Subscription, filter } from 'rxjs';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { NavItemAdmin } from '../../modules/interfaces/nav-item-admin';
import { navItemsUser } from '../../modules/data/sidebar-user';

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';
const MONITOR_VIEW = 'screen and (min-width: 1024px)';
const BELOWMONITOR = 'screen and (max-width: 1023px)';

@Component({
  standalone: true,
  selector: 'app-layouts',
  imports: [
    RouterModule,
    MaterialModule,
    CommonModule,
    SidebarComponent,
    NgScrollbarModule,
    TablerIconsModule,
    NavItemComponent,
    HeaderComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './layouts.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class LayoutsComponent implements OnInit {
  options = this.settings.getOptions();
  resView = false;
  @ViewChild('content', { static: true }) content!: MatSidenavContent;
  @ViewChild('leftsidenav')
  public sidenav!: MatSidenav;
  private isMobileScreen = false;
  private isCollapsedWidthFixed = false;
  private isContentWidthFixed = true;
  private layoutChangesSubscription = Subscription.EMPTY;
  private htmlElement!: HTMLHtmlElement;

  navItems: NavItemAdmin[] = [];

  ngOnInit(): void {
    const userDataStr = localStorage.getItem('userData');

    if (userDataStr) {
      this.userRol(userDataStr);
    } else {
      this.router.navigate(['/authentication/login']);
    }
  }

  userRol(userRole: string) {
    try {
      const userData = JSON.parse(userRole);
      const username = userData.user;
      if (username === 'admin') {
        this.navItems = this.filterMenuByRole(navItemsAdmin, username);
      } else if (username === 'user') {
        this.navItems = this.filterMenuByRole(navItemsUser, username);
      } else {
        throw new Error('Rol no reconocido');
      }
    } catch (e) {
      console.error('Error:', e);
      this.router.navigate(['/authentication/login']);
    }
  }

  filterMenuByRole(menu: NavItemAdmin[], role: string): NavItemAdmin[] {
    return menu
      .filter((item) => !item.roles || item.roles.includes(role))
      .map((item) => ({
        ...item,
        children: item.children
          ? this.filterMenuByRole(item.children, role)
          : [],
      }));
  }

  get isOver(): boolean {
    return this.isMobileScreen;
  }

  get isTablet(): boolean {
    return this.resView;
  }

  constructor(
    private settings: CoreService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.htmlElement = document.querySelector('html')!;
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW, BELOWMONITOR])
      .subscribe((state) => {
        // SidenavOpened must be reset true when layout changes
        this.options.sidenavOpened = true;
        this.isMobileScreen = state.breakpoints[MOBILE_VIEW];
        if (this.options.sidenavCollapsed == false) {
          this.options.sidenavCollapsed = state.breakpoints[TABLET_VIEW];
        }
        this.isContentWidthFixed = state.breakpoints[MONITOR_VIEW];
        this.resView = state.breakpoints[BELOWMONITOR];
      });
    // This is for scroll to top
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e) => {
        this.content.scrollTo({ top: 0 });
      });
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
    this.options.sidenavOpened = isOpened;
    this.settings.setOptions(this.options);
  }

  onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  toggleCollapsed() {
    this.isContentWidthFixed = false;
    this.options.sidenavCollapsed = !this.options.sidenavCollapsed;

    if (this.options.sidenavCollapsed) {
      this.sidenav.close();
    } else {
      this.sidenav.open();
    }

    this.resetCollapsedState();
  }

  resetCollapsedState(timer = 400) {
    setTimeout(() => this.settings.setOptions(this.options), timer);
  }
}

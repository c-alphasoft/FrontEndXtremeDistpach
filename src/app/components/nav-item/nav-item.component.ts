import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostBinding,
} from '@angular/core';
import { NavItemAdmin } from '../../modules/interfaces/nav-item-admin';
import { NavService } from '../../services/nav.service';
import { Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { TranslateModule } from '@ngx-translate/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';

@Component({
    standalone: true,
    selector: 'app-nav-item',
    imports: [
        MatIconModule,
        TranslateModule,
        TablerIconsModule,
        MaterialModule,
        CommonModule,
    ],
    templateUrl: './nav-item.component.html',
    styleUrls: [],
    animations: [
        trigger('indicatorRotate', [
            state('collapsed', style({ transform: 'rotate(0deg)' })),
            state('expanded', style({ transform: 'rotate(180deg)' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
        ]),
    ]
})
export class NavItemComponent {
  expanded: any = false;
  disabled: any = false;
  twoLines: any = false;
  @Input() item: NavItemAdmin | any;
  @Input() depth: any;
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() toggleMobileLink: any = new EventEmitter<void>();
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;

  constructor(public navService: NavService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  onItemSelected(item: NavItemAdmin) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
    //scroll
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    if (!this.expanded) {
      if (window.innerWidth < 1024) {
        this.notify.emit();
      }
    }
  }

  onSubItemSelected(item: NavItemAdmin) {
    if (!item.children || !item.children.length) {
      if (this.expanded && window.innerWidth < 1024) {
        this.notify.emit();
      }
    }
  }
}

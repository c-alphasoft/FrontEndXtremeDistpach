import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
    standalone: true,
    selector: 'app-sidebar',
    imports: [TablerIconsModule, MaterialModule],
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
}

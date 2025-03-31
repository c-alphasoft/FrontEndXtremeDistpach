import { Component } from '@angular/core';
import { LayoutsComponent } from '../../components/layouts/layouts.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [LayoutsComponent],
  templateUrl: './user.component.html',
})
export class UserComponent {}

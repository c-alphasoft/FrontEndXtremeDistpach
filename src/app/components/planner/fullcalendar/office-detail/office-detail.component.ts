import { MaterialModule } from '../../../../material.module';
import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-office-detail',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterModule],
  templateUrl: './office-detail.component.html',
  styleUrl: './office-detail.component.scss',
})
export class OfficeDetailComponent implements OnInit {
  event: CalendarEvent | null = null;
  receivedData: any;

  displayedColumns: string[] = [
    'dispatch_code',
    'dateDistpch',
    'dispatchTime',
    'dateDelivery',
    'timeDelivery',
    'm3',
    'shift',
    'status',
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.receivedData = history.state.datos;
  }
}

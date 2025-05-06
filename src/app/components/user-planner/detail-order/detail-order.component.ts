import { MaterialModule } from '../../../material.module';
import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterModule],
  templateUrl: './detail-order.component.html',
  styleUrl: './detail-order.component.scss',
})
export class DetailOrderComponent implements OnInit {
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

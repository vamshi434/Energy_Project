import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true, // ✅ Add this
  imports: [CommonModule], // ✅ Include needed modules here
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] // ✅ this should be `styleUrls`, not `styleUrl`
})
export class DashboardComponent {}

import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common'; // ✅ Needed for *ngIf

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, NavbarComponent], // ✅ Add CommonModule here
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(public router: Router) {}
}

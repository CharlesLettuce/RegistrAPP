import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.page.html',
  styleUrls: ['./access-denied.page.scss'],
})
export class AccessDeniedPage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkActive,RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterLinkActive,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  userName: string | null = null;
  logged:boolean=false   
  constructor(private authService:AuthService){

  }
  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name;
    if(user.name){
      this.logged=true
    }
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.logged = isLoggedIn;
    });
  }
  handleLogout(){
    this.authService.logout()
  }
}

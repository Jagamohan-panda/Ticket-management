import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userName: string | null = null;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  
  constructor() { 
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name;
    if(user.name){
      this.isLoggedInSubject.next(true);
    }
  }

  logIn(){
    
    this.isLoggedInSubject.next(true);
  }
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
  }
}

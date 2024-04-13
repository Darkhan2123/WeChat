import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  users: User[] = []
  selectedUser: User | null = null;
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit():void {
    this.getUsers();
  }
  getUsers(): void{
    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
    });
  }
  selectUser(userId: number): void {
    const user = this.users.find(user => user.id === userId);
    if(user){
      this.selectedUser = user;
    }
  }
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
      }
    });
  }

}

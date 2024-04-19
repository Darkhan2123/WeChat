import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  username: string = '';
  email: string = '';
  password: string = '';
  active: boolean = false;

  constructor(private authService: AuthService, private router: Router, private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {

    const registerBtn = this.el.nativeElement.querySelector('#register');
    const loginBtn = this.el.nativeElement.querySelector('#login');

    this.renderer.listen(registerBtn, 'click', (event) => {
      this.toggleActiveState(true);
    });
    this.renderer.listen(loginBtn, 'click', (event) => {
      this.toggleActiveState(false);
    })
  }

  toggleActiveState(isActive: boolean): void {
    this.active = isActive;
    const container = this.el.nativeElement.querySelector('#container');
    if(this.active) {
      this.renderer.addClass(container, 'active');
    } else {
      this.renderer.removeClass(container, 'active');
    }
  }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        localStorage.setItem('currentUserId', response.user_id);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  register() {
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        localStorage.setItem('currentUserId', response.user_id);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Registration failed', error);
      }
    });
  }

}

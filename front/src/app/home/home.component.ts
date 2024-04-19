import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../sidebar.service'
import {catchError, Subject, of} from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
  })
  export class HomeComponent implements OnInit{
    username = '';
    users: any [] = [];
    user_list: any [] = [];
    error: string = ''
    searchTerms = new Subject<string>();

    constructor(private authService: AuthService,
                private sidebarService: SidebarService,
                private router: Router,
                private route: ActivatedRoute) {
      this.initSearch();
    }

    ngOnInit() {
      this.loadUsers();
    }

  initSearch(): void {
        this.searchTerms.pipe(
            debounceTime(300),
            switchMap(term => this.sidebarService.searchUser(term)
                .pipe(
                    catchError(err => {
                        console.error('Search error:', err);
                        this.error = 'Failed to fetch users';
                        this.users = [];
                        return of([]); // Return an empty array to keep the stream alive
                    })
                )),
        ).subscribe(users => {
            this.users = users;
            this.error = '';
        });
    }

    loadUsers() {
      this.sidebarService.availableUsers().subscribe({
        next: (data) => {
          this.user_list = data;
        }
      })
    }

    searchUser(term: string): void {
      this.searchTerms.next(term);
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

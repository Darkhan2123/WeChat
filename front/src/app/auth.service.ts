import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/api';  // Base URL for your Django backend

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/login/`, { email, password });
  }
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/`, { name, email, password });
  }
  getUsers(): Observable<any> {
  return this.http.get(`${this.baseUrl}/home/`, { withCredentials: true });
  }
  selectedUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/`, {withCredentials: true});
  }
  getUserById(id: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/user/${id}`, { withCredentials: true })
  }
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout/`, { })
  }
}

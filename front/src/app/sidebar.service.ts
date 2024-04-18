import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor( private http: HttpClient ) { }

  searchUser(query: string): Observable<any>{
    return this.http.get(`${this.baseUrl}/search_user/?query=${query}`);
  }

  availableUsers(): Observable<any>{
   return this.http.get(`${this.baseUrl}/users/`);
  }
}

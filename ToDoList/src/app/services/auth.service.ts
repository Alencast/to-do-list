import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';
  private currentUserSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  constructor(private http: HttpClient) {
    // Carrega token do localStorage ao inicializar
    const token = localStorage.getItem('access_token');
    if (token) {
      this.tokenSignal.set(token);
    }
  }

  get currentUser() {
    return this.currentUserSignal.asReadonly();
  }

  get token() {
    return this.tokenSignal.asReadonly();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, credentials).pipe(
      tap(response => {
        this.tokenSignal.set(response.access);
        this.currentUserSignal.set(response.user);
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
      })
    );
  }

  logout(): void {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}

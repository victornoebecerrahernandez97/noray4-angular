import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sala } from '../models/sala.model';
import { GuestTokenRequest, TokenResponse, UserOut } from '../models/auth.model';

const BASE = 'https://web-production-66456.up.railway.app/api/v1';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  // Auth
  guestToken(body: GuestTokenRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${BASE}/auth/guest-token`, body);
  }

  me(): Observable<UserOut> {
    return this.http.get<UserOut>(`${BASE}/auth/me`);
  }

  login(email: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${BASE}/auth/login`, { email, password });
  }

  riderMe(): Observable<any> {
    return this.http.get<any>(`${BASE}/riders/me`);
  }

  // Salas
  getSalas(skip = 0, limit = 20): Observable<Sala[]> {
    return this.http.get<Sala[]>(`${BASE}/salas`, { params: { skip, limit } });
  }

  getSala(id: string): Observable<Sala> {
    return this.http.get<Sala>(`${BASE}/salas/${id}`);
  }

  getAllSalas(skip = 0, limit = 50): Observable<Sala[]> {
    return this.http.get<Sala[]>(`${BASE}/salas`, { params: { skip, limit } });
  }
}

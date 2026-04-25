import { Injectable } from '@angular/core';

const TOKEN_KEY = 'n4_token';

@Injectable({ providedIn: 'root' })
export class TokenService {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  isAdmin(): boolean {
    const token = this.get();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.is_admin === true;
    } catch {
      return false;
    }
  }

  isGuest(): boolean {
    const token = this.get();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.is_guest === true;
    } catch {
      return false;
    }
  }

  getNickname(): string | null {
    const token = this.get();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.display_name ?? null;
    } catch {
      return null;
    }
  }
}

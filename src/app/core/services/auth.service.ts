import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private token = inject(TokenService);
  private router = inject(Router);

  nickname = signal<string | null>(this.token.getNickname());
  isGuest = signal<boolean>(this.token.isGuest());

  async loginAsGuest(nickname: string): Promise<void> {
    const res = await firstValueFrom(this.api.guestToken({ nickname }));
    this.token.set(res.access_token);
    this.nickname.set(res.display_name ?? nickname);
    this.isGuest.set(true);
  }

  logout(): void {
    this.token.clear();
    this.nickname.set(null);
    this.isGuest.set(false);
    this.router.navigate(['/']);
  }
}

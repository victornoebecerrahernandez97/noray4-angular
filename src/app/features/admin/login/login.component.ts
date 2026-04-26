import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-card__brand">
          Noray<sup>4</sup> <span class="login-card__admin-tag">Admin</span>
        </div>
        <h1 class="login-card__title">Acceso restringido</h1>
        <p class="login-card__sub">Solo administradores de Noray4.</p>

        <form class="login-form" (ngSubmit)="submit()">
          <div class="login-form__group">
            <label class="login-form__label">Email</label>
            <input
              class="login-form__input"
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="admin@noray4.app"
              autocomplete="email"
              required
            />
          </div>
          <div class="login-form__group">
            <label class="login-form__label">Contraseña</label>
            <input
              class="login-form__input"
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              autocomplete="current-password"
              required
            />
          </div>

          @if (error()) {
            <p class="login-form__error">{{ error() }}</p>
          }

          <button
            class="login-form__submit"
            type="submit"
            [disabled]="loading()"
          >
            {{ loading() ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: var(--n4-background);
    }
    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 40px;
      background: var(--n4-surface-card);
      border: 0.5px solid var(--n4-border);
      border-radius: var(--n4-radius-primary);
    }
    .login-card__brand {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.04em;
      color: var(--n4-text-primary);
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      gap: 8px;
      sup { color: var(--n4-blue); font-size: 12px; }
    }
    .login-card__admin-tag {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--n4-amber);
      background: var(--n4-amber-dim);
      border: 0.5px solid var(--n4-amber);
      padding: 2px 8px;
      border-radius: 999px;
    }
    .login-card__title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--n4-text-primary);
      margin-bottom: 8px;
    }
    .login-card__sub {
      font-size: 14px;
      color: var(--n4-text-secondary);
      margin-bottom: 32px;
    }
    .login-form { display: flex; flex-direction: column; gap: 16px; }
    .login-form__group { display: flex; flex-direction: column; gap: 6px; }
    .login-form__label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--n4-text-muted);
      text-transform: uppercase;
    }
    .login-form__input {
      padding: 12px 14px;
      font-size: 14px;
      font-family: var(--n4-font);
      color: var(--n4-text-primary);
      background: var(--n4-background);
      border: 0.5px solid var(--n4-border);
      border-radius: var(--n4-radius-secondary);
      outline: none;
      transition: border-color var(--n4-transition);
      &:focus { border-color: var(--n4-blue); }
    }
    .login-form__error {
      font-size: 13px;
      color: #ef4444;
      padding: 10px 14px;
      background: rgba(239,68,68,0.08);
      border: 0.5px solid rgba(239,68,68,0.3);
      border-radius: var(--n4-radius-secondary);
    }
    .login-form__submit {
      padding: 14px;
      font-size: 15px;
      font-weight: 600;
      font-family: var(--n4-font);
      color: var(--n4-background);
      background: var(--n4-text-primary);
      border: none;
      border-radius: var(--n4-radius-pill);
      cursor: pointer;
      transition: opacity var(--n4-transition);
      margin-top: 8px;
      &:hover:not(:disabled) { opacity: 0.85; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
  `]
})
export class AdminLoginComponent {
  private api = inject(ApiService);
  private tokenSvc = inject(TokenService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  async submit(): Promise<void> {
    if (!this.email || !this.password) return;
    this.loading.set(true);
    this.error.set(null);

    try {
      const res = await firstValueFrom(this.api.login(this.email, this.password));
      this.tokenSvc.set(res.access_token);

      const rider = await firstValueFrom(this.api.riderMe());
      if (!rider.is_admin) {
        this.tokenSvc.clear();
        this.error.set('Tu cuenta no tiene permisos de administrador.');
        this.loading.set(false);
        return;
      }

      this.router.navigate(['/admin']);
    } catch {
      this.tokenSvc.clear();
      this.error.set('Credenciales incorrectas. Inténtalo de nuevo.');
      this.loading.set(false);
    }
  }
}

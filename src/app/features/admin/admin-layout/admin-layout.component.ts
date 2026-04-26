import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin">
      <aside class="admin__sidebar">
        <div class="admin__brand">
          Noray<sup>4</sup>
          <span class="admin__admin-tag">Admin</span>
        </div>
        <nav class="admin__nav">
          <a routerLink="/admin" routerLinkActive="admin__nav-item--active"
             [routerLinkActiveOptions]="{exact:true}" class="admin__nav-item">
            <span class="admin__nav-icon">⊞</span> Dashboard
          </a>
          <a routerLink="/admin/salas" routerLinkActive="admin__nav-item--active"
             class="admin__nav-item">
            <span class="admin__nav-icon">◎</span> Salidas
          </a>
          <a routerLink="/admin/riders" routerLinkActive="admin__nav-item--active"
             class="admin__nav-item">
            <span class="admin__nav-icon">◈</span> Riders
          </a>
        </nav>
        <button class="admin__logout" (click)="logout()">
          Cerrar sesión
        </button>
      </aside>

      <main class="admin__content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .admin {
      display: flex;
      min-height: 100vh;
      background: var(--n4-background);
      font-family: var(--n4-font);
    }
    .admin__sidebar {
      width: 220px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      padding: 28px 16px;
      border-right: 0.5px solid var(--n4-border);
      background: var(--n4-surface-card);
      position: sticky;
      top: 0;
      height: 100vh;
    }
    .admin__brand {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: -0.04em;
      color: var(--n4-text-primary);
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 32px;
      padding: 0 8px;
      sup { color: var(--n4-blue); font-size: 10px; }
    }
    .admin__admin-tag {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--n4-amber);
      background: var(--n4-amber-dim);
      border: 0.5px solid var(--n4-amber);
      padding: 2px 6px;
      border-radius: 999px;
    }
    .admin__nav {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
    }
    .admin__nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      font-size: 14px;
      font-weight: 500;
      color: var(--n4-text-secondary);
      text-decoration: none;
      border-radius: var(--n4-radius-secondary);
      transition: all var(--n4-transition);
      &:hover { background: var(--n4-surface-muted); color: var(--n4-text-primary); }
      &--active {
        background: var(--n4-surface-muted);
        color: var(--n4-text-primary);
        font-weight: 600;
      }
    }
    .admin__nav-icon { font-size: 16px; width: 20px; text-align: center; }
    .admin__logout {
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 500;
      font-family: var(--n4-font);
      color: var(--n4-text-muted);
      background: transparent;
      border: 0.5px solid var(--n4-border);
      border-radius: var(--n4-radius-secondary);
      cursor: pointer;
      text-align: left;
      transition: all var(--n4-transition);
      &:hover { color: var(--n4-text-primary); border-color: var(--n4-text-primary); }
    }
    .admin__content {
      flex: 1;
      overflow-y: auto;
      padding: 40px;
    }
    @media (max-width: 768px) {
      .admin { flex-direction: column; }
      .admin__sidebar { width: 100%; height: auto; position: static; flex-direction: row; flex-wrap: wrap; gap: 12px; }
      .admin__nav { flex-direction: row; }
      .admin__content { padding: 24px 16px; }
    }
  `]
})
export class AdminLayoutComponent {
  private tokenSvc = inject(TokenService);
  private router = inject(Router);

  logout(): void {
    this.tokenSvc.clear();
    this.router.navigate(['/admin/login']);
  }
}

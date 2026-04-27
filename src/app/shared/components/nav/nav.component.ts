import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <nav class="n4-nav">
      <a routerLink="/" class="n4-nav__logo">
        Noray<sup>4</sup>
      </a>
      <div class="n4-nav__links">
        <a routerLink="/explorar" class="n4-nav__link">Explorar</a>
      </div>
      <a href="#download" class="n4-nav__cta">Descargar app</a>
    </nav>
  `,
  styles: [`
    .n4-nav {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 48px);
      max-width: 1100px;
      display: flex;
      align-items: center;
      padding: 12px 20px;
      background: rgba(10, 15, 22, 0.55);
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border: 0.5px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      z-index: 100;
      justify-content: space-between;
    }
    .n4-nav__logo {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.04em;
      color: rgba(255, 255, 255, 0.92);
      text-decoration: none;
      sup { color: var(--n4-blue); font-size: 12px; vertical-align: super; }
    }
    .n4-nav__links {
      display: flex;
      gap: 28px;
      margin-left: 32px;
      flex: 1;
    }
    .n4-nav__link {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.65);
      text-decoration: none;
      transition: color var(--n4-transition);
      &:hover { color: #fff; }
    }
    .n4-nav__cta {
      font-size: 13px;
      font-weight: 600;
      color: #0a0a0a;
      background: #fff;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: var(--n4-radius-pill);
      transition: opacity var(--n4-transition);
      &:hover { opacity: 0.85; }
    }
    @media (max-width: 640px) {
      .n4-nav__links { display: none; }
      .n4-nav { width: calc(100% - 32px); }
    }
  `]
})
export class NavComponent { }

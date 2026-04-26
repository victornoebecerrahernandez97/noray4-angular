import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Sala } from '../../../core/models/sala.model';
import { SalaCardSkeletonComponent } from '../../../shared/components/skeleton/sala-card-skeleton.component';

@Component({
  selector: 'n4-explorar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SalaCardSkeletonComponent],
  template: `
    <div class="explorar">
      <div class="explorar__header">
        <span class="explorar__label">SALIDAS ABIERTAS</span>
        <h1 class="explorar__title">Explorar</h1>
        <p class="explorar__sub">Salidas en curso y próximas de la comunidad Noray4.</p>
      </div>

      @if (loading()) {
        <div class="explorar__grid">
          @for (i of [1,2,3,4,5,6]; track i) {
            <n4-sala-card-skeleton />
          }
        </div>
      } @else if (salas().length === 0) {
        <div class="explorar__empty">
          <p>No hay salidas activas en este momento.</p>
        </div>
      } @else {
        <div class="explorar__grid">
          @for (sala of salas(); track sala._id) {
            <a [routerLink]="['/sala', sala._id]" class="sala-card">
              <div class="sala-card__header">
                <span class="n4-pill" [class.n4-pill--active]="sala.status === 'active'">
                  @if (sala.status === 'active') {
                    <span class="n4-live-dot"></span>
                  }
                  {{ sala.status === 'active' ? 'En curso' : 'Cerrada' }}
                </span>
                <span class="sala-card__riders">{{ sala.miembros.length }} riders</span>
              </div>
              <h3 class="sala-card__name">{{ sala.name }}</h3>
              @if (sala.description) {
                <p class="sala-card__desc">{{ sala.description }}</p>
              }
              <div class="sala-card__footer">
                <span class="sala-card__privacy">
                  {{ sala.is_private ? 'Privada' : 'Pública' }}
                </span>
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .explorar {
      max-width: 1100px;
      margin: 0 auto;
      padding: 100px 24px 80px;
    }
    .explorar__header {
      margin-bottom: 48px;
    }
    .explorar__label {
      display: block;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: var(--n4-text-muted);
      margin-bottom: 12px;
    }
    .explorar__title {
      font-size: clamp(32px, 5vw, 52px);
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--n4-text-primary);
      margin-bottom: 12px;
    }
    .explorar__sub {
      font-size: 15px;
      color: var(--n4-text-secondary);
    }
    .explorar__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    .explorar__empty {
      text-align: center;
      padding: 80px 24px;
      font-size: 15px;
      color: var(--n4-text-muted);
    }
    .sala-card {
      display: block;
      padding: 24px;
      background: var(--n4-surface-card);
      border: 0.5px solid var(--n4-border);
      border-radius: var(--n4-radius-primary);
      text-decoration: none;
      transition: border-color var(--n4-transition), transform var(--n4-transition);
      &:hover {
        border-color: var(--n4-text-primary);
        transform: translateY(-2px);
      }
    }
    .sala-card__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .sala-card__riders {
      font-size: 12px;
      font-weight: 500;
      color: var(--n4-text-muted);
    }
    .sala-card__name {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: var(--n4-text-primary);
      margin-bottom: 8px;
    }
    .sala-card__desc {
      font-size: 13px;
      color: var(--n4-text-secondary);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 12px;
    }
    .sala-card__footer {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 0.5px solid var(--n4-border);
    }
    .sala-card__privacy {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      color: var(--n4-text-muted);
      text-transform: uppercase;
    }
    .n4-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 999px;
      border: 0.5px solid var(--n4-border);
      font-size: 11px;
      font-weight: 600;
      color: var(--n4-text-muted);
      background: transparent;
      &--active {
        color: var(--n4-blue);
        border-color: var(--n4-blue);
        background: var(--n4-blue-dim);
      }
    }
    .n4-live-dot {
      width: 6px;
      height: 6px;
      background: #ef4444;
      border-radius: 50%;
      animation: pulse 1.2s ease-in-out infinite;
      display: inline-block;
      flex-shrink: 0;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }
  `]
})
export class ExplorarComponent implements OnInit {
  private api = inject(ApiService);

  salas = signal<Sala[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.api.getSalas(0, 20).subscribe({
      next: (data) => { this.salas.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}

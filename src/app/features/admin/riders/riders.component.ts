import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Sala } from '../../../core/models/sala.model';

interface RiderResumen {
  rider_id: string;
  display_name: string;
  role: string;
  salas: number;
}

@Component({
  selector: 'app-admin-riders',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="admin-section">
      <div class="admin-section__header">
        <h1 class="admin-section__title">Riders</h1>
        <span class="admin-section__count">{{ riders().length }} riders registrados</span>
      </div>
      <p class="admin-section__note">
        Riders únicos detectados a partir de las salidas activas y cerradas.
      </p>

      @if (loading()) {
        <p class="admin-section__loading">Cargando...</p>
      } @else {
        <div class="admin-table">
          <div class="admin-table__head">
            <span>Rider</span>
            <span>ID</span>
            <span>Salidas</span>
          </div>
          @for (rider of riders(); track rider.rider_id) {
            <div class="admin-table__row">
              <div class="admin-rider">
                <div class="admin-rider__avatar">
                  {{ initials(rider.display_name) }}
                </div>
                <span class="admin-rider__name">{{ rider.display_name }}</span>
              </div>
              <span class="admin-table__id">{{ rider.rider_id.slice(-8) }}</span>
              <span>{{ rider.salas }}</span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .admin-section__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .admin-section__title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--n4-text-primary);
    }
    .admin-section__count { font-size: 13px; color: var(--n4-text-muted); }
    .admin-section__note {
      font-size: 13px;
      color: var(--n4-text-muted);
      margin-bottom: 24px;
    }
    .admin-table {
      background: var(--n4-surface-card);
      border: 0.5px solid var(--n4-border);
      border-radius: var(--n4-radius-primary);
      overflow: hidden;
    }
    .admin-table__head {
      display: grid;
      grid-template-columns: 2fr 1fr 80px;
      padding: 10px 20px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--n4-text-muted);
      border-bottom: 0.5px solid var(--n4-border);
      background: var(--n4-surface-muted);
    }
    .admin-table__row {
      display: grid;
      grid-template-columns: 2fr 1fr 80px;
      align-items: center;
      padding: 12px 20px;
      font-size: 14px;
      color: var(--n4-text-secondary);
      border-bottom: 0.5px solid var(--n4-border);
      transition: background var(--n4-transition);
      &:last-child { border-bottom: none; }
      &:hover { background: var(--n4-surface-muted); }
    }
    .admin-rider { display: flex; align-items: center; gap: 10px; }
    .admin-rider__avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--n4-surface-muted);
      border: 0.5px solid var(--n4-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: var(--n4-text-secondary);
      flex-shrink: 0;
    }
    .admin-rider__name { font-weight: 500; color: var(--n4-text-primary); }
    .admin-table__id { font-family: monospace; font-size: 12px; color: var(--n4-text-muted); }
    .admin-section__loading { padding: 40px 20px; font-size: 14px; color: var(--n4-text-muted); }
  `]
})
export class AdminRidersComponent implements OnInit {
  private api = inject(ApiService);

  salas = signal<Sala[]>([]);
  loading = signal(true);

  riders = computed<RiderResumen[]>(() => {
    const map = new Map<string, RiderResumen>();
    for (const sala of this.salas()) {
      for (const m of sala.miembros) {
        const existing = map.get(m.rider_id);
        if (existing) {
          existing.salas++;
        } else {
          map.set(m.rider_id, {
            rider_id: m.rider_id,
            display_name: m.display_name,
            role: m.role,
            salas: 1,
          });
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => b.salas - a.salas);
  });

  ngOnInit(): void {
    this.api.getAllSalas(0, 200).subscribe({
      next: d => { this.salas.set(d); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  initials(name: string): string {
    return name.trim().split(' ').slice(0, 2)
      .map(w => w[0]?.toUpperCase() ?? '').join('');
  }
}

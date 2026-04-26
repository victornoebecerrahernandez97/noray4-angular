import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Sala } from '../../../core/models/sala.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="dash">
      <h1 class="dash__title">Dashboard</h1>

      <div class="dash__kpis">
        <div class="kpi-card">
          <span class="kpi-card__value">{{ activas() }}</span>
          <span class="kpi-card__label">Salidas activas</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-card__value">{{ totalRiders() }}</span>
          <span class="kpi-card__label">Riders en pista</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-card__value">{{ totalSalas() }}</span>
          <span class="kpi-card__label">Salidas totales</span>
        </div>
        <div class="kpi-card kpi-card--status" [class.kpi-card--ok]="mqttOk()">
          <span class="kpi-card__value">{{ mqttOk() ? 'OK' : 'OFF' }}</span>
          <span class="kpi-card__label">MQTT</span>
        </div>
      </div>

      <div class="dash__section">
        <div class="dash__section-header">
          <h2 class="dash__section-title">Salidas en curso</h2>
          <a routerLink="/admin/salas" class="dash__section-link">Ver todas →</a>
        </div>

        @if (loading()) {
          <div class="dash__skeleton-table">
            @for (i of [1,2,3,4,5]; track i) {
              <div class="dash__skeleton-row">
                <div class="n4-sk n4-sk--name"></div>
                <div class="n4-sk n4-sk--short"></div>
                <div class="n4-sk n4-sk--short"></div>
                <div class="n4-sk n4-sk--short"></div>
              </div>
            }
          </div>
        } @else if (salasList().length === 0) {
          <p class="dash__empty">No hay salidas activas en este momento.</p>
        } @else {
          <div class="dash__table">
            <div class="dash__table-head">
              <span>Nombre</span>
              <span>Riders</span>
              <span>Inicio</span>
              <span>Privacidad</span>
            </div>
            @for (sala of salasList().slice(0, 5); track sala._id) {
              <div class="dash__table-row">
                <span class="dash__table-name">{{ sala.name }}</span>
                <span>{{ sala.miembros.length }}</span>
                <span class="dash__table-time">{{ tiempoDesde(sala.created_at) }}</span>
                <span>{{ sala.is_private ? 'Privada' : 'Pública' }}</span>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dash__title {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--n4-text-primary);
      margin-bottom: 32px;
    }
    .dash__kpis {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 16px;
      margin-bottom: 40px;
    }
    .kpi-card {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 24px 20px;
      background: var(--n4-surface-card);
      border: 0.5px solid var(--n4-border);
      border-radius: var(--n4-radius-primary);
    }
    .kpi-card--status .kpi-card__value { color: var(--n4-text-muted); }
    .kpi-card--ok .kpi-card__value { color: #22c55e; }
    .kpi-card__value {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: -0.04em;
      color: var(--n4-text-primary);
      font-variant-numeric: tabular-nums;
    }
    .kpi-card__label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--n4-text-muted);
      text-transform: uppercase;
    }
    .dash__section { background: var(--n4-surface-card); border: 0.5px solid var(--n4-border); border-radius: var(--n4-radius-primary); padding: 24px; }
    .dash__section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .dash__section-title { font-size: 16px; font-weight: 600; color: var(--n4-text-primary); }
    .dash__section-link { font-size: 13px; font-weight: 500; color: var(--n4-blue); text-decoration: none; }
    .dash__loading, .dash__empty { font-size: 14px; color: var(--n4-text-muted); }
    .dash__table { display: flex; flex-direction: column; }
    .dash__table-head {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      padding: 8px 12px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--n4-text-muted);
      text-transform: uppercase;
      border-bottom: 0.5px solid var(--n4-border);
    }
    .dash__table-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      padding: 12px;
      font-size: 14px;
      color: var(--n4-text-secondary);
      border-bottom: 0.5px solid var(--n4-border);
      transition: background var(--n4-transition);
      &:last-child { border-bottom: none; }
      &:hover { background: var(--n4-surface-muted); }
    }
    .dash__table-name { font-weight: 500; color: var(--n4-text-primary); }
    .dash__table-time { font-variant-numeric: tabular-nums; }
    .dash__skeleton-table {
      display: flex;
      flex-direction: column;
      background: var(--n4-surface-card);
      border: 0.5px solid var(--n4-border);
      border-radius: var(--n4-radius-primary);
      overflow: hidden;
    }
    .dash__skeleton-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 12px;
      padding: 16px 12px;
      border-bottom: 0.5px solid var(--n4-border);
      &:last-child { border-bottom: none; }
    }
    .n4-sk {
      height: 14px;
      border-radius: 4px;
      background: linear-gradient(90deg, var(--n4-surface-card) 0%, var(--n4-surface-muted) 40%, var(--n4-surface-card) 80%);
      background-size: 300% 100%;
      animation: n4shimmer 1.6s ease-in-out infinite;
      &--name { width: 80%; }
      &--short { width: 60%; }
    }
    @keyframes n4shimmer {
      0%   { background-position: 100% 0; }
      100% { background-position: -100% 0; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);

  salas = signal<Sala[]>([]);
  loading = signal(true);
  mqttOk = signal(false);

  salasList = computed(() => this.salas().filter(s => s.status === 'active'));
  activas = computed(() => this.salasList().length);
  totalRiders = computed(() => this.salasList().reduce((acc, s) => acc + s.miembros.length, 0));
  totalSalas = computed(() => this.salas().length);

  ngOnInit(): void {
    fetch('https://web-production-66456.up.railway.app/health')
      .then(r => r.json())
      .then((d: any) => this.mqttOk.set(d.mqtt === true))
      .catch(() => {});

    this.api.getAllSalas().subscribe({
      next: (data) => { this.salas.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  tiempoDesde(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }
}

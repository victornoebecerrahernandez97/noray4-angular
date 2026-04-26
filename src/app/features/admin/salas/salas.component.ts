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

type FiltroSala = 'todas' | 'activas' | 'cerradas';

@Component({
  selector: 'app-admin-salas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="admin-section">
      <div class="admin-section__header">
        <h1 class="admin-section__title">Salidas</h1>
        <div class="filtros">
          @for (f of filtros; track f.val) {
            <button
              class="filtro-btn"
              [class.filtro-btn--active]="filtro() === f.val"
              (click)="filtro.set(f.val)">
              {{ f.label }}
            </button>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="admin-table">
          <div class="admin-table__head">
            <span>Nombre</span>
            <span>Estado</span>
            <span>Riders</span>
            <span>Privacidad</span>
            <span>Inicio</span>
          </div>
          @for (i of [1,2,3,4,5,6,7]; track i) {
            <div class="admin-table__row">
              <div class="sk-cell sk-cell--wide"></div>
              <div class="sk-cell sk-cell--pill"></div>
              <div class="sk-cell sk-cell--sm"></div>
              <div class="sk-cell sk-cell--sm"></div>
              <div class="sk-cell sk-cell--sm"></div>
            </div>
          }
        </div>
      } @else {
        <div class="admin-table">
          <div class="admin-table__head">
            <span>Nombre</span>
            <span>Estado</span>
            <span>Riders</span>
            <span>Privacidad</span>
            <span>Inicio</span>
          </div>
          @for (sala of filtradas(); track sala._id) {
            <div class="admin-table__row">
              <div class="admin-table__name">
                <span>{{ sala.name }}</span>
                @if (sala.description) {
                  <span class="admin-table__sub">{{ sala.description }}</span>
                }
              </div>
              <span>
                <span class="status-pill" [class.status-pill--active]="sala.status === 'active'">
                  {{ sala.status === 'active' ? 'Activa' : 'Cerrada' }}
                </span>
              </span>
              <span>{{ sala.miembros.length }}</span>
              <span>{{ sala.is_private ? 'Privada' : 'Pública' }}</span>
              <span class="admin-table__time">{{ tiempoDesde(sala.created_at) }}</span>
            </div>
          }
          @if (filtradas().length === 0) {
            <p class="admin-section__empty">No hay salidas con este filtro.</p>
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
      margin-bottom: 28px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .admin-section__title {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--n4-text-primary);
    }
    .filtros { display: flex; gap: 8px; }
    .filtro-btn {
      padding: 7px 14px;
      font-size: 12px;
      font-weight: 500;
      font-family: var(--n4-font);
      color: var(--n4-text-secondary);
      background: transparent;
      border: 0.5px solid var(--n4-border);
      border-radius: var(--n4-radius-pill);
      cursor: pointer;
      transition: all var(--n4-transition);
      &:hover { color: var(--n4-text-primary); }
      &--active { background: var(--n4-text-primary); color: var(--n4-background); border-color: transparent; }
    }
    .admin-table {
      background: var(--n4-surface-card);
      border: 0.5px solid var(--n4-border);
      border-radius: var(--n4-radius-primary);
      overflow: hidden;
    }
    .admin-table__head {
      display: grid;
      grid-template-columns: 2fr 1fr 80px 100px 100px;
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
      grid-template-columns: 2fr 1fr 80px 100px 100px;
      align-items: center;
      padding: 14px 20px;
      font-size: 14px;
      color: var(--n4-text-secondary);
      border-bottom: 0.5px solid var(--n4-border);
      transition: background var(--n4-transition);
      &:last-child { border-bottom: none; }
      &:hover { background: var(--n4-surface-muted); }
    }
    .admin-table__name { display: flex; flex-direction: column; gap: 2px; }
    .admin-table__sub {
      font-size: 12px;
      color: var(--n4-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .admin-table__time { font-variant-numeric: tabular-nums; font-size: 13px; }
    .status-pill {
      display: inline-flex;
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 999px;
      background: var(--n4-surface-muted);
      color: var(--n4-text-muted);
      border: 0.5px solid var(--n4-border);
      &--active {
        background: var(--n4-blue-dim);
        color: var(--n4-blue);
        border-color: var(--n4-blue);
      }
    }
    .admin-section__loading,
    .admin-section__empty { padding: 40px 20px; font-size: 14px; color: var(--n4-text-muted); }
    .sk-cell {
      height: 14px;
      border-radius: 4px;
      background: linear-gradient(90deg, var(--n4-surface-card) 0%, var(--n4-surface-muted) 40%, var(--n4-surface-card) 80%);
      background-size: 300% 100%;
      animation: skshimmer 1.6s ease-in-out infinite;
      &--wide { width: 70%; }
      &--pill { width: 60px; height: 22px; border-radius: 999px; }
      &--sm { width: 50%; }
    }
    @keyframes skshimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
  `]
})
export class AdminSalasComponent implements OnInit {
  private api = inject(ApiService);

  salas = signal<Sala[]>([]);
  loading = signal(true);
  filtro = signal<FiltroSala>('activas');

  filtros = [
    { val: 'activas' as FiltroSala, label: 'Activas' },
    { val: 'todas' as FiltroSala, label: 'Todas' },
    { val: 'cerradas' as FiltroSala, label: 'Cerradas' },
  ];

  filtradas = computed(() => {
    const f = this.filtro();
    return this.salas().filter(s =>
      f === 'todas' ? true : f === 'activas' ? s.status === 'active' : s.status === 'closed'
    );
  });

  ngOnInit(): void {
    this.api.getAllSalas(0, 100).subscribe({
      next: d => { this.salas.set(d); this.loading.set(false); },
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

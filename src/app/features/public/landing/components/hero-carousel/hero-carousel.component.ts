import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { interval } from 'rxjs';
import { PhoneMockupComponent, PhoneScreen } from '../phone-mockup/phone-mockup.component';

type HeroState = 'a' | 'b' | 'c';
type SlotPosition = 'far' | 'mid' | 'near';
type Slot = 'left' | 'center' | 'right';

@Component({
  selector: 'n4-hero-carousel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PhoneMockupComponent, RouterLink],
  templateUrl: './hero-carousel.component.html',
  styleUrl: './hero-carousel.component.scss',
})
export class HeroCarouselComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  private cycle: HeroState[] = ['a', 'b', 'c', 'b'];
  private cycleIdx = signal(0);

  state = computed<HeroState>(() => this.cycle[this.cycleIdx() % this.cycle.length]);
  paused = signal(false);

  /**
   * Historial de slots recientemente activos (más nuevo primero, max 3).
   * Pre-seed coherente con el estado inicial 'a' (left activo).
   */
  private _slotHistory = signal<Slot[]>(['left', 'center', 'right']);

  private _stateToSlot(s: HeroState): Slot {
    return s === 'a' ? 'left' : s === 'b' ? 'center' : 'right';
  }

  /**
   * Posiciones visuales derivadas del historial:
   *   h[0] → 'near' (P1 — recién activo)
   *   h[1] → 'mid'  (P2 — antes activo)
   *   h[2] → 'far'  (P3 — hace dos ciclos)
   */
  positions = computed<Record<Slot, SlotPosition>>(() => {
    const h = this._slotHistory();
    const rankOf = (slot: Slot): SlotPosition => {
      if (h[0] === slot) return 'near';
      if (h[1] === slot) return 'mid';
      return 'far';
    };
    return {
      left:   rankOf('left'),
      center: rankOf('center'),
      right:  rankOf('right'),
    };
  });

  /**
   * Lema sincronizado con positions — Conecta→left, Rueda→center, Vuelve→right.
   * Comparte la misma jerarquía P1/P2/P3 que los teléfonos.
   */
  motto = computed(() => {
    const p = this.positions();
    return {
      conecta: p.left,
      rueda:   p.center,
      vuelve:  p.right,
    };
  });

  readonly screens: { left: PhoneScreen; center: PhoneScreen; right: PhoneScreen } = {
    left:   'explorar',
    center: 'sala-activa',
    right:  'perfil',
  };

  ngOnInit(): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    interval(4000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.paused()) this._advance();
      });
  }

  onAdvance(): void { this._advance(); }
  onPause(): void { this.paused.set(true); }
  onResume(): void { this.paused.set(false); }

  private _advance(): void {
    this.cycleIdx.update(i => (i + 1) % this.cycle.length);
    const justActivated = this._stateToSlot(this.state());
    this._slotHistory.update(h => {
      const without = h.filter(s => s !== justActivated);
      return [justActivated, ...without].slice(0, 3);
    });
  }
}

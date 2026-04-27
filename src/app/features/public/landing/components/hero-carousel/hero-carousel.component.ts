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

  positions = computed<{ left: SlotPosition; center: SlotPosition; right: SlotPosition }>(() => {
    switch (this.state()) {
      case 'a': return { left: 'far',  center: 'mid',  right: 'near' };
      case 'b': return { left: 'near', center: 'far',  right: 'mid'  };
      case 'c': return { left: 'mid',  center: 'near', right: 'far'  };
    }
  });

  motto = computed(() => ({
    conecta: this._wordRank(this.state(), 0),
    rueda:   this._wordRank(this.state(), 1),
    vuelve:  this._wordRank(this.state(), 2),
  }));

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
  }

  private _wordRank(s: HeroState, wordIdx: 0 | 1 | 2): 'near' | 'mid' | 'far' {
    const map: Record<HeroState, ['near' | 'mid' | 'far', 'near' | 'mid' | 'far', 'near' | 'mid' | 'far']> = {
      a: ['near', 'mid',  'far'],
      b: ['far',  'near', 'mid'],
      c: ['mid',  'far',  'near'],
    };
    return map[s][wordIdx];
  }
}

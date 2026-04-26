import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'n4-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="n4-skeleton" [style.width]="width()" [style.height]="height()"></div>
  `,
  styles: [`
    .n4-skeleton {
      background: linear-gradient(
        90deg,
        var(--n4-surface-card) 0%,
        var(--n4-surface-muted) 40%,
        var(--n4-surface-card) 80%
      );
      background-size: 300% 100%;
      animation: n4shimmer 1.6s ease-in-out infinite;
      border-radius: 6px;
    }
    @keyframes n4shimmer {
      0%   { background-position: 100% 0; }
      100% { background-position: -100% 0; }
    }
  `]
})
export class SkeletonComponent {
  width = input('100%');
  height = input('16px');
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkeletonComponent } from './skeleton.component';

@Component({
  selector: 'n4-sala-card-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonComponent],
  template: `
    <div class="n4-sala-skeleton">
      <div class="n4-sala-skeleton__header">
        <n4-skeleton width="80px" height="22px" />
        <n4-skeleton width="50px" height="14px" />
      </div>
      <n4-skeleton width="70%" height="22px" />
      <n4-skeleton width="90%" height="14px" />
      <div class="n4-sala-skeleton__footer">
        <n4-skeleton width="60px" height="14px" />
      </div>
    </div>
  `,
  styles: [`
    .n4-sala-skeleton {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 24px;
      background: var(--n4-surface-card);
      border: 0.5px solid var(--n4-border);
      border-radius: var(--n4-radius-primary);
    }
    .n4-sala-skeleton__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .n4-sala-skeleton__footer { margin-top: 4px; }
  `]
})
export class SalaCardSkeletonComponent {}

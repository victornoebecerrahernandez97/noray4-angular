import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '../../shared/components/nav/nav.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, NavComponent],
  template: `
    <app-nav />
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`:host { display: block; background: var(--n4-background); }`]
})
export class PublicLayoutComponent {}

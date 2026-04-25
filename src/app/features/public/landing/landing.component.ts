import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'n4-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p style="color:white;padding:2rem">Landing — En construcción</p>`
})
export class LandingComponent {}

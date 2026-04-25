import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'n4-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p style="color:white;padding:2rem">Admin Dashboard — En construcción</p>`
})
export class DashboardComponent {}

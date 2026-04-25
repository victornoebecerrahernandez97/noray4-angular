import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sala-public',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p style="color:white;padding:2rem">Sala pública — En construcción</p>`
})
export class SalaPublicComponent {}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type PhoneScreen = 'sala-activa' | 'explorar' | 'perfil';

@Component({
  selector: 'n4-phone-mockup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="phone">
      <div class="phone__notch"></div>
      <div class="phone__screen">
        @switch (screen()) {
          @case ('sala-activa') {
            <div class="screen screen--map">
              <div class="map-bg"></div>
              <div class="map-route"></div>
              <div class="rider rider--1"></div>
              <div class="rider rider--2"></div>
              <div class="rider rider--3"></div>
              <div class="screen__panel">
                <div class="panel-grip"></div>
                <div class="panel-row">
                  <span class="pill pill--live">
                    <span class="dot"></span>EN CURSO
                  </span>
                  <span class="panel-time">14:32</span>
                </div>
                <div class="panel-title">Ruta del Cañón</div>
                <div class="panel-meta">
                  <span>· 4 riders</span>
                  <span>· 28 km</span>
                </div>
              </div>
            </div>
          }
          @case ('explorar') {
            <div class="screen screen--list">
              <div class="screen__head">
                <div class="head-title">Salidas</div>
                <div class="head-search"></div>
              </div>
              <div class="screen__chips">
                <span class="chip chip--active">Activas</span>
                <span class="chip">Hoy</span>
                <span class="chip">Mañana</span>
              </div>
              <div class="card-list">
                <div class="card">
                  <div class="card-pill"></div>
                  <div class="card-line card-line--lg"></div>
                  <div class="card-line"></div>
                </div>
                <div class="card">
                  <div class="card-pill"></div>
                  <div class="card-line card-line--lg"></div>
                  <div class="card-line"></div>
                </div>
                <div class="card">
                  <div class="card-pill"></div>
                  <div class="card-line card-line--lg"></div>
                  <div class="card-line"></div>
                </div>
              </div>
              <div class="fab"></div>
            </div>
          }
          @case ('perfil') {
            <div class="screen screen--profile">
              <div class="profile-cover"></div>
              <div class="profile-avatar"></div>
              <div class="profile-name"></div>
              <div class="profile-handle"></div>
              <div class="profile-stats">
                <div class="stat"><div class="stat-num"></div><div class="stat-lbl"></div></div>
                <div class="stat"><div class="stat-num"></div><div class="stat-lbl"></div></div>
                <div class="stat"><div class="stat-num"></div><div class="stat-lbl"></div></div>
              </div>
              <div class="profile-section">
                <div class="sec-title"></div>
                <div class="sec-row"></div>
                <div class="sec-row"></div>
              </div>
            </div>
          }
        }
      </div>
      <div class="phone__home"></div>
    </div>
  `,
  styleUrl: './phone-mockup.component.scss'
})
export class PhoneMockupComponent {
  screen = input.required<PhoneScreen>();
}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Sala } from '../../../core/models/sala.model';

const FEATURES = [
  {
    id: 'ptt',
    icon: '🎙',
    title: 'Voz PTT tipo radio',
    desc: 'Canal de voz push-to-talk para coordinar en movimiento. Sin manos libres necesario.',
  },
  {
    id: 'map',
    icon: '🗺',
    title: 'Mapa en tiempo real',
    desc: 'Todos los riders de tu tripulación en un solo mapa. Sabes siempre dónde está cada quien.',
  },
  {
    id: 'log',
    icon: '📍',
    title: 'Registro de cada salida',
    desc: 'GPX, fotos, participantes y el chat de la ruta guardados automáticamente al cerrar.',
  },
  {
    id: 'qr',
    icon: '⚡',
    title: 'Invitación por QR',
    desc: 'Comparte la salida con un QR. Quien lo escanea entra en segundos, con o sin cuenta.',
  },
];

@Component({
  selector: 'app-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit, AfterViewInit {
  private api = inject(ApiService);

  features = FEATURES;
  salas = signal<Sala[]>([]);
  loadingSalas = signal(true);

  ngOnInit(): void {
    this.api.getSalas(0, 3).subscribe({
      next: (data) => {
        this.salas.set(data.filter(s => s.status === 'active').slice(0, 3));
        this.loadingSalas.set(false);
      },
      error: () => {
        this.loadingSalas.set(false);
      },
    });
  }

  ngAfterViewInit(): void {
    this._initRoutePaths();
    this._initScrollAnimations();
    this._initHeroAnimation();
  }

  private _initRoutePaths(): void {
    const paths = document.querySelectorAll<SVGPathElement>('.route-path');
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });
  }

  private _initScrollAnimations(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.feature-card, .sala-card, .download__inner')
      .forEach((el) => observer.observe(el));
  }

  private _initHeroAnimation(): void {
    const lines = document.querySelectorAll('.hero__line');
    lines.forEach((el, i) => {
      (el as HTMLElement).style.animationDelay = `${i * 120}ms`;
      el.classList.add('hero__line--animate');
    });
  }
}

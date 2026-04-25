# Noray4 Web — Claude Brain

## Identity
- **Stack target:** Angular 21+ (standalone, signals, OnPush) + Tailwind CSS
- **Deploy:** Vercel (static export)
- **Dual role:**
  - **Rutas públicas** → landing, explorar salidas públicas sin login (modo invitado)
  - **`/admin`** → panel administrativo (moderación, métricas, gestión de riders/salidas)

> Este archivo hereda del `CLAUDE.md` raíz de `noray4/`. El glosario oficial de UI, design tokens y filosofía Functional Stoicism aplican aquí SIN excepción.

---

## Flujo de trabajo obligatorio
1. **Plan Mode** (`Shift+Tab ×2`) antes de codificar cualquier feature nueva
2. **context7** → SIEMPRE antes de tocar Angular, signals, RxJS, Tailwind o cualquier librería externa (APIs cambian rápido)
3. **sequential-thinking** → para decisiones de routing, estructura de stores, o bugs multi-componente
4. Ejecutar `ng build` y `ng test` antes de considerar cualquier tarea terminada

---

## Arquitectura

```
noray4-angular/
├── src/
│   ├── main.ts
│   ├── app/
│   │   ├── app.config.ts          ← provideRouter, provideHttpClient, interceptors
│   │   ├── app.routes.ts          ← rutas públicas + lazy admin
│   │   ├── app.component.ts
│   │   ├── core/
│   │   │   ├── services/          ← ApiClient, AuthService, ThemeService
│   │   │   ├── guards/            ← adminGuard, guestGuard
│   │   │   ├── interceptors/      ← authInterceptor, errorInterceptor
│   │   │   └── tokens/            ← InjectionTokens (API_URL, etc.)
│   │   ├── shared/
│   │   │   ├── ui/                ← n4-button, n4-card, n4-pill, n4-hairline…
│   │   │   └── pipes/
│   │   ├── layouts/
│   │   │   ├── public-layout/     ← nav pública + footer editorial
│   │   │   └── admin-layout/      ← sidebar admin + topbar con user
│   │   └── features/
│   │       ├── public/            ← SIN auth
│   │       │   ├── landing/
│   │       │   ├── explorar/      ← lista pública de salidas abiertas
│   │       │   ├── salida-detalle/ ← vista read-only de una salida
│   │       │   └── sobre/
│   │       └── admin/             ← lazy-loaded, detrás de adminGuard
│   │           ├── dashboard/
│   │           ├── riders/        ← listar, banear, verificar
│   │           ├── salidas/       ← moderar, cerrar forzosas
│   │           ├── moderacion/    ← reportes de tripulación
│   │           ├── metricas/      ← uso MQTT, retención, mapa de calor
│   │           └── config/
│   ├── styles/
│   │   ├── tokens.css             ← CSS variables del Monolith Framework
│   │   ├── tailwind.css
│   │   └── styles.css
│   └── assets/
├── tailwind.config.js
├── angular.json
├── vercel.json
└── .env.example
```

---

## Routing

### Estrategia
- Rutas públicas → componentes estándar (no lazy) para TTI rápido
- `/admin/**` → **lazy loading obligatorio** con `loadChildren`
- `adminGuard` bloquea `/admin/**` si el JWT no tiene `role: "admin"` en el claim

### `app.routes.ts` (patrón)
```typescript
export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/public/landing/landing.component').then(m => m.LandingComponent) },
      { path: 'explorar', loadComponent: () => import('./features/public/explorar/explorar.component').then(m => m.ExplorarComponent) },
      { path: 'salida/:id', loadComponent: () => import('./features/public/salida-detalle/salida-detalle.component').then(m => m.SalidaDetalleComponent) },
      { path: 'sobre', loadComponent: () => import('./features/public/sobre/sobre.component').then(m => m.SobreComponent) },
    ]
  },
  {
    path: 'admin',
    canMatch: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  { path: '**', redirectTo: '' }
];
```

---

## Convenciones Angular

### Componentes
- **Siempre** `standalone: true` — sin NgModules
- **Siempre** `changeDetection: ChangeDetectionStrategy.OnPush`
- Selector: `n4-{nombre-kebab}` (ej: `n4-button`, `n4-salida-card`)
- Archivos: `{nombre}.component.ts`, `{nombre}.component.html`, `{nombre}.component.css`
- Máximo 200 líneas por archivo `.ts` — si crece, extraer a sub-componentes

### Estado reactivo
- **Signals** por defecto (`signal()`, `computed()`, `effect()`) — no RxJS salvo para HTTP/streams
- **`input()` / `output()`** de Angular 17.1+ en lugar de decoradores `@Input` / `@Output`
- **`model()`** para two-way binding cuando haga falta
- **`toSignal()`** para convertir observables a signals en la vista
- `resource()` / `httpResource()` para data fetching en componentes feature (Angular 19+)

### Inyección de dependencias
- `inject(Service)` en vez de constructor injection
- Services con `providedIn: 'root'` a menos que sean scoped a una ruta

### Template
- Nuevo control flow: `@if / @for / @switch` — nunca `*ngIf` ni `*ngFor`
- `@defer` para bloques pesados (mapas, gráficas)
- `track` obligatorio en `@for`

---

## Autenticación

- **Token** en memoria (signal) + refresh en `localStorage` cifrado
- `authInterceptor` añade `Authorization: Bearer <token>` a todas las llamadas `/api/v1/*`
- `adminGuard`:
  ```typescript
  export const adminGuard: CanMatchFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.isAdmin()) return true;
    router.navigateByUrl('/');
    return false;
  };
  ```
- Endpoint de login admin: `POST /api/v1/auth/admin-login` → JWT con `role: "admin"`

---

## API Client

### Base URL
- Dev: `http://localhost:8000/api/v1`
- Prod: `https://api.noray4.com/api/v1`
- Variable de entorno via `environment.ts` (no `.env` — Angular usa file replacement)

### Patrón de servicio
```typescript
@Injectable({ providedIn: 'root' })
export class SalidasService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  list = httpResource<Salida[]>(() => `${this.apiUrl}/salidas?visibilidad=publica`);

  obtener(id: string) {
    return this.http.get<Salida>(`${this.apiUrl}/salidas/${id}`);
  }
}
```

### Tipos compartidos
- Generar tipos TS desde el OpenAPI de FastAPI con `openapi-typescript` → `src/app/core/api-types.ts`
- Script en `package.json`: `"gen:api": "openapi-typescript http://localhost:8000/openapi.json -o src/app/core/api-types.ts"`

---

## Styling

### Tailwind
- Configurar en `tailwind.config.js` para leer CSS variables del Monolith Framework
- **Nunca** hardcodear hex — siempre via tokens:
  ```html
  <div class="bg-[color:var(--surface-card)] border-[color:var(--border)] border-[0.5px] rounded-xl">
  ```

### `tokens.css` (ejemplo)
```css
:root {
  --background: #FAFAF8;
  --surface-card: #F2F2EF;
  --surface-muted: #E8E8E4;
  --border: #D4D4D0;
  --text-primary: #111110;
  --text-secondary: #6B6B68;
  --text-muted: #A8A8A4;
}
:root[data-theme="dark"] {
  --background: #131312;
  --surface-card: #20201E;
  --surface-muted: #2A2A29;
  --border: #474747;
  --text-primary: #FFFFFF;
  --text-secondary: #C7C7C2;
  --text-muted: #919191;
}
```

### Reglas visuales (heredadas)
- Hairlines SIEMPRE 0.5px — en Tailwind: `border-[0.5px]`
- Radius máximo: `rounded-xl` (12px), excepto pills `rounded-full`
- Sin shadows — usar tonal layering entre `surface-*`
- Sin iconos con color — Material Symbols outlined, peso 400, color `currentColor`
- Left-align siempre — `text-left` es la norma, `text-center` es la excepción

---

## Componentes compartidos (a construir primero)

| Componente      | Selector          | Props clave                          |
|-----------------|-------------------|--------------------------------------|
| Botón primario  | `n4-button`       | `variant`, `size`, `loading`         |
| Card            | `n4-card`         | `padding`, `interactive`             |
| Pill / Chip     | `n4-pill`         | `status`, `live`                     |
| Hairline        | `n4-hairline`     | `orientation`                        |
| Input           | `n4-input`        | `label`, `error`, `value` (model())  |
| Avatar          | `n4-avatar`       | `src`, `fallback`, `size`            |
| Empty state     | `n4-empty`        | `icon`, `title`, `cta`               |
| Status dot live | `n4-live-dot`     | — (animate-pulse rojo)               |

---

## Rutas públicas — contenido esperado

- `/` → landing con CTA "Convocar salida" (deep link a la app Flutter) + hero editorial
- `/explorar` → grid de **salidas públicas** en curso y próximas (datos reales del backend, sin auth)
- `/salida/:id` → vista pública read-only de una salida (sin chat ni PTT, solo info)
- `/sobre` → sobre Noray4, filosofía, tripulaciones destacadas

---

## Panel admin — features mínimos

| Ruta                   | Función                                            |
|------------------------|----------------------------------------------------|
| `/admin`               | Dashboard: salidas activas, riders online, MQTT    |
| `/admin/riders`        | Tabla con búsqueda, filtros, acciones (banear)     |
| `/admin/salidas`       | Listar, cerrar forzosas, ver mensajes reportados   |
| `/admin/moderacion`    | Cola de reportes pendientes                        |
| `/admin/metricas`      | Gráficas de uso (sesiones MQTT, retención)         |
| `/admin/config`        | Feature flags, modo mantenimiento                  |

---

## Build Commands

```bash
# Dev
ng serve --open

# Build producción (Vercel)
ng build --configuration production

# Test
ng test --watch=false --browsers=ChromeHeadless

# Generar componente standalone
ng generate component features/public/explorar --standalone --change-detection OnPush

# Regenerar tipos desde OpenAPI
npm run gen:api

# Deploy preview (Vercel)
vercel
```

---

## Reglas absolutas

- **NUNCA** crear componentes con NgModules — solo standalone
- **NUNCA** usar `*ngIf`, `*ngFor`, `ng-container *ngIf` — solo `@if`, `@for`
- **NUNCA** usar `@Input()` decorator — solo `input()` signal-based
- **NUNCA** usar `console.log` en código commiteado — usar `LoggerService`
- **NUNCA** llamar a la API directamente desde un componente — siempre via service
- **NUNCA** poner lógica de negocio en el template — extraer a `computed()` o al service
- **SIEMPRE** OnPush + signals → cualquier componente que no lo use es un bug
- **SIEMPRE** usar el glosario oficial: "Salida", "Convocar", "Registro", "Tripulación"
- Máximo 200 líneas por `.ts` — si hay que partir, extraer a sub-componentes o a un service

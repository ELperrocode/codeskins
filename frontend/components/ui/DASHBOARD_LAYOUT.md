# Dashboard Layout - Refactor

## Overview

El dashboard ha sido completamente refactorizado para tener un diseño consistente y moderno, separando claramente el navbar global del navbar específico del dashboard.

## Componentes Principales

### 1. DashboardLayout (`frontend/app/[lang]/dashboard/layout.tsx`)
- **Propósito**: Layout principal del dashboard que orquesta sidebar y navbar
- **Características**:
  - Maneja el estado del sidebar (abierto/cerrado)
  - Responsive design
  - Autenticación automática
  - Loading states

### 2. DashboardSidebar (`frontend/components/ui/DashboardSidebar.tsx`)
- **Propósito**: Navegación lateral del dashboard
- **Características**:
  - Navegación basada en roles (admin/customer)
  - Diseño responsive (colapsa en móvil)
  - Overlay en móvil
  - Animaciones suaves
  - Información del usuario

### 3. DashboardNavbar (`frontend/components/ui/DashboardNavbar.tsx`)
- **Propósito**: Barra superior específica del dashboard
- **Características**:
  - Toggle del sidebar en móvil
  - Buscador (opcional)
  - Notificaciones
  - Menú de usuario con dropdown
  - Breadcrumb dinámico

## Estructura del Layout

```
┌─────────────────────────────────────────────────────────┐
│                    DashboardNavbar                      │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│ Dashboard   │                                           │
│ Sidebar     │              Main Content                 │
│             │                                           │
│             │                                           │
│             │                                           │
└─────────────┴───────────────────────────────────────────┘
```

## Responsive Behavior

### Desktop (lg+)
- Sidebar fijo a la izquierda
- Navbar fijo arriba
- Contenido principal con padding adecuado

### Tablet (md)
- Sidebar colapsable
- Navbar con toggle button
- Overlay para cerrar sidebar

### Mobile (sm)
- Sidebar completamente oculto por defecto
- Navbar con toggle button prominente
- Overlay oscuro al abrir sidebar

## Características Técnicas

### Estado del Sidebar
```typescript
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
```

### Responsive Breakpoints
- `lg:` (1024px+) - Sidebar siempre visible
- `md:` (768px+) - Sidebar colapsable
- `sm:` (640px+) - Sidebar oculto por defecto

### Z-Index Hierarchy
- Sidebar: `z-50`
- Navbar: `z-40`
- Overlay: `z-40`

## Separación del Navbar Global

El navbar global (`NavbarWrapper`) ahora:
- **NO se muestra** en páginas del dashboard (`/dashboard/*`)
- Se muestra en todas las demás páginas
- Mantiene su funcionalidad original para landing y auth pages

## Beneficios del Refactor

1. **Consistencia Visual**: Sidebar y navbar del dashboard son parte del mismo sistema
2. **Mejor UX**: Navegación más intuitiva y moderna
3. **Responsive**: Funciona perfectamente en todos los dispositivos
4. **Mantenibilidad**: Componentes separados y reutilizables
5. **Performance**: No hay conflictos entre navbars

## Uso

El layout se aplica automáticamente a todas las páginas bajo `/dashboard/*`. No se requiere configuración adicional.

### Ejemplo de página del dashboard:
```tsx
export default function MyDashboardPage() {
  return (
    <div className="space-y-6">
      <h1>Mi Dashboard</h1>
      {/* Contenido de la página */}
    </div>
  );
}
```

## Personalización

### Colores
Los colores principales están definidos en Tailwind:
- Primary: `yellow-400` to `yellow-500`
- Secondary: `gray-50` to `gray-100`
- Accent: `blue-500` to `purple-600`

### Espaciado
- Padding del contenido: `p-4 lg:p-8`
- Gap entre elementos: `space-y-8`
- Ancho máximo: `max-w-7xl`

## Troubleshooting

### Sidebar no se abre en móvil
- Verificar que el toggle button esté funcionando
- Revisar z-index del overlay

### Navbar global aparece en dashboard
- Verificar que `NavbarWrapper` tenga la condición correcta para dashboard pages

### Contenido se superpone
- Asegurar que el contenido tenga `overflow-auto`
- Verificar padding del main content 
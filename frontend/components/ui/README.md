# UI Component Library - CodeSkins

## 🎨 **Librería de Componentes**

Este proyecto utiliza **shadcn/ui** + **Aceternity UI** como librerías principales de componentes.

### **Stack Tecnológico:**

- **shadcn/ui** - Librería de componentes reutilizables
- **Aceternity UI** - Componentes animados y modernos
- **Radix UI** - Componentes primitivos accesibles
- **TailwindCSS** - Framework de estilos
- **Framer Motion** - Animaciones fluidas
- **class-variance-authority** - Sistema de variantes
- **@tabler/icons-react** - Iconos modernos

### **Componentes Disponibles:**

#### **Aceternity UI (Nuevos):**
- `BackgroundGradient` - Fondos con gradientes animados
- `BackgroundBeams` - Efectos de haz de luz interactivos
- `FloatingNavbar` - Barra de navegación flotante con animaciones

#### **Básicos (shadcn/ui):**
- `Button` - Botones con variantes (default, outline, ghost, etc.)
- `Card` - Tarjetas con header, content y footer
- `Input` - Campos de entrada
- `Label` - Etiquetas para formularios
- `Select` - Selectores desplegables
- `Badge` - Badges y etiquetas

#### **Layout:**
- `Header` - Encabezado de la aplicación
- `CartIcon` - Icono del carrito con contador

#### **Marketplace:**
- `TemplateCard` - Tarjeta de template
- `TemplateCarousel` - Carrusel de templates

### **Uso de Aceternity UI:**

```tsx
import { BackgroundGradient } from '../components/ui/aceternity/background-gradient'
import { BackgroundBeams } from '../components/ui/aceternity/background-beams'
import { FloatingNavbar } from '../components/ui/aceternity/floating-navbar'

// Ejemplo de uso
<div className="min-h-screen relative overflow-hidden">
  <BackgroundGradient className="absolute inset-0" />
  <BackgroundBeams className="absolute inset-0" />
  <FloatingNavbar />
  {/* Tu contenido aquí */}
</div>
```

### **Uso de shadcn/ui:**

```tsx
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

// Ejemplo de uso
<Card>
  <CardHeader>
    <CardTitle>Mi Título</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Click me</Button>
  </CardContent>
</Card>
```

### **Variantes de Botones:**

```tsx
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### **Animaciones con Framer Motion:**

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  Contenido animado
</motion.div>
```

### **Configuración:**

Los componentes están configurados en:
- `tailwind.config.js` - Configuración de Tailwind
- `components/ui/` - Componentes shadcn/ui
- `components/ui/aceternity/` - Componentes Aceternity UI
- `lib/utils.ts` - Utilidades (cn function)

### **Personalización:**

Para personalizar los componentes:
- **shadcn/ui**: Edita los archivos en `components/ui/`
- **Aceternity UI**: Edita los archivos en `components/ui/aceternity/`

### **Iconos:**

Usamos **@tabler/icons-react** para iconos:

```tsx
import { IconShoppingCart, IconUser, IconSettings } from '@tabler/icons-react'

<IconShoppingCart className="w-4 h-4" />
```

### **Tema:**

El tema principal usa colores amarillos (`yellow-500`, `yellow-600`) como acentos principales.

### **Páginas Actualizadas:**

- ✅ **Login** - Diseño moderno con Aceternity UI
- ✅ **Register** - Diseño moderno con Aceternity UI  
- ✅ **Home** - Página principal con animaciones
- 🔄 **Dashboard** - En proceso de actualización
- 🔄 **Templates** - En proceso de actualización

### **Características de las Nuevas Páginas:**

- **Fondos animados** con gradientes y efectos de luz
- **Navbar flotante** con animaciones suaves
- **Formularios modernos** con iconos y validación
- **Animaciones fluidas** con Framer Motion
- **Diseño responsive** para todos los dispositivos
- **Efectos hover** y transiciones suaves 
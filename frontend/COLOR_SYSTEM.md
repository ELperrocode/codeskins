# 🎨 Sistema de Colores - CodeSkins

Este documento describe el sistema de colores personalizado implementado en CodeSkins usando variables CSS y clases de Tailwind.

## 📋 **Variables CSS Definidas**

### **Colores Primarios (Amarillo)**
```css
--color-primary-50: #fefce8   /* Muy claro */
--color-primary-100: #fef9c3
--color-primary-200: #fef08a
--color-primary-300: #fde047
--color-primary-400: #facc15   /* Principal */
--color-primary-500: #eab308
--color-primary-600: #ca8a04   /* Hover */
--color-primary-700: #a16207
--color-primary-800: #854d0e
--color-primary-900: #713f12
--color-primary-950: #422006   /* Muy oscuro */
```

### **Colores Neutrales**
```css
--color-neutral-50: #fafafa   /* Fondo muy claro */
--color-neutral-100: #f5f5f5
--color-neutral-200: #e5e5e5  /* Bordes */
--color-neutral-300: #d4d4d4
--color-neutral-400: #a3a3a3  /* Texto muted */
--color-neutral-500: #737373
--color-neutral-600: #525252  /* Texto secundario */
--color-neutral-700: #404040
--color-neutral-800: #262626
--color-neutral-900: #171717  /* Texto principal */
--color-neutral-950: #0a0a0a
```

### **Colores Semánticos**
```css
--color-success-500: #22c55e   /* Verde */
--color-error-500: #ef4444     /* Rojo */
--color-warning-500: #f59e0b   /* Naranja */
--color-info-500: #3b82f6      /* Azul */
```

## 🎯 **Clases de Tailwind Disponibles**

### **Colores Primarios**
```html
<!-- Fondo -->
<div class="bg-primary-50">Muy claro</div>
<div class="bg-primary-400">Principal</div>
<div class="bg-primary-600">Hover</div>

<!-- Texto -->
<p class="text-primary-500">Texto principal</p>
<p class="text-primary-600">Texto hover</p>

<!-- Bordes -->
<div class="border-primary-500">Borde principal</div>
```

### **Colores Neutrales**
```html
<!-- Fondo -->
<div class="bg-neutral-50">Fondo muy claro</div>
<div class="bg-neutral-100">Fondo claro</div>

<!-- Texto -->
<p class="text-neutral-900">Texto principal</p>
<p class="text-neutral-600">Texto secundario</p>
<p class="text-neutral-400">Texto muted</p>

<!-- Bordes -->
<div class="border-neutral-200">Borde claro</div>
```

### **Colores Semánticos**
```html
<!-- Éxito -->
<div class="bg-success-500 text-white">Éxito</div>

<!-- Error -->
<div class="bg-error-500 text-white">Error</div>

<!-- Advertencia -->
<div class="bg-warning-500 text-white">Advertencia</div>

<!-- Información -->
<div class="bg-info-500 text-white">Información</div>
```

### **Colores de Fondo**
```html
<div class="bg-background-primary">Fondo principal</div>
<div class="bg-background-secondary">Fondo secundario</div>
<div class="bg-background-tertiary">Fondo terciario</div>
<div class="bg-background-glass">Fondo glass</div>
```

### **Colores de Texto**
```html
<p class="text-text-primary">Texto principal</p>
<p class="text-text-secondary">Texto secundario</p>
<p class="text-text-tertiary">Texto terciario</p>
<p class="text-text-inverse">Texto inverso (blanco)</p>
<p class="text-text-muted">Texto muted</p>
```

### **Colores de Borde**
```html
<div class="border-border-primary">Borde principal</div>
<div class="border-border-secondary">Borde secundario</div>
<div class="border-border-focus">Borde focus</div>
```

### **Gradientes**
```html
<!-- Gradiente principal -->
<div class="bg-gradient-primary">Gradiente amarillo</div>

<!-- Gradiente hover -->
<div class="bg-gradient-primary-hover">Gradiente hover</div>

<!-- Gradiente oscuro -->
<div class="bg-gradient-dark">Gradiente oscuro</div>

<!-- Gradiente glass -->
<div class="bg-gradient-glass">Gradiente glass</div>
```

## 🔧 **Uso en Componentes**

### **Botones**
```html
<!-- Botón primario -->
<Button variant="default" className="bg-gradient-primary hover:bg-gradient-primary-hover">
  Botón Principal
</Button>

<!-- Botón secundario -->
<Button variant="secondary" className="bg-background-secondary text-text-primary">
  Botón Secundario
</Button>

<!-- Botón outline -->
<Button variant="outline" className="border-border-primary text-text-primary">
  Botón Outline
</Button>
```

### **Inputs**
```html
<Input 
  className="border-border-primary bg-background-primary text-text-primary placeholder:text-text-muted focus:border-primary-500"
  placeholder="Escribe aquí..."
/>
```

### **Cards**
```html
<Card className="border-border-primary bg-background-primary text-text-primary">
  <CardTitle className="text-text-primary">Título</CardTitle>
  <CardDescription className="text-text-secondary">Descripción</CardDescription>
</Card>
```

### **Badges**
```html
<Badge variant="default" className="bg-primary-500 text-text-inverse">
  Badge Principal
</Badge>

<Badge variant="secondary" className="bg-background-secondary text-text-secondary">
  Badge Secundario
</Badge>
```

## 🌙 **Modo Oscuro**

El sistema automáticamente cambia los colores en modo oscuro:

```css
.dark {
  --color-bg-primary: var(--color-neutral-900);
  --color-text-primary: var(--color-neutral-50);
  --color-border-primary: var(--color-neutral-700);
}
```

## ♿ **Accesibilidad**

### **Contraste Alto**
```css
@media (prefers-contrast: high) {
  :root {
    --color-primary-500: #000000;
    --color-text-primary: #000000;
  }
  
  .dark {
    --color-primary-500: #ffffff;
    --color-text-primary: #ffffff;
  }
}
```

### **Reducción de Movimiento**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 📱 **Responsive**

Los colores funcionan en todos los tamaños de pantalla y se adaptan automáticamente.

## 🎨 **Ejemplos de Uso**

### **Header**
```html
<header className="bg-background-primary border-b border-border-primary">
  <nav className="text-text-primary">
    <a href="#" className="text-primary-600 hover:text-primary-700">Inicio</a>
  </nav>
</header>
```

### **Card de Template**
```html
<Card className="bg-background-primary border-border-primary hover:shadow-lg">
  <CardTitle className="text-text-primary">{template.title}</CardTitle>
  <CardDescription className="text-text-secondary">{template.description}</CardDescription>
  <div className="text-primary-500 font-bold">${template.price}</div>
  <Button className="bg-gradient-primary hover:bg-gradient-primary-hover">
    Añadir al Carrito
  </Button>
</Card>
```

### **Formulario**
```html
<form className="space-y-4">
  <Input 
    className="border-border-primary bg-background-primary text-text-primary"
    placeholder="Email"
  />
  <Button type="submit" className="bg-gradient-primary hover:bg-gradient-primary-hover">
    Enviar
  </Button>
</form>
```

## 🔄 **Migración**

Para migrar de colores hardcodeados a este sistema:

**Antes:**
```html
<div className="bg-yellow-500 text-white">Contenido</div>
```

**Después:**
```html
<div className="bg-primary-500 text-text-inverse">Contenido</div>
```

**Antes:**
```html
<div className="bg-gray-100 text-gray-900">Contenido</div>
```

**Después:**
```html
<div className="bg-background-secondary text-text-primary">Contenido</div>
```

## 📝 **Notas Importantes**

1. **Siempre usa las clases semánticas** en lugar de colores hardcodeados
2. **Mantén consistencia** usando las mismas clases en componentes similares
3. **Prueba el contraste** para asegurar accesibilidad
4. **Usa el modo oscuro** para verificar que los colores funcionen correctamente
5. **Documenta cambios** en el sistema de colores

---

**¡El sistema de colores está diseñado para ser consistente, accesible y fácil de mantener!** 🎨 
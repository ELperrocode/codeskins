export const es = {
  auth: {
    login: {
      title: "Bienvenido de vuelta a CodeSkins",
      subtitle: "Inicia sesión en tu cuenta",
      username: "Nombre de usuario",
      password: "Contraseña",
      submit: "Iniciar sesión",
      loading: "Iniciando sesión...",
      error: "Nombre de usuario o contraseña inválidos",
      noAccount: "¿No tienes una cuenta?",
      signUp: "Regístrate"
    },
    register: {
      title: "Únete a CodeSkins",
      subtitle: "Crea tu cuenta para comenzar",
      email: "Correo electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      role: "Tipo de Cuenta",
      customer: "Cliente - Comprar plantillas",
      seller: "Vendedor - Vender plantillas",
      submit: "Crear cuenta",
      loading: "Creando cuenta...",
      error: "El registro falló. Por favor intenta de nuevo.",
      passwordMismatch: "Las contraseñas no coinciden",
      hasAccount: "¿Ya tienes una cuenta?",
      signIn: "Iniciar sesión"
    },
    logout: "Cerrar sesión"
  },
  dashboard: {
    title: "Bienvenido al Dashboard de CodeSkins",
    accountStatus: "Estado de la Cuenta",
    role: "Rol",
    memberSince: "Miembro desde",
    customer: {
      title: "Dashboard de Cliente",
      description: "Explora y compra plantillas web de nuestro marketplace.",
      features: [
        "Ver plantillas disponibles",
        "Comprar plantillas",
        "Descargar tus compras",
        "Gestionar tus pedidos"
      ]
    },
    seller: {
      title: "Dashboard de Vendedor",
      description: "Sube y gestiona tus plantillas web para vender.",
      features: [
        "Subir nuevas plantillas",
        "Gestionar tus listados",
        "Ver análisis de ventas",
        "Procesar pagos"
      ]
    },
    admin: {
      title: "Dashboard de Administrador",
      description: "Gestiona todo el marketplace de CodeSkins.",
      features: [
        "Gestionar usuarios",
        "Revisar plantillas",
        "Monitorear transacciones",
        "Configuración del sistema"
      ]
    }
  },
  errors: {
    generic: "Algo salió mal",
    network: "Error de red. Por favor intenta de nuevo.",
    validation: "Por favor verifica tu entrada e intenta de nuevo.",
    unauthorized: "No estás autorizado para realizar esta acción.",
    notFound: "El recurso solicitado no fue encontrado."
  },
  ui: {
    loading: "Cargando...",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    view: "Ver",
    back: "Atrás",
    next: "Siguiente",
    previous: "Anterior",
    close: "Cerrar",
    open: "Abrir",
    search: "Buscar",
    filter: "Filtrar",
    sort: "Ordenar",
    refresh: "Actualizar",
    download: "Descargar",
    upload: "Subir",
    select: "Seleccionar",
    required: "Requerido",
    optional: "Opcional"
  }
} as const; 
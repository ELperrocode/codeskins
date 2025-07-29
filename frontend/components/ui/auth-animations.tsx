'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AuthAnimationProps {
  children: ReactNode;
  className?: string;
}

// Animación para el contenedor principal
export const AuthContainer = ({ children, className = '' }: AuthAnimationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animación para el card de login/register
export const AuthCard = ({ children, className = '' }: AuthAnimationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        delay: 0.2, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animación para los campos de input
export const AuthInput = ({ children, className = '', delay = 0 }: AuthAnimationProps & { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: 0.3 + delay, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animación para el botón
export const AuthButton = ({ children, className = '', delay = 0 }: AuthAnimationProps & { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: 0.5 + delay, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animación para el enlace de navegación
export const AuthLink = ({ children, className = '', delay = 0 }: AuthAnimationProps & { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: 0.7 + delay, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animación para el icono del campo
export const AuthIcon = ({ children, className = '', delay = 0 }: AuthAnimationProps & { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: 0.1 + delay, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 200
      }}
      className={`text-text-inverse/60 ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Animación para el mensaje de error
export const AuthError = ({ children, className = '', delay = 0 }: AuthAnimationProps & { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: -10 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0, y: -10 }}
      transition={{ 
        duration: 0.4, 
        delay, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animación para el spinner de carga
export const AuthSpinner = ({ children, className = '', delay = 0 }: AuthAnimationProps & { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ 
        duration: 0.4, 
        delay, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 200
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animación para el título
export const AuthTitle = ({ children, className = '', delay = 0 }: AuthAnimationProps & { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.7, 
        delay: 0.2 + delay, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animación para la descripción
export const AuthDescription = ({ children, className = '', delay = 0 }: AuthAnimationProps & { delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: 0.3 + delay, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animación para el botón de toggle de contraseña
export const AuthToggleButton = ({ children, className = '', delay = 0 }: AuthAnimationProps & { delay?: number }) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        duration: 0.3, 
        delay, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 200
      }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// Animación para el fondo con partículas
export const AuthBackground = ({ children, className = '' }: AuthAnimationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 1.5, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}; 
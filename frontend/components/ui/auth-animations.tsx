'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AuthContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface AuthInputProps {
  children: React.ReactNode;
  delay?: number;
}

export const AuthInput: React.FC<AuthInputProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
};

interface AuthButtonProps {
  children: React.ReactNode;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

interface AuthLinkProps {
  children: React.ReactNode;
}

export const AuthLink: React.FC<AuthLinkProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

interface AuthIconProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthIcon: React.FC<AuthIconProps> = ({ children, className = '' }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

interface AuthErrorProps {
  children: React.ReactNode;
}

export const AuthError: React.FC<AuthErrorProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

interface AuthSpinnerProps {
  children: React.ReactNode;
}

export const AuthSpinner: React.FC<AuthSpinnerProps> = ({ children }) => {
  return <>{children}</>;
};

interface AuthTitleProps {
  children: React.ReactNode;
}

export const AuthTitle: React.FC<AuthTitleProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

interface AuthDescriptionProps {
  children: React.ReactNode;
}

export const AuthDescription: React.FC<AuthDescriptionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

interface AuthToggleButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export const AuthToggleButton: React.FC<AuthToggleButtonProps> = ({ children, onClick, className = '' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
};

interface AuthBackgroundProps {
  children: React.ReactNode;
}

export const AuthBackground: React.FC<AuthBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {children}
    </div>
  );
}; 
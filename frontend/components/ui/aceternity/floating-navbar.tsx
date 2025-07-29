"use client";
import { cn } from "../../../lib/utils";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconShoppingCart, IconUser, IconMenu2, IconX } from "@tabler/icons-react";

interface FloatingNavbarProps {
  className?: string;
  cartCount?: number;
  isAuthenticated?: boolean;
  onLoginClick?: () => void;
  onCartClick?: () => void;
  onMenuClick?: () => void;
}

export const FloatingNavbar = ({
  className,
  cartCount = 0,
  isAuthenticated = false,
  onLoginClick,
  onCartClick,
  onMenuClick,
}: FloatingNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={cn(
        "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
        className
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 bg-white/10 shadow-lg",
          isScrolled && "bg-white/20 border-white/30"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Logo */}
        <motion.div
          className="text-xl font-bold text-white"
          whileHover={{ scale: 1.1 }}
        >
          CodeSkins
        </motion.div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center gap-6 ml-8">
          <motion.a
            href="/templates"
            className="text-white/80 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Templates
          </motion.a>
          <motion.a
            href="/categories"
            className="text-white/80 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Categories
          </motion.a>
          <motion.a
            href="/about"
            className="text-white/80 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            About
          </motion.a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 ml-4">
          {/* Cart Button */}
          <motion.button
            onClick={onCartClick}
            className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconShoppingCart className="w-5 h-5 text-white" />
            {cartCount > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>

          {/* User Button */}
          <motion.button
            onClick={onLoginClick}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconUser className="w-5 h-5 text-white" />
          </motion.button>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconMenu2 className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </motion.div>
    </motion.nav>
  );
}; 
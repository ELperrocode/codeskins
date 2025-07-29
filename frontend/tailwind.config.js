/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': 'var(--color-primary-50)',
  				'100': 'var(--color-primary-100)',
  				'200': 'var(--color-primary-200)',
  				'300': 'var(--color-primary-300)',
  				'400': 'var(--color-primary-400)',
  				'500': 'var(--color-primary-500)',
  				'600': 'var(--color-primary-600)',
  				'700': 'var(--color-primary-700)',
  				'800': 'var(--color-primary-800)',
  				'900': 'var(--color-primary-900)',
  				'950': 'var(--color-primary-950)',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			neutral: {
  				'50': 'var(--color-neutral-50)',
  				'100': 'var(--color-neutral-100)',
  				'200': 'var(--color-neutral-200)',
  				'300': 'var(--color-neutral-300)',
  				'400': 'var(--color-neutral-400)',
  				'500': 'var(--color-neutral-500)',
  				'600': 'var(--color-neutral-600)',
  				'700': 'var(--color-neutral-700)',
  				'800': 'var(--color-neutral-800)',
  				'900': 'var(--color-neutral-900)',
  				'950': 'var(--color-neutral-950)'
  			},
  			success: {
  				'50': 'var(--color-success-50)',
  				'500': 'var(--color-success-500)',
  				'600': 'var(--color-success-600)',
  				'700': 'var(--color-success-700)'
  			},
  			error: {
  				'50': 'var(--color-error-50)',
  				'500': 'var(--color-error-500)',
  				'600': 'var(--color-error-600)',
  				'700': 'var(--color-error-700)'
  			},
  			warning: {
  				'50': 'var(--color-warning-50)',
  				'500': 'var(--color-warning-500)',
  				'600': 'var(--color-warning-600)',
  				'700': 'var(--color-warning-700)'
  			},
  			info: {
  				'50': 'var(--color-info-50)',
  				'500': 'var(--color-info-500)',
  				'600': 'var(--color-info-600)',
  				'700': 'var(--color-info-700)'
  			},
  			background: 'hsl(var(--background))',
  			text: {
  				primary: 'var(--color-text-primary)',
  				secondary: 'var(--color-text-secondary)',
  				tertiary: 'var(--color-text-tertiary)',
  				inverse: 'var(--color-text-inverse)',
  				muted: 'var(--color-text-muted)'
  			},
  			foreground: 'hsl(var(--foreground))',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			shadow: {
  				light: 'var(--color-shadow-light)',
  				medium: 'var(--color-shadow-medium)',
  				heavy: 'var(--color-shadow-heavy)'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		backgroundImage: {
  			'gradient-primary': 'var(--gradient-primary)',
  			'gradient-primary-hover': 'var(--gradient-primary-hover)',
  			'gradient-dark': 'var(--gradient-dark)',
  			'gradient-glass': 'var(--gradient-glass)'
  		},
  		spacing: {
  			xs: 'var(--spacing-xs)',
  			sm: 'var(--spacing-sm)',
  			md: 'var(--spacing-md)',
  			lg: 'var(--spacing-lg)',
  			xl: 'var(--spacing-xl)',
  			'2xl': 'var(--spacing-2xl)',
  			'3xl': 'var(--spacing-3xl)'
  		},
  		borderRadius: {
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)',
  			xl: 'var(--radius-xl)',
  			full: 'var(--radius-full)'
  		},
  		transitionDuration: {
  			fast: 'var(--transition-fast)',
  			normal: 'var(--transition-normal)',
  			slow: 'var(--transition-slow)'
  		},
  		zIndex: {
  			dropdown: 'var(--z-dropdown)',
  			sticky: 'var(--z-sticky)',
  			fixed: 'var(--z-fixed)',
  			'modal-backdrop': 'var(--z-modal-backdrop)',
  			modal: 'var(--z-modal)',
  			popover: 'var(--z-popover)',
  			tooltip: 'var(--z-tooltip)'
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			]
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} 
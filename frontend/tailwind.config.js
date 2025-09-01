/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./src/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  // Safelist important responsive classes to prevent purging
  safelist: [
    // Base responsive classes
    'sm:text-base',
    'sm:text-sm', 
    'sm:px-4',
    'sm:py-2',
    'sm:px-6',
    'sm:space-y-2',
    'sm:mb-8',
    'sm:py-6',
    'lg:hidden',
    'lg:block',
    'lg:grid-cols-2',
    'lg:text-base',
    'lg:py-8',
    'lg:px-6',
    'xl:px-8',
    'md:flex',
    'md:hidden',
    // Critical layout classes
    'overflow-x-hidden',
    'max-w-full',
    'w-full',
    'min-h-screen',
    'container-responsive',
    'table-responsive',
    // Mobile-specific classes
    'sm:text-xs',
    'sm:h-11',
    'sm:mb-8',
    'md:block',
    'lg:py-8',
    // Card and table responsive classes
    'border-collapse',
    'min-w-[1000px]',
    'max-w-[1400px]',
    'grid-cols-1',
    'space-y-4',
    'space-y-3',
    // Button and form responsive classes
    'h-10',
    'h-11',
    'w-16',
    'h-8',
    'text-xs',
    'justify-start',
    'justify-between',
    'items-center',
    'flex-1',
    'min-w-0'
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
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
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
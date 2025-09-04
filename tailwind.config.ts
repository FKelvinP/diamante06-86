import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				diamond: {
					DEFAULT: 'hsl(var(--diamond))',
					light: 'hsl(var(--diamond-light))',
					dark: 'hsl(var(--diamond-dark))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'gradient-move': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				'float-slow': {
					'0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
					'33%': { transform: 'translate(30px, -30px) scale(1.1)' },
					'66%': { transform: 'translate(-20px, 20px) scale(0.9)' }
				},
				'float-reverse': {
					'0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
					'33%': { transform: 'translate(-30px, 30px) rotate(120deg)' },
					'66%': { transform: 'translate(20px, -20px) rotate(240deg)' }
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.05)' }
				},
				'wave-motion': {
					'0%': { 
						transform: 'translateX(-100%) rotate(0deg)',
						borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
					},
					'25%': { 
						transform: 'translateX(-50%) rotate(90deg)',
						borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%'
					},
					'50%': { 
						transform: 'translateX(0%) rotate(180deg)',
						borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%'
					},
					'75%': { 
						transform: 'translateX(50%) rotate(270deg)',
						borderRadius: '70% 30% 40% 60% / 70% 40% 60% 30%'
					},
					'100%': { 
						transform: 'translateX(100%) rotate(360deg)',
						borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
					}
				},
				'morph-blob': {
					'0%, 100%': { 
						borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
						transform: 'rotate(0deg) scale(1)'
					},
					'20%': { 
						borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
						transform: 'rotate(72deg) scale(1.1)'
					},
					'40%': { 
						borderRadius: '50% 60% 30% 60% / 30% 60% 70% 40%',
						transform: 'rotate(144deg) scale(0.9)'
					},
					'60%': { 
						borderRadius: '60% 40% 60% 40% / 70% 30% 50% 60%',
						transform: 'rotate(216deg) scale(1.2)'
					},
					'80%': { 
						borderRadius: '40% 70% 40% 50% / 40% 50% 60% 70%',
						transform: 'rotate(288deg) scale(0.8)'
					}
				},
				'spiral-in': {
					'0%': { 
						transform: 'rotate(0deg) scale(0) translateX(200px)',
						opacity: '0'
					},
					'50%': { 
						transform: 'rotate(180deg) scale(0.5) translateX(100px)',
						opacity: '0.7'
					},
					'100%': { 
						transform: 'rotate(360deg) scale(1) translateX(0px)',
						opacity: '1'
					}
				},
				'fluid-wave': {
					'0%': { 
						clipPath: 'ellipse(40% 60% at 50% 50%)',
						transform: 'rotate(0deg)'
					},
					'25%': { 
						clipPath: 'ellipse(60% 40% at 30% 70%)',
						transform: 'rotate(90deg)'
					},
					'50%': { 
						clipPath: 'ellipse(80% 50% at 70% 30%)',
						transform: 'rotate(180deg)'
					},
					'75%': { 
						clipPath: 'ellipse(50% 80% at 20% 60%)',
						transform: 'rotate(270deg)'
					},
					'100%': { 
						clipPath: 'ellipse(40% 60% at 50% 50%)',
						transform: 'rotate(360deg)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'gradient-move': 'gradient-move 8s ease-in-out infinite',
				'float-slow': 'float-slow 20s ease-in-out infinite',
				'float-reverse': 'float-reverse 25s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
				'wave-motion': 'wave-motion 15s linear infinite',
				'morph-blob': 'morph-blob 12s ease-in-out infinite',
				'spiral-in': 'spiral-in 8s ease-out infinite',
				'fluid-wave': 'fluid-wave 18s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-diamond': 'var(--gradient-diamond)',
				'gradient-hero': 'var(--gradient-hero)'
			},
			boxShadow: {
				'elegant': 'var(--shadow-elegant)',
				'card': 'var(--shadow-card)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

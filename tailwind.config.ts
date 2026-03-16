import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				cosmos: {
					black: '#0a0a0f',
					navy: '#0d1b2a',
					midnight: '#1b2838',
					charcoal: '#141820'
				},
				astro: {
					indigo: '#4f46e5',
					cyan: '#22d3ee',
					purple: '#a855f7',
					lavender: '#c4b5fd',
					orange: '#f97316',
					gold: '#fbbf24',
					cream: '#f5f0e8',
					ember: '#e85d26'
				},
				physics: {
					blue: 'rgb(var(--physics-blue) / <alpha-value>)',
					dark: 'rgb(var(--physics-dark) / <alpha-value>)',
					light: 'rgb(var(--physics-light) / <alpha-value>)',
					accent: 'rgb(var(--physics-accent) / <alpha-value>)'
				},
				sps: {
					navy: '#0d1b2a',
					navyLight: '#1b2838',
					navyDark: '#060e18',
					red: '#CE1126',
					redLight: '#E63946',
					redDark: '#9B0A1A',
					cream: '#f5f0e8',
					muted: '#8892A4'
				}
			},
			fontFamily: {
				display: ['Space Grotesk', 'sans-serif'],
				'display-hero': ['Anton', 'Impact', 'sans-serif'],
				mono: ['JetBrains Mono', 'Fira Mono', 'monospace'],
				body: ['Inter', 'system-ui', 'sans-serif']
			},
			animation: {
				'star-drift': 'star-drift 120s linear infinite',
				'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
				grain: 'grain 0.5s steps(10) infinite',
				'scan-line': 'scan-line 2s ease-in-out',
				'float': 'float 6s ease-in-out infinite',
				'drift': 'drift 20s ease-in-out infinite',
				'nebula-drift': 'nebula-drift 30s ease-in-out infinite',
				'nebula-morph': 'nebula-morph 20s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
				'hud-scan': 'hud-scan 4s linear infinite',
				'bracket-pulse': 'bracket-pulse 2s ease-in-out infinite',
				'orbit-draw': 'orbit-draw 2s ease-in-out infinite',
				'reveal-up': 'reveal-up 0.6s ease-out forwards',
				'particle-float': 'particle-float 15s linear infinite',
				'concentric-rotate': 'concentric-rotate 90s linear infinite',
				'radar-sweep': 'radar-sweep 20s linear infinite',
				'fade-in-up': 'fade-in-up 0.8s ease-out forwards'
			},
			keyframes: {
				'star-drift': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(-100px)' }
				},
				'glow-pulse': {
					'0%, 100%': { opacity: '0.4' },
					'50%': { opacity: '1' }
				},
				grain: {
					'0%, 100%': { transform: 'translate(0, 0)' },
					'10%': { transform: 'translate(-2px, -3px)' },
					'20%': { transform: 'translate(-4px, 2px)' },
					'30%': { transform: 'translate(2px, -5px)' },
					'40%': { transform: 'translate(-3px, 4px)' },
					'50%': { transform: 'translate(-4px, 3px)' },
					'60%': { transform: 'translate(3px, -1px)' },
					'70%': { transform: 'translate(1px, 4px)' },
					'80%': { transform: 'translate(2px, -3px)' },
					'90%': { transform: 'translate(-3px, 2px)' }
				},
				'scan-line': {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(100%)' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				drift: {
					'0%, 100%': { transform: 'translate(0, 0)' },
					'25%': { transform: 'translate(10px, -5px)' },
					'50%': { transform: 'translate(-5px, 10px)' },
					'75%': { transform: 'translate(-10px, -5px)' }
				},
				'nebula-drift': {
					'0%': { transform: 'translate(0, 0) scale(1)' },
					'33%': { transform: 'translate(30px, -20px) scale(1.05)' },
					'66%': { transform: 'translate(-20px, 15px) scale(0.95)' },
					'100%': { transform: 'translate(0, 0) scale(1)' }
				},
				'nebula-morph': {
					'0%, 100%': { borderRadius: '60% 40% 55% 45% / 55% 45% 60% 40%' },
					'25%': { borderRadius: '45% 55% 40% 60% / 60% 40% 55% 45%' },
					'50%': { borderRadius: '55% 45% 60% 40% / 40% 60% 45% 55%' },
					'75%': { borderRadius: '40% 60% 45% 55% / 55% 45% 40% 60%' }
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '0.4', boxShadow: '0 0 20px rgba(79, 70, 229, 0.2)' },
					'50%': { opacity: '1', boxShadow: '0 0 40px rgba(79, 70, 229, 0.5)' }
				},
				'hud-scan': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'bracket-pulse': {
					'0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.02)' }
				},
				'orbit-draw': {
					'0%': { strokeDashoffset: '1000' },
					'100%': { strokeDashoffset: '0' }
				},
				'reveal-up': {
					'0%': { opacity: '0', transform: 'translateY(30px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'particle-float': {
					'0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
					'10%': { opacity: '1' },
					'90%': { opacity: '1' },
					'100%': { transform: 'translateY(-100vh) translateX(20px)', opacity: '0' }
				},
				'concentric-rotate': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'radar-sweep': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(40px) scale(0.95)' },
					'100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
				}
			},
			backgroundImage: {
				'grid-pattern':
					'linear-gradient(rgba(79, 70, 229, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(79, 70, 229, 0.08) 1px, transparent 1px)',
				'radial-glow':
					'radial-gradient(ellipse at center, rgba(79, 70, 229, 0.15) 0%, transparent 70%)'
			},
			backgroundSize: {
				grid: '60px 60px'
			}
		}
	},

	plugins: []
} satisfies Config;

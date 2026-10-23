import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Tatah Mineral Design Tokens (figma_tokens.json)
        primary: {
          900: '#00236F', // Deepest marble quarry navy
          800: '#1E3A8A', // Brand primary deep blue
          500: '#4059AA', // Secondary primary accent
          100: '#DCE1FF', // Primary container soft background
        },
        'marble-blue': {
          900: '#00236F',
          800: '#1E3A8A',
          500: '#4059AA',
          100: '#DCE1FF',
        },
        emerald: {
          700: '#006C49', // Deep circular green
          500: '#10B981', // Eco waste-to-value primary
          300: '#6CF8BB', // Eco container light
          50: '#ECFDF5',  // Eco badge background
        },
        'circular-emerald': {
          700: '#006C49',
          500: '#10B981',
          300: '#6CF8BB',
          50: '#ECFDF5',
        },
        surface: {
          canvas: '#F8FAFC',  // Carrara off-white background
          card: '#FFFFFF',    // Pure white polished card surface
          inset: '#F1F5F9',   // Honed stone subdued background
        },
        border: {
          chiseled: '#E2E8F0', // Structural card border
        },
        text: {
          primary: '#0B1C30',   // High contrast typography
          secondary: '#475569', // Subtext and secondary descriptors
          muted: '#64748B',     // Timestamps and micro-labels
        },
        gold: {
          seal: '#D97706',      // Authenticity gold seal
        },
        alert: {
          terracotta: '#DC2626',
        },
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        tabular: ['Inter', 'monospace'],
      },
      boxShadow: {
        'level-1': '0 1px 3px 0 rgba(30, 58, 138, 0.05)',
        'level-2': '0 10px 15px -3px rgba(30, 58, 138, 0.08)',
        'chiseled': '0 2px 4px 0 rgba(0, 35, 111, 0.06), 0 0 0 1px #E2E8F0',
        'mineral-hover': '0 12px 20px -4px rgba(0, 35, 111, 0.12)',
      },
      minHeight: {
        'touch': '52px', // WCAG 2.1 AA tap target minimal untuk tangan pengrajin
      },
    },
  },
  plugins: [],
};

export default config;

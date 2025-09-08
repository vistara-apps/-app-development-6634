/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220 20% 12%)',
        text: 'hsl(220 15% 95%)',
        accent: 'hsl(40 90% 55%)',
        subtle: 'hsl(220 15% 75%)',
        primary: 'hsl(220 80% 50%)',
        surface: 'hsl(220 25% 16%)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220 15% 5% / 0.3)',
        'focus': '0 0 0 3px hsla(40 90% 55% / 0.6)',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '32px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px hsl(220 80% 50%), 0 0 10px hsl(220 80% 50%), 0 0 15px hsl(220 80% 50%)' },
          '100%': { boxShadow: '0 0 10px hsl(220 80% 50%), 0 0 20px hsl(220 80% 50%), 0 0 30px hsl(220 80% 50%)' },
        },
      },
    },
  },
  plugins: [],
}
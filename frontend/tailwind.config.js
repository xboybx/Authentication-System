/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                'glass-bg': 'rgba(255, 255, 255, 0.25)',
                'glass-border': 'rgba(255, 255, 255, 0.18)',
            },
            backdropBlur: {
                'glass': '16px',
            },
            animation: {
                'slideUp': 'slideUp 0.5s ease',
                'slideDown': 'slideDown 0.3s ease',
                'fadeIn': 'fadeIn 0.5s ease',
                'shake': 'shake 0.3s ease',
                'backgroundShift': 'backgroundShift 15s ease-in-out infinite',
            },
            keyframes: {
                slideUp: {
                    'from': { opacity: '0', transform: 'translateY(30px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    'from': { opacity: '0', transform: 'translateY(-10px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    'from': { opacity: '0' },
                    'to': { opacity: '1' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '25%': { transform: 'translateX(-5px)' },
                    '75%': { transform: 'translateX(5px)' },
                },
                backgroundShift: {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.8', transform: 'scale(1.05)' },
                },
            },
        },
    },
    plugins: [],
}

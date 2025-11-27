import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const theme = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    return (
        <div onClick={toggleTheme}
            className="relative flex items-center gap-3 px-4 py-2 rounded-3xl cursor-pointer transition-all duration-300 hover:scale-105"
            style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(var(--blur-amount))',
                WebkitBackdropFilter: 'blur(var(--blur-amount))',
                boxShadow: '0 4px 12px var(--shadow-color)'
            }}>
            <span className="text-xl transition-transform duration-300 hover:rotate-[20deg]">
                {isDark ? <Moon size={15} /> : <Sun size={15} />}
            </span>
            <div className="relative w-12 h-6 rounded-3xl transition-all duration-300 border"
                style={{
                    background: 'var(--bg-secondary)',
                    borderColor: isDark ? 'var(--glass-border)' : 'rgba(0, 0, 0, 0.4)'
                }}>
                <div className="absolute top-0.5 w-[18px] h-[18px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{
                        left: isDark ? '24px' : '2px',
                        background: 'var(--accent-primary)',
                        boxShadow: '0 2px 4px var(--shadow-color)'
                    }}
                />
            </div>
            <span className="text-sm font-semibold select-none"
                style={{ color: 'var(--text-primary)' }}>
                {isDark ? 'Dark' : 'Light'}
            </span>
        </div>
    );
};

export default ThemeToggle;

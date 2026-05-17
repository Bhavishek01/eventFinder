
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.sunIcon = '☀️';
        this.moonIcon = '🌙';
        this.init();
        this.updateThemeIcon();
    }

    init() {
        this.applyTheme(this.theme);
        this.setupEventListeners();
    }

    setupEventListeners() {
        const toggleBtnIndex = document.getElementById('themeToggleBtn');

        if (toggleBtnIndex) {
            toggleBtnIndex.addEventListener('click', () => this.toggle());
        }
    }

    updateThemeIcon() {
        const isDark = this.theme === 'dark';
        const icon = document.getElementById('themeIcon');
        if (icon) {
            icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
        localStorage.setItem('theme', this.theme);
    }

    toggleBtn() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
        this.updateThemeIcon();
        localStorage.setItem('theme', this.theme);
    }

    applyTheme(themeName) {
        const body = document.body;
        const btnIndex = document.getElementById('themeToggleBtn');
        if (themeName === 'dark') {
            body.classList.add('dark-mode');
            if (btnIndex) {
                btnIndex.textContent = this.sunIcon + ' Light Mode';
                btnIndex.setAttribute('aria-label', 'Switch to light mode');
            }

        } else {
            body.classList.remove('dark-mode');
            if (btnIndex) {
                btnIndex.textContent = this.moonIcon + ' Dark Mode';
                btnIndex.setAttribute('aria-label', 'Switch to dark mode');
            }
        }
    }

 
    setTheme(themeName) {
        if (['light', 'dark'].includes(themeName)) {
            this.theme = themeName;
            this.applyTheme(this.theme);
            localStorage.setItem('theme', this.theme);
        }
    }

    getTheme() {
        return this.theme;
    }
}

let themeManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        themeManager = new ThemeManager();
        window.themeManager = themeManager;
    });
} else {
    themeManager = new ThemeManager();
    window.themeManager = themeManager;
}


function toggleTheme() {
    if (window.themeManager) {
        window.themeManager.toggle();
    }
}

function toggleThemeBtn() {
    if (window.themeManager) {
        window.themeManager.toggleBtn();
    }
}

function setTheme(themeName) {
    if (window.themeManager) {
        window.themeManager.setTheme(themeName);
    }
}

function loadTheme() {
    if (window.themeManager) {
        return window.themeManager.getTheme();
    }
    return localStorage.getItem('theme') || 'light';
}

function toggleAppearance() {
    const themeOptions = document.getElementById('themeOptions');
    if (themeOptions) {
        themeOptions.style.display = themeOptions.style.display === 'none' ? 'block' : 'none';
    }
}
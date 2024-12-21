import en from './en.js';
import ru from './ru.js';

export class LocalizationManager {
    constructor() {
        this.languages = { en, ru };
        this.currentLang = localStorage.getItem('language') || 'en';
        this.translations = this.languages[this.currentLang];
        
        // Create language switcher in UI
        this.createLanguageSwitcher();
    }

    createLanguageSwitcher() {
        const header = document.querySelector('header');
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <select id="language-select">
                <option value="en" ${this.currentLang === 'en' ? 'selected' : ''}>English</option>
                <option value="ru" ${this.currentLang === 'ru' ? 'selected' : ''}>Русский</option>
            </select>
        `;
        header.appendChild(switcher);

        // Add event listener
        document.getElementById('language-select').addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });
    }

    setLanguage(lang) {
        if (this.languages[lang]) {
            this.currentLang = lang;
            this.translations = this.languages[lang];
            localStorage.setItem('language', lang);
            // Trigger UI update
            window.dispatchEvent(new CustomEvent('languageChanged'));
        }
    }

    get(key, replacements = {}) {
        // Get nested keys using dot notation (e.g., 'ui.resources.food')
        const value = key.split('.').reduce((obj, k) => obj && obj[k], this.translations);
        
        if (value === undefined) {
            console.warn(`Missing translation for key: ${key}`);
            return key;
        }

        // Replace placeholders with values
        return Object.entries(replacements).reduce(
            (text, [key, value]) => text.replace(`{${key}}`, value),
            value
        );
    }

    // Helper method to update all UI elements with new language
    updateUI() {
        // Update title
        document.querySelector('h1').textContent = this.get('ui.title');
        
        // Update resource labels
        Object.keys(this.translations.ui.resources).forEach(resource => {
            const element = document.querySelector(`#${resource} h3`);
            if (element) {
                element.textContent = this.get(`ui.resources.${resource}`);
            }
        });

        // Update survivors panel
        document.querySelector('.survivors-panel h2').textContent = this.get('ui.survivors');
        
        // Update day/week counters
        const day = document.getElementById('day-counter').textContent.split(': ')[1];
        const week = document.getElementById('week-counter').textContent.split(': ')[1];
        document.getElementById('day-counter').textContent = `${this.get('ui.day')}: ${day}`;
        document.getElementById('week-counter').textContent = `${this.get('ui.week')}: ${week}`;
    }
} 
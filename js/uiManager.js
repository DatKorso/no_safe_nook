export class UIManager {
    constructor(gameState, resourceManager, survivorManager, localization) {
        this.gameState = gameState;
        this.resourceManager = resourceManager;
        this.survivorManager = survivorManager;
        this.localization = localization;
        this.currentEvent = null;
    }

    updateUI() {
        this.updateGameStats();
        this.updateResources();
        this.updateSurvivors();
        if (this.currentEvent) {
            this.updateEvent(this.currentEvent);
        }
    }

    updateGameStats() {
        const dayCounter = document.getElementById('day-counter');
        const weekCounter = document.getElementById('week-counter');

        if (dayCounter) {
            dayCounter.textContent = `${this.localization.get('ui.day')}: ${this.gameState.day}`;
        }
        if (weekCounter) {
            weekCounter.textContent = `${this.localization.get('ui.week')}: ${Math.floor((this.gameState.day - 1) / 7) + 1}`;
        }
    }

    updateResources() {
        const resources = ['food', 'water', 'medicine', 'materials', 'morale'];
        resources.forEach(resource => {
            const value = this.resourceManager.getResource(resource);
            const resourceElement = document.getElementById(resource);
            if (resourceElement) {
                // Update percentage text
                const span = resourceElement.querySelector('span');
                if (span) {
                    span.textContent = `${value}%`;
                }

                // Update progress bar
                const fill = resourceElement.querySelector('.resource-fill');
                if (fill) {
                    fill.style.width = `${value}%`;
                }

                // Update resource status classes
                resourceElement.classList.remove('critical', 'warning', 'excess');
                if (value <= 20) {
                    resourceElement.classList.add('critical');
                } else if (value <= 30) {
                    resourceElement.classList.add('warning');
                } else if (value >= 90) {
                    resourceElement.classList.add('excess');
                }
            }
        });
    }

    updateSurvivors() {
        const survivorsContainer = document.getElementById('survivors-list');
        if (!survivorsContainer) return;

        survivorsContainer.innerHTML = '';
        const survivors = this.survivorManager.getAllSurvivors();

        survivors.forEach(survivor => {
            const survivorElement = document.createElement('div');
            survivorElement.className = 'survivor';
            if (survivor.health < 50) {
                survivorElement.classList.add('injured');
            }
            
            survivorElement.innerHTML = `
                <div class="survivor-header">
                    <div class="survivor-name">${survivor.name}</div>
                    <div class="survivor-health">
                        <div class="health-bar">
                            <div class="health-progress" style="width: ${survivor.health}%"></div>
                            <span>${survivor.health}%</span>
                        </div>
                    </div>
                </div>
                <div class="survivor-skills">
                    ${survivor.skills.map(skill => 
                        `<span class="skill-tag ${skill}">${this.localization.get(`skills.${skill}`)}</span>`
                    ).join('')}
                </div>
            `;
            
            survivorsContainer.appendChild(survivorElement);
        });
    }

    clearEventDisplay() {
        // Clear event text and disable choice buttons
        document.getElementById('event-text').textContent = '';
        const leftButton = document.getElementById('choice-left');
        const rightButton = document.getElementById('choice-right');
        leftButton.textContent = '';
        rightButton.textContent = '';
        leftButton.disabled = true;
        rightButton.disabled = true;
    }

    updateEvent(event) {
        if (!event) return;
        
        // Update event text
        document.getElementById('event-text').textContent = event.text;
        
        // Update choice buttons
        const leftButton = document.getElementById('choice-left');
        const rightButton = document.getElementById('choice-right');
        
        leftButton.textContent = event.choices.left.text;
        rightButton.textContent = event.choices.right.text;
        
        // Enable buttons
        leftButton.disabled = false;
        rightButton.disabled = false;
    }

    showEventOutcome(outcome) {
        if (!outcome) return;

        // Create and show a temporary result message
        const resultElement = document.createElement('div');
        resultElement.className = 'event-result';

        // Highlight resource changes with colors
        const coloredOutcome = outcome.replace(/([+-]\d+)/g, match => {
            const isPositive = match.startsWith('+');
            const symbol = isPositive ? '+' : '';
            return `<span class="${isPositive ? 'positive' : 'negative'}">${symbol}${match}</span>`;
        });
        
        resultElement.innerHTML = coloredOutcome;
        
        // Add to event panel instead of event card for better positioning
        const eventPanel = document.querySelector('.event-panel');
        if (!eventPanel) return;

        // Remove any existing event results
        const existingResults = document.querySelectorAll('.event-result');
        existingResults.forEach(el => el.remove());
        
        eventPanel.appendChild(resultElement);

        // Disable choice buttons during outcome display
        const choiceLeft = document.getElementById('choice-left');
        const choiceRight = document.getElementById('choice-right');
        if (choiceLeft) choiceLeft.disabled = true;
        if (choiceRight) choiceRight.disabled = true;

        // Remove the result message after animation and re-enable buttons
        setTimeout(() => {
            if (resultElement.parentNode) {
                resultElement.parentNode.removeChild(resultElement);
            }
            if (choiceLeft) choiceLeft.disabled = false;
            if (choiceRight) choiceRight.disabled = false;
        }, 3000);
    }

    showGameOver() {
        const container = document.getElementById('game-container');
        if (!container) return;

        container.innerHTML = `
            <div class="game-over">
                <h2>${this.localization.get('ui.gameOver')}</h2>
                <p>${this.localization.get('ui.gameOverText')}</p>
                <button onclick="window.game.restartGame()">
                    ${this.localization.get('ui.restart')}
                </button>
            </div>
        `;
    }
} 
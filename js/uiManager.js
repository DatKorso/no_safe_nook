export class UIManager {
    constructor(gameState, resourceManager, survivorManager, localization) {
        this.gameState = gameState;
        this.resourceManager = resourceManager;
        this.survivorManager = survivorManager;
        this.localization = localization;
        this.currentEvent = null;
        
        // Cache DOM elements
        this.dayCounter = document.getElementById('day-counter');
        this.weekCounter = document.getElementById('week-counter');
        this.eventText = document.getElementById('event-text');
        this.choiceLeft = document.getElementById('choice-left');
        this.choiceRight = document.getElementById('choice-right');
        this.survivorsList = document.getElementById('survivors-list');

        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            this.updateUI();
            if (this.currentEvent) {
                this.updateEvent(this.currentEvent);
            }
        });

        // Initial UI update
        this.updateUI();
    }

    updateUI(eventResult = null) {
        this.updateGameStats();
        this.updateResources();
        this.updateSurvivors();
        
        if (eventResult) {
            this.showEventResult(eventResult);
        }
    }

    updateGameStats() {
        this.dayCounter.textContent = `${this.localization.get('ui.day')}: ${this.gameState.day}`;
        this.weekCounter.textContent = `${this.localization.get('ui.week')}: ${this.gameState.week}`;
    }

    updateResources() {
        const resources = this.resourceManager.getResourceStatus();
        for (const [resource, amount] of Object.entries(resources)) {
            const element = document.getElementById(resource);
            if (element) {
                // Update resource name and percentage display
                const resourceName = this.localization.get(`ui.resources.${resource}`);
                element.querySelector('h3').textContent = resourceName;
                element.querySelector('span').textContent = `${amount}%`;
                
                // Update resource bar
                const fillBar = element.querySelector('.resource-fill');
                fillBar.style.width = `${amount}%`;

                // Remove existing status classes
                element.classList.remove('critical', 'warning', 'excess');

                // Add appropriate status class
                if (amount <= 20) {
                    element.classList.add('critical');
                } else if (amount <= 30) {
                    element.classList.add('warning');
                } else if (amount >= 90) {
                    element.classList.add('excess');
                }
            }
        }
    }

    updateSurvivors() {
        const survivors = this.survivorManager.getAllSurvivors();
        this.survivorsList.innerHTML = survivors.map(survivor => `
            <div class="survivor ${survivor.health < 50 ? 'injured' : ''}">
                <h3>${survivor.name}</h3>
                <div class="health-bar">
                    <div class="health-fill" style="width: ${survivor.health}%"></div>
                </div>
                <div class="survivor-stats">
                    <p>${this.localization.get('ui.health')}: ${survivor.health}</p>
                    <p>${this.localization.get('ui.skills')}: ${survivor.skills.map(skill => 
                        this.localization.get(`skills.${skill.toLowerCase()}`)
                    ).join(', ')}</p>
                    <p class="survivor-backstory">${survivor.backstory}</p>
                </div>
            </div>
        `).join('');

        // Update survivors panel title
        document.querySelector('.survivors-panel h2').textContent = this.localization.get('ui.survivors');
    }

    showEventResult(result) {
        if (!result) return;

        // Create and show a temporary result message
        const resultElement = document.createElement('div');
        resultElement.className = 'event-result';
        resultElement.textContent = result;
        
        const eventCard = document.querySelector('.event-card');
        // Remove any existing event results
        const existingResults = eventCard.querySelectorAll('.event-result');
        existingResults.forEach(el => el.remove());
        
        eventCard.appendChild(resultElement);

        // Remove the result message after a delay
        setTimeout(() => {
            resultElement.remove();
        }, 3000);
    }

    updateEvent(event) {
        if (!event) return;

        this.currentEvent = event;  // Store the current event for language updates
        
        // Update event text and choices
        this.eventText.textContent = event.text;
        this.choiceLeft.textContent = event.choices.left.text;
        this.choiceRight.textContent = event.choices.right.text;

        // Enable buttons for new event
        this.choiceLeft.disabled = false;
        this.choiceRight.disabled = false;

        // Add visual feedback that a new event is available
        this.eventText.classList.add('new-event');
        setTimeout(() => {
            this.eventText.classList.remove('new-event');
        }, 300);
    }
} 
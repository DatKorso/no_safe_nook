export class UIManager {
    constructor(gameState, resourceManager, survivorManager) {
        this.gameState = gameState;
        this.resourceManager = resourceManager;
        this.survivorManager = survivorManager;
        
        // Cache DOM elements
        this.dayCounter = document.getElementById('day-counter');
        this.weekCounter = document.getElementById('week-counter');
        this.eventText = document.getElementById('event-text');
        this.choiceLeft = document.getElementById('choice-left');
        this.choiceRight = document.getElementById('choice-right');
        this.survivorsList = document.getElementById('survivors-list');

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
        this.dayCounter.textContent = `Day: ${this.gameState.day}`;
        this.weekCounter.textContent = `Week: ${this.gameState.week}`;
    }

    updateResources() {
        const resources = this.resourceManager.getResourceStatus();
        for (const [resource, amount] of Object.entries(resources)) {
            const element = document.getElementById(resource);
            if (element) {
                // Update percentage display
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
                    <p>Health: ${survivor.health}</p>
                    <p>Skills: ${survivor.skills.join(', ')}</p>
                    <p class="survivor-backstory">${survivor.backstory}</p>
                </div>
            </div>
        `).join('');
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
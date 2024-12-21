import { GameState } from './gameState.js';
import { EventSystem } from './eventSystem.js';
import { UIManager } from './uiManager.js';
import { ResourceManager } from './resourceManager.js';
import { SurvivorManager } from './survivorManager.js';
import { LocalizationManager } from './localization/index.js';

export class Game {
    constructor() {
        this.gameState = new GameState();
        this.resourceManager = new ResourceManager();
        this.survivorManager = new SurvivorManager();
        this.localization = new LocalizationManager();
        this.eventSystem = new EventSystem(this.gameState, this.resourceManager, this.survivorManager, this.localization);
        this.uiManager = new UIManager(this.gameState, this.resourceManager, this.survivorManager, this.localization);
        this.gameLoopInterval = null;
        this.isPaused = false;
        
        this.initialize();
    }

    initialize() {
        // Set up initial game state
        this.gameState.initialize();
        
        // Set up event listeners
        document.getElementById('choice-left').addEventListener('click', () => this.handleChoice('left'));
        document.getElementById('choice-right').addEventListener('click', () => this.handleChoice('right'));

        // Start with initial event
        this.displayNextEvent();
        
        // Start the game loop
        this.startGameLoop();
    }

    displayNextEvent() {
        const event = this.eventSystem.generateNextEvent();
        this.uiManager.updateEvent(event);
        // Pause the game while player makes a choice
        this.pauseGame();
    }

    handleChoice(choice) {
        const result = this.eventSystem.resolveChoice(choice);
        
        // Show the outcome message
        this.uiManager.showEventOutcome(result);
        
        // Increment the day after each choice
        this.gameState.incrementDay();
        this.resourceManager.consumeDailyResources();
        
        // Update UI with new state
        this.uiManager.updateUI();
        
        // Check for game over conditions
        if (this.checkGameOver()) {
            return;
        }

        // Clear the current event display while showing outcome
        this.uiManager.clearEventDisplay();

        // Wait for the outcome message to disappear before showing next event
        setTimeout(() => {
            // Resume the game and show next event
            this.resumeGame();
            this.displayNextEvent();
        }, 3000);
    }

    pauseGame() {
        this.isPaused = true;
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
            this.gameLoopInterval = null;
        }
    }

    resumeGame() {
        this.isPaused = false;
        this.startGameLoop();
    }

    startGameLoop() {
        if (this.gameLoopInterval) {
            clearInterval(this.gameLoopInterval);
        }

        // Update game state every day (15 seconds = 1 in-game day for better pacing)
        this.gameLoopInterval = setInterval(() => {
            if (this.isPaused) return;

            this.gameState.incrementDay();
            this.resourceManager.consumeDailyResources();
            this.uiManager.updateUI();

            // Check for weekly misfortune event (reduced frequency)
            if (this.gameState.isWeekEnd() && Math.random() < 0.7) { // 70% chance for misfortune
                this.pauseGame();
                const result = this.eventSystem.triggerMisfortuneEvent();
                this.uiManager.showEventOutcome(result);
                
                // Clear the current event display while showing outcome
                this.uiManager.clearEventDisplay();
                
                // Check for game over after misfortune event
                if (!this.checkGameOver()) {
                    setTimeout(() => {
                        this.resumeGame();
                        this.displayNextEvent();
                    }, 3000);
                }
            }
        }, 15000); // 15 seconds = 1 in-game day
    }

    checkGameOver() {
        if (!this.survivorManager.hasSurvivors()) {
            this.endGame(this.localization.get('gameOver.reasons.noSurvivors'));
            return true;
        }
        
        if (this.resourceManager.hasExtremeResources()) {
            const extremeDesc = this.resourceManager.getExtremeResourcesDescription();
            this.endGame(this.localization.get('gameOver.reasons.resources', { reason: extremeDesc }));
            return true;
        }
        
        return false;
    }

    endGame(reason) {
        this.pauseGame();
        const days = this.gameState.day;
        const weeks = this.gameState.week;
        const message = [
            this.localization.get('gameOver.title'),
            '',
            `${this.localization.get('gameOver.reasons.resources', { reason })}`,
            '',
            this.localization.get('gameOver.survived', { days, weeks }),
            '',
            this.localization.get('gameOver.restart')
        ].join('\n');
        
        alert(message);
        location.reload(); // Restart the game
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 
export class GameState {
    constructor() {
        this.day = 1;
        this.week = 1;
        this.currentEvent = null;
        this.gameOver = false;
    }

    initialize() {
        this.day = 1;
        this.week = 1;
        this.gameOver = false;
    }

    incrementDay() {
        this.day++;
        if (this.day > 7) {
            this.day = 1;
            this.week++;
        }
    }

    isWeekEnd() {
        return this.day === 7;
    }

    isGameOver() {
        return this.gameOver;
    }

    setGameOver() {
        this.gameOver = true;
    }
} 
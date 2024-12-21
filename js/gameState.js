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
        this.week = Math.floor((this.day - 1) / 7) + 1;
    }

    isWeekEnd() {
        return this.day % 7 === 0;
    }

    isGameOver() {
        return this.gameOver;
    }

    setGameOver() {
        this.gameOver = true;
    }
} 
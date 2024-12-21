export class EventSystem {
    constructor(gameState, resourceManager, survivorManager) {
        this.gameState = gameState;
        this.resourceManager = resourceManager;
        this.survivorManager = survivorManager;
        this.currentEvent = null;
    }

    generateNextEvent() {
        const events = [
            this.generateScavengingEvent,
            this.generateConflictEvent,
            this.generateTraderEvent,
            this.generateMedicalEvent,
            this.generateShelterEvent,
            this.generateMoraleEvent
        ];

        const randomEvent = events[Math.floor(Math.random() * events.length)];
        this.currentEvent = randomEvent.call(this);
        return this.currentEvent;
    }

    generateScavengingEvent() {
        const survivor = this.survivorManager.getRandomSurvivor();
        return {
            type: 'scavenging',
            text: `${survivor.name} has found a potentially dangerous building to scavenge. It might contain valuable supplies, but the structure looks unstable.`,
            choices: {
                left: {
                    text: 'Risk entering the building',
                    consequences: () => {
                        const success = Math.random() > 0.4;
                        if (success) {
                            this.resourceManager.modifyResource('food', 15);
                            this.resourceManager.modifyResource('medicine', 10);
                            this.resourceManager.modifyResource('morale', 5);
                            return `${survivor.name} successfully found supplies! Food +15, Medicine +10, Morale +5`;
                        } else {
                            this.survivorManager.modifyHealth(survivor.id, -30);
                            this.resourceManager.modifyResource('morale', -15);
                            return `${survivor.name} was injured by falling debris. Health -30, Morale -15`;
                        }
                    }
                },
                right: {
                    text: 'Look for a safer location',
                    consequences: () => {
                        this.resourceManager.modifyResource('food', 5);
                        this.resourceManager.modifyResource('water', 5);
                        this.resourceManager.modifyResource('morale', -5);
                        return `${survivor.name} found small amounts of supplies but feels discouraged. Food +5, Water +5, Morale -5`;
                    }
                }
            }
        };
    }

    generateConflictEvent() {
        const [survivor1, survivor2] = this.survivorManager.getRandomSurvivorPair();
        return {
            type: 'conflict',
            text: `${survivor1.name} and ${survivor2.name} are arguing over resource distribution.`,
            choices: {
                left: {
                    text: `Support ${survivor1.name}'s position`,
                    consequences: () => {
                        this.survivorManager.modifyRelationship(survivor1.id, survivor2.id, -20);
                        this.resourceManager.modifyResource('morale', -10);
                        this.resourceManager.modifyResource('food', 10);
                        this.resourceManager.modifyResource('water', 10);
                        return `${survivor2.name} is upset but resources are better managed. Relationship decreased, Morale -10, Food +10, Water +10`;
                    }
                },
                right: {
                    text: `Support ${survivor2.name}'s position`,
                    consequences: () => {
                        this.survivorManager.modifyRelationship(survivor1.id, survivor2.id, -20);
                        this.resourceManager.modifyResource('morale', -10);
                        this.resourceManager.modifyResource('medicine', 10);
                        this.resourceManager.modifyResource('materials', 10);
                        return `${survivor1.name} is upset but resources are better managed. Relationship decreased, Morale -10, Medicine +10, Materials +10`;
                    }
                }
            }
        };
    }

    generateMoraleEvent() {
        const survivor = this.survivorManager.getRandomSurvivor();
        return {
            type: 'morale',
            text: `${survivor.name} suggests organizing a group activity to boost morale, but it will consume some resources.`,
            choices: {
                left: {
                    text: 'Organize the activity',
                    consequences: () => {
                        this.resourceManager.modifyResource('food', -10);
                        this.resourceManager.modifyResource('water', -10);
                        this.resourceManager.modifyResource('morale', 20);
                        return 'The activity improved everyone\'s spirits! Food -10, Water -10, Morale +20';
                    }
                },
                right: {
                    text: 'Focus on survival',
                    consequences: () => {
                        this.resourceManager.modifyResource('morale', -15);
                        this.resourceManager.modifyResource('food', 5);
                        this.resourceManager.modifyResource('water', 5);
                        return 'The group feels dejected but saved resources. Morale -15, Food +5, Water +5';
                    }
                }
            }
        };
    }

    generateMedicalEvent() {
        const survivor = this.survivorManager.getRandomSurvivor();
        return {
            type: 'medical',
            text: `${survivor.name} has fallen ill and needs medicine.`,
            choices: {
                left: {
                    text: 'Use medicine to treat them',
                    consequences: () => {
                        if (this.resourceManager.getResource('medicine') >= 10) {
                            this.resourceManager.modifyResource('medicine', -10);
                            this.survivorManager.modifyHealth(survivor.id, 20);
                            this.resourceManager.modifyResource('morale', 5);
                            return `${survivor.name} was treated successfully. Medicine -10, Health +20, Morale +5`;
                        }
                        this.survivorManager.modifyHealth(survivor.id, -20);
                        this.resourceManager.modifyResource('morale', -10);
                        return `No medicine available. ${survivor.name}'s health deteriorates. Health -20, Morale -10`;
                    }
                },
                right: {
                    text: 'Use alternative treatment',
                    consequences: () => {
                        this.resourceManager.modifyResource('water', -15);
                        this.resourceManager.modifyResource('food', -10);
                        this.survivorManager.modifyHealth(survivor.id, 10);
                        return `${survivor.name} recovers slowly. Water -15, Food -10, Health +10`;
                    }
                }
            }
        };
    }

    generateShelterEvent() {
        return {
            type: 'shelter',
            text: 'The shelter needs repairs. Ignoring it risks resource loss, but repairs require materials.',
            choices: {
                left: {
                    text: 'Repair the shelter',
                    consequences: () => {
                        this.resourceManager.modifyResource('materials', -15);
                        this.resourceManager.modifyResource('morale', 10);
                        return 'Shelter repaired successfully. Materials -15, Morale +10';
                    }
                },
                right: {
                    text: 'Postpone repairs',
                    consequences: () => {
                        const randomLoss = Math.floor(Math.random() * 10) + 5;
                        this.resourceManager.modifyResource('food', -randomLoss);
                        this.resourceManager.modifyResource('medicine', -randomLoss);
                        this.resourceManager.modifyResource('morale', -10);
                        return `Poor shelter conditions affected supplies. Food -${randomLoss}, Medicine -${randomLoss}, Morale -10`;
                    }
                }
            }
        };
    }

    triggerMisfortuneEvent() {
        const misfortuneEvents = [
            {
                text: 'A violent storm has damaged the shelter!',
                consequences: () => {
                    this.resourceManager.modifyResource('materials', -20);
                    this.resourceManager.modifyResource('food', -15);
                    this.resourceManager.modifyResource('morale', -15);
                    return 'Storm damage has affected resources and morale!';
                }
            },
            {
                text: 'Raiders have attacked the shelter!',
                consequences: () => {
                    this.resourceManager.modifyResource('medicine', -20);
                    this.resourceManager.modifyResource('food', -20);
                    this.resourceManager.modifyResource('morale', -20);
                    const survivor = this.survivorManager.getRandomSurvivor();
                    this.survivorManager.modifyHealth(survivor.id, -30);
                    return `Raiders stole supplies and ${survivor.name} was injured!`;
                }
            },
            {
                text: 'A disease outbreak has occurred!',
                consequences: () => {
                    this.survivorManager.getAllSurvivors().forEach(survivor => {
                        this.survivorManager.modifyHealth(survivor.id, -15);
                    });
                    this.resourceManager.modifyResource('medicine', -25);
                    this.resourceManager.modifyResource('morale', -15);
                    return 'Disease has spread through the group!';
                }
            }
        ];

        const event = misfortuneEvents[Math.floor(Math.random() * misfortuneEvents.length)];
        const result = event.consequences();
        
        // Check if game should end
        if (!this.survivorManager.hasSurvivors() || this.resourceManager.hasExtremeResources()) {
            this.gameState.setGameOver();
        }

        return result;
    }

    resolveChoice(choice) {
        if (!this.currentEvent) return null;
        
        const result = this.currentEvent.choices[choice].consequences();
        
        // Check if game should end
        if (!this.survivorManager.hasSurvivors() || this.resourceManager.hasExtremeResources()) {
            this.gameState.setGameOver();
        }

        return result;
    }
} 
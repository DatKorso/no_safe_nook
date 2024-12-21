export class EventSystem {
    constructor(gameState, resourceManager, survivorManager, localization) {
        this.gameState = gameState;
        this.resourceManager = resourceManager;
        this.survivorManager = survivorManager;
        this.localization = localization;
        this.currentEvent = null;
    }

    generateNextEvent() {
        const events = [
            this.generateScavengingEvent,
            this.generateConflictEvent,
            this.generateMedicalEvent,
            this.generateShelterEvent,
            this.generateMoraleEvent,
            this.generateTradeEvent,
            this.generateExplorationEvent,
            this.generateDefenseEvent,
            this.generateCommunityEvent
        ];

        const randomEvent = events[Math.floor(Math.random() * events.length)];
        this.currentEvent = randomEvent.call(this);
        return this.currentEvent;
    }

    generateScavengingEvent() {
        const survivor = this.survivorManager.getRandomSurvivor();
        return {
            type: 'scavenging',
            text: this.localization.get('events.scavenging.title', { name: survivor.name }),
            choices: {
                left: {
                    text: this.localization.get('events.scavenging.choices.risk'),
                    consequences: () => {
                        const success = Math.random() > 0.4;
                        if (success) {
                            const food = 20, medicine = 15, morale = 10;
                            this.resourceManager.modifyResource('food', food);
                            this.resourceManager.modifyResource('medicine', medicine);
                            this.resourceManager.modifyResource('morale', morale);
                            return this.localization.get('events.scavenging.outcomes.success', {
                                name: survivor.name,
                                food,
                                medicine,
                                morale
                            });
                        } else {
                            const health = 25, morale = 15;
                            this.survivorManager.modifyHealth(survivor.id, -health);
                            this.resourceManager.modifyResource('morale', -morale);
                            return this.localization.get('events.scavenging.outcomes.injury', {
                                name: survivor.name,
                                health,
                                morale
                            });
                        }
                    }
                },
                right: {
                    text: this.localization.get('events.scavenging.choices.safe'),
                    consequences: () => {
                        const food = 8, water = 10, morale = 5;
                        this.resourceManager.modifyResource('food', food);
                        this.resourceManager.modifyResource('water', water);
                        this.resourceManager.modifyResource('morale', -morale);
                        return this.localization.get('events.scavenging.outcomes.small', {
                            name: survivor.name,
                            food,
                            water,
                            morale
                        });
                    }
                }
            }
        };
    }

    generateTradeEvent() {
        const survivor = this.survivorManager.getRandomSurvivor();
        return {
            type: 'trade',
            text: this.localization.get('events.trade.title', { name: survivor.name }),
            choices: {
                left: {
                    text: this.localization.get('events.trade.choices.accept'),
                    consequences: () => {
                        const food = 15, medicine = -10, materials = -10;
                        this.resourceManager.modifyResource('food', food);
                        this.resourceManager.modifyResource('medicine', medicine);
                        this.resourceManager.modifyResource('materials', materials);
                        return this.localization.get('events.trade.outcomes.success', {
                            food,
                            medicine: -medicine,
                            materials: -materials
                        });
                    }
                },
                right: {
                    text: this.localization.get('events.trade.choices.decline'),
                    consequences: () => {
                        const morale = 10;
                        this.resourceManager.modifyResource('morale', -morale);
                        return this.localization.get('events.trade.outcomes.decline', {
                            morale
                        });
                    }
                }
            }
        };
    }

    generateExplorationEvent() {
        const survivor = this.survivorManager.getRandomSurvivor();
        return {
            type: 'exploration',
            text: this.localization.get('events.exploration.title', { name: survivor.name }),
            choices: {
                left: {
                    text: this.localization.get('events.exploration.choices.explore'),
                    consequences: () => {
                        const success = Math.random() > 0.3;
                        if (success) {
                            const materials = 25, water = 15, morale = 10;
                            this.resourceManager.modifyResource('materials', materials);
                            this.resourceManager.modifyResource('water', water);
                            this.resourceManager.modifyResource('morale', morale);
                            return this.localization.get('events.exploration.outcomes.success', {
                                name: survivor.name,
                                materials,
                                water,
                                morale
                            });
                        } else {
                            const health = 20, morale = 15, water = -10;
                            this.survivorManager.modifyHealth(survivor.id, -health);
                            this.resourceManager.modifyResource('morale', -morale);
                            this.resourceManager.modifyResource('water', water);
                            return this.localization.get('events.exploration.outcomes.failure', {
                                name: survivor.name,
                                health,
                                morale,
                                water: -water
                            });
                        }
                    }
                },
                right: {
                    text: this.localization.get('events.exploration.choices.stay'),
                    consequences: () => {
                        const materials = 5, morale = 5;
                        this.resourceManager.modifyResource('materials', materials);
                        this.resourceManager.modifyResource('morale', -morale);
                        return this.localization.get('events.exploration.outcomes.stay', {
                            materials,
                            morale
                        });
                    }
                }
            }
        };
    }

    generateDefenseEvent() {
        return {
            type: 'defense',
            text: this.localization.get('events.defense.title'),
            choices: {
                left: {
                    text: this.localization.get('events.defense.choices.fight'),
                    consequences: () => {
                        const success = Math.random() > 0.5;
                        if (success) {
                            const materials = 20, food = 15, morale = 15;
                            this.resourceManager.modifyResource('materials', materials);
                            this.resourceManager.modifyResource('food', food);
                            this.resourceManager.modifyResource('morale', morale);
                            return this.localization.get('events.defense.outcomes.success', {
                                materials,
                                food,
                                morale
                            });
                        } else {
                            const materials = -15, food = -10, morale = -20;
                            this.resourceManager.modifyResource('materials', materials);
                            this.resourceManager.modifyResource('food', food);
                            this.resourceManager.modifyResource('morale', morale);
                            const survivor = this.survivorManager.getRandomSurvivor();
                            this.survivorManager.modifyHealth(survivor.id, -30);
                            return this.localization.get('events.defense.outcomes.failure', {
                                name: survivor.name,
                                materials: -materials,
                                food: -food,
                                morale: -morale
                            });
                        }
                    }
                },
                right: {
                    text: this.localization.get('events.defense.choices.hide'),
                    consequences: () => {
                        const food = -15, medicine = -10, morale = -10;
                        this.resourceManager.modifyResource('food', food);
                        this.resourceManager.modifyResource('medicine', medicine);
                        this.resourceManager.modifyResource('morale', morale);
                        return this.localization.get('events.defense.outcomes.hide', {
                            food: -food,
                            medicine: -medicine,
                            morale: -morale
                        });
                    }
                }
            }
        };
    }

    generateCommunityEvent() {
        const [survivor1, survivor2] = this.survivorManager.getRandomSurvivorPair();
        return {
            type: 'community',
            text: this.localization.get('events.community.title', { name1: survivor1.name, name2: survivor2.name }),
            choices: {
                left: {
                    text: this.localization.get('events.community.choices.share'),
                    consequences: () => {
                        const food = -10, water = -10, morale = 20;
                        this.resourceManager.modifyResource('food', food);
                        this.resourceManager.modifyResource('water', water);
                        this.resourceManager.modifyResource('morale', morale);
                        this.survivorManager.modifyRelationship(survivor1.id, survivor2.id, 20);
                        return this.localization.get('events.community.outcomes.share', {
                            name1: survivor1.name,
                            name2: survivor2.name,
                            food: -food,
                            water: -water,
                            morale
                        });
                    }
                },
                right: {
                    text: this.localization.get('events.community.choices.hoard'),
                    consequences: () => {
                        const morale = -15;
                        this.resourceManager.modifyResource('morale', morale);
                        this.survivorManager.modifyRelationship(survivor1.id, survivor2.id, -25);
                        return this.localization.get('events.community.outcomes.hoard', {
                            name1: survivor1.name,
                            name2: survivor2.name,
                            morale: -morale
                        });
                    }
                }
            }
        };
    }

    generateConflictEvent() {
        const [survivor1, survivor2] = this.survivorManager.getRandomSurvivorPair();
        return {
            type: 'conflict',
            text: this.localization.get('events.conflict.title', { name1: survivor1.name, name2: survivor2.name }),
            choices: {
                left: {
                    text: this.localization.get('events.conflict.choices.side1', { name: survivor1.name }),
                    consequences: () => {
                        const morale = 15;
                        this.survivorManager.modifyRelationship(survivor1.id, survivor2.id, -25);
                        this.resourceManager.modifyResource('morale', -morale);
                        this.resourceManager.modifyResource('food', 15);
                        this.resourceManager.modifyResource('water', 15);
                        return this.localization.get('events.conflict.outcomes.result', {
                            name: survivor2.name,
                            morale
                        });
                    }
                },
                right: {
                    text: this.localization.get('events.conflict.choices.side2', { name: survivor2.name }),
                    consequences: () => {
                        const morale = 15;
                        this.survivorManager.modifyRelationship(survivor1.id, survivor2.id, -25);
                        this.resourceManager.modifyResource('morale', -morale);
                        this.resourceManager.modifyResource('medicine', 15);
                        this.resourceManager.modifyResource('materials', 15);
                        return this.localization.get('events.conflict.outcomes.result', {
                            name: survivor1.name,
                            morale
                        });
                    }
                }
            }
        };
    }

    generateMedicalEvent() {
        const survivor = this.survivorManager.getRandomSurvivor();
        return {
            type: 'medical',
            text: this.localization.get('events.medical.title', { name: survivor.name }),
            choices: {
                left: {
                    text: this.localization.get('events.medical.choices.use'),
                    consequences: () => {
                        if (this.resourceManager.getResource('medicine') >= 15) {
                            const medicine = 15, health = 30, morale = 10;
                            this.resourceManager.modifyResource('medicine', -medicine);
                            this.survivorManager.modifyHealth(survivor.id, health);
                            this.resourceManager.modifyResource('morale', morale);
                            return this.localization.get('events.medical.outcomes.success', {
                                name: survivor.name,
                                medicine,
                                health,
                                morale
                            });
                        }
                        const health = 25, morale = 15;
                        this.survivorManager.modifyHealth(survivor.id, -health);
                        this.resourceManager.modifyResource('morale', -morale);
                        return this.localization.get('events.medical.outcomes.failure', {
                            name: survivor.name,
                            health,
                            morale
                        });
                    }
                },
                right: {
                    text: this.localization.get('events.medical.choices.alternative'),
                    consequences: () => {
                        const water = 20, food = 15, health = 15;
                        this.resourceManager.modifyResource('water', -water);
                        this.resourceManager.modifyResource('food', -food);
                        this.survivorManager.modifyHealth(survivor.id, health);
                        return this.localization.get('events.medical.outcomes.alternative', {
                            name: survivor.name,
                            water,
                            food,
                            health
                        });
                    }
                }
            }
        };
    }

    generateShelterEvent() {
        return {
            type: 'shelter',
            text: this.localization.get('events.shelter.title'),
            choices: {
                left: {
                    text: this.localization.get('events.shelter.choices.repair'),
                    consequences: () => {
                        const materials = 20, morale = 15;
                        this.resourceManager.modifyResource('materials', -materials);
                        this.resourceManager.modifyResource('morale', morale);
                        return this.localization.get('events.shelter.outcomes.success', {
                            materials,
                            morale
                        });
                    }
                },
                right: {
                    text: this.localization.get('events.shelter.choices.postpone'),
                    consequences: () => {
                        const randomLoss = Math.floor(Math.random() * 10) + 10;
                        const morale = 15;
                        this.resourceManager.modifyResource('food', -randomLoss);
                        this.resourceManager.modifyResource('medicine', -randomLoss);
                        this.resourceManager.modifyResource('morale', -morale);
                        return this.localization.get('events.shelter.outcomes.failure', {
                            food: randomLoss,
                            medicine: randomLoss,
                            morale
                        });
                    }
                }
            }
        };
    }

    generateMoraleEvent() {
        const survivor = this.survivorManager.getRandomSurvivor();
        return {
            type: 'morale',
            text: this.localization.get('events.morale.title', { name: survivor.name }),
            choices: {
                left: {
                    text: this.localization.get('events.morale.choices.organize'),
                    consequences: () => {
                        const food = 15, water = 15, morale = 25;
                        this.resourceManager.modifyResource('food', -food);
                        this.resourceManager.modifyResource('water', -water);
                        this.resourceManager.modifyResource('morale', morale);
                        return this.localization.get('events.morale.outcomes.success', {
                            food,
                            water,
                            morale
                        });
                    }
                },
                right: {
                    text: this.localization.get('events.morale.choices.focus'),
                    consequences: () => {
                        const morale = 20, food = 8, water = 8;
                        this.resourceManager.modifyResource('morale', -morale);
                        this.resourceManager.modifyResource('food', food);
                        this.resourceManager.modifyResource('water', water);
                        return this.localization.get('events.morale.outcomes.failure', {
                            morale,
                            food,
                            water
                        });
                    }
                }
            }
        };
    }

    triggerMisfortuneEvent() {
        const misfortuneEvents = [
            {
                text: this.localization.get('misfortune.storm.title'),
                consequences: () => {
                    this.resourceManager.modifyResource('materials', -25);
                    this.resourceManager.modifyResource('food', -20);
                    this.resourceManager.modifyResource('morale', -20);
                    return this.localization.get('misfortune.storm.outcome');
                }
            },
            {
                text: this.localization.get('misfortune.raiders.title'),
                consequences: () => {
                    this.resourceManager.modifyResource('medicine', -25);
                    this.resourceManager.modifyResource('food', -25);
                    this.resourceManager.modifyResource('morale', -25);
                    const survivor = this.survivorManager.getRandomSurvivor();
                    this.survivorManager.modifyHealth(survivor.id, -35);
                    return this.localization.get('misfortune.raiders.outcome', { name: survivor.name });
                }
            },
            {
                text: this.localization.get('misfortune.disease.title'),
                consequences: () => {
                    this.survivorManager.getAllSurvivors().forEach(survivor => {
                        this.survivorManager.modifyHealth(survivor.id, -20);
                    });
                    this.resourceManager.modifyResource('medicine', -30);
                    this.resourceManager.modifyResource('morale', -20);
                    return this.localization.get('misfortune.disease.outcome');
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
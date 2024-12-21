export class EventSystem {
    constructor(gameState, resourceManager, survivorManager, localization) {
        this.gameState = gameState;
        this.resourceManager = resourceManager;
        this.survivorManager = survivorManager;
        this.localization = localization;
        this.currentEvent = null;
    }

    // Helper function to check if survivor has relevant skills
    hasRelevantSkill(survivor, skills) {
        return survivor.skills.some(skill => skills.includes(skill.toLowerCase()));
    }

    // Helper function to calculate success chance based on skills
    calculateSuccessChance(survivor, skills, baseChance) {
        return this.hasRelevantSkill(survivor, skills) ? baseChance + 0.2 : baseChance;
    }

    generateNextEvent() {
        // Weight events based on current situation
        const events = [];
        const weights = [];
        
        // Add events with weights based on current situation
        const addEvent = (eventFn, weight) => {
            events.push(eventFn);
            weights.push(weight);
        };

        // Always include basic events with adjusted weights
        addEvent(this.generateScavengingEvent, 1.0); // Base scavenging event
        addEvent(this.generateMoraleEvent, 0.8);     // Slightly less frequent morale events

        // Add situational events with higher weights when resources are low
        if (this.resourceManager.getResource('medicine') < 30) {
            addEvent(this.generateTradeEvent, 1.5);
            addEvent(this.generateMedicalEvent, 1.2);
        }
        
        if (this.resourceManager.getResource('food') < 30 || 
            this.resourceManager.getResource('water') < 30) {
            addEvent(this.generateExplorationEvent, 1.5);
        }
        
        if (this.resourceManager.getResource('materials') < 30) {
            addEvent(this.generateShelterEvent, 1.3);
        }
        
        // Add social events with lower weights
        if (Math.random() > 0.6) {
            addEvent(this.generateCommunityEvent, 0.7);
            addEvent(this.generateConflictEvent, 0.6);
        }
        
        // Add defense event more often if resources are high
        if (this.resourceManager.getResource('food') > 70 || 
            this.resourceManager.getResource('medicine') > 70) {
            addEvent(this.generateDefenseEvent, 1.2);
        }
        
        // Add medical events if any survivor has low health
        if (this.survivorManager.getAllSurvivors().some(s => s.health < 70)) {
            addEvent(this.generateMedicalEvent, 1.4);
        }

        // Select event based on weights
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < events.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                this.currentEvent = events[i].call(this);
                return this.currentEvent;
            }
        }

        // Fallback to scavenging event
        this.currentEvent = this.generateScavengingEvent.call(this);
        return this.currentEvent;
    }

    generateScavengingEvent() {
        const survivor = this.survivorManager.getRandomSurvivor();
        const hasScavengingSkill = this.hasRelevantSkill(survivor, ['scavenging', 'stealth']);
        const successChance = this.calculateSuccessChance(survivor, ['scavenging', 'stealth'], 0.6);
        
        return {
            type: 'scavenging',
            text: this.localization.get('events.scavenging.title', { name: survivor.name }),
            choices: {
                left: {
                    text: this.localization.get('events.scavenging.choices.risk'),
                    consequences: () => {
                        const success = Math.random() < successChance;
                        if (success) {
                            const food = hasScavengingSkill ? 25 : 20;
                            const medicine = hasScavengingSkill ? 20 : 15;
                            const morale = 10;
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
                            const health = hasScavengingSkill ? 20 : 25;
                            const morale = 15;
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
                        const food = hasScavengingSkill ? 12 : 8;
                        const water = hasScavengingSkill ? 15 : 10;
                        const morale = 5;
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
        const hasNegotiationSkill = this.hasRelevantSkill(survivor, ['cooking', 'engineering']);
        
        return {
            type: 'trade',
            text: this.localization.get('events.trade.title', { name: survivor.name }),
            choices: {
                left: {
                    text: this.localization.get('events.trade.choices.accept'),
                    consequences: () => {
                        const food = hasNegotiationSkill ? 20 : 15;
                        const medicine = hasNegotiationSkill ? -8 : -10;
                        const materials = hasNegotiationSkill ? -8 : -10;
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
                        const morale = hasNegotiationSkill ? 5 : 10;
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
        const hasExplorationSkill = this.hasRelevantSkill(survivor, ['scavenging', 'stealth']);
        const successChance = this.calculateSuccessChance(survivor, ['scavenging', 'stealth'], 0.7);
        
        return {
            type: 'exploration',
            text: this.localization.get('events.exploration.title', { name: survivor.name }),
            choices: {
                left: {
                    text: this.localization.get('events.exploration.choices.explore'),
                    consequences: () => {
                        const success = Math.random() < successChance;
                        if (success) {
                            const materials = hasExplorationSkill ? 30 : 25;
                            const water = hasExplorationSkill ? 20 : 15;
                            const morale = 10;
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
                            const health = hasExplorationSkill ? 15 : 20;
                            const morale = 15;
                            const water = 10;
                            this.survivorManager.modifyHealth(survivor.id, -health);
                            this.resourceManager.modifyResource('morale', -morale);
                            this.resourceManager.modifyResource('water', -water);
                            return this.localization.get('events.exploration.outcomes.failure', {
                                name: survivor.name,
                                health,
                                morale,
                                water
                            });
                        }
                    }
                },
                right: {
                    text: this.localization.get('events.exploration.choices.stay'),
                    consequences: () => {
                        const materials = hasExplorationSkill ? 8 : 5;
                        const morale = 5;
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
        const combatSurvivors = this.survivorManager.getAllSurvivors()
            .filter(s => this.hasRelevantSkill(s, ['combat', 'stealth']));
        const hasCombatSkill = combatSurvivors.length > 0;
        const successChance = hasCombatSkill ? 0.7 : 0.5;
        
        return {
            type: 'defense',
            text: this.localization.get('events.defense.title'),
            choices: {
                left: {
                    text: this.localization.get('events.defense.choices.fight'),
                    consequences: () => {
                        const success = Math.random() < successChance;
                        if (success) {
                            const materials = hasCombatSkill ? 25 : 20;
                            const food = hasCombatSkill ? 20 : 15;
                            const morale = 15;
                            this.resourceManager.modifyResource('materials', materials);
                            this.resourceManager.modifyResource('food', food);
                            this.resourceManager.modifyResource('morale', morale);
                            return this.localization.get('events.defense.outcomes.success', {
                                materials,
                                food,
                                morale
                            });
                        } else {
                            const materials = hasCombatSkill ? -10 : -15;
                            const food = hasCombatSkill ? -8 : -10;
                            const morale = -20;
                            this.resourceManager.modifyResource('materials', materials);
                            this.resourceManager.modifyResource('food', food);
                            this.resourceManager.modifyResource('morale', morale);
                            const survivor = this.survivorManager.getRandomSurvivor();
                            const health = hasCombatSkill ? -20 : -30;
                            this.survivorManager.modifyHealth(survivor.id, health);
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
                        const stealthSuccess = this.survivorManager.getAllSurvivors()
                            .some(s => this.hasRelevantSkill(s, ['stealth']));
                        const food = stealthSuccess ? -10 : -15;
                        const medicine = stealthSuccess ? -8 : -10;
                        const morale = stealthSuccess ? -5 : -10;
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
        const hasSocialSkill = this.hasRelevantSkill(survivor1, ['cooking', 'medical']) || 
                              this.hasRelevantSkill(survivor2, ['cooking', 'medical']);
        
        return {
            type: 'community',
            text: this.localization.get('events.community.title', { name1: survivor1.name, name2: survivor2.name }),
            choices: {
                left: {
                    text: this.localization.get('events.community.choices.share'),
                    consequences: () => {
                        const food = hasSocialSkill ? -8 : -10;
                        const water = hasSocialSkill ? -8 : -10;
                        const morale = hasSocialSkill ? 25 : 20;
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
                        const morale = hasSocialSkill ? -10 : -15;
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
        const hasSocialSkill = this.hasRelevantSkill(survivor1, ['cooking', 'medical']) || 
                              this.hasRelevantSkill(survivor2, ['cooking', 'medical']);
        
        return {
            type: 'conflict',
            text: this.localization.get('events.conflict.title', { name1: survivor1.name, name2: survivor2.name }),
            choices: {
                left: {
                    text: this.localization.get('events.conflict.choices.side1', { name: survivor1.name }),
                    consequences: () => {
                        const morale = hasSocialSkill ? -10 : -15;
                        const relationshipDamage = hasSocialSkill ? -20 : -25;
                        this.survivorManager.modifyRelationship(survivor1.id, survivor2.id, relationshipDamage);
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
                        const morale = hasSocialSkill ? -10 : -15;
                        const relationshipDamage = hasSocialSkill ? -20 : -25;
                        this.survivorManager.modifyRelationship(survivor1.id, survivor2.id, relationshipDamage);
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
        const hasMedicalSkill = this.hasRelevantSkill(survivor, ['medical']);
        
        return {
            type: 'medical',
            text: this.localization.get('events.medical.title', { name: survivor.name }),
            choices: {
                left: {
                    text: this.localization.get('events.medical.choices.use'),
                    consequences: () => {
                        const requiredMedicine = hasMedicalSkill ? 12 : 15;
                        if (this.resourceManager.getResource('medicine') >= requiredMedicine) {
                            const medicine = requiredMedicine;
                            const health = hasMedicalSkill ? 35 : 30;
                            const morale = 10;
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
                        const health = hasMedicalSkill ? 20 : 25;
                        const morale = 15;
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
                        const water = hasMedicalSkill ? 15 : 20;
                        const food = hasMedicalSkill ? 12 : 15;
                        const health = hasMedicalSkill ? 20 : 15;
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
        const hasEngineer = this.survivorManager.getAllSurvivors()
            .some(s => this.hasRelevantSkill(s, ['engineering']));
        
        return {
            type: 'shelter',
            text: this.localization.get('events.shelter.title'),
            choices: {
                left: {
                    text: this.localization.get('events.shelter.choices.repair'),
                    consequences: () => {
                        const materials = hasEngineer ? 15 : 20;
                        const morale = hasEngineer ? 20 : 15;
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
                        const baseRandomLoss = Math.floor(Math.random() * 10) + 10;
                        const randomLoss = hasEngineer ? baseRandomLoss - 5 : baseRandomLoss;
                        const morale = hasEngineer ? 10 : 15;
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
        const hasSocialSkill = this.hasRelevantSkill(survivor, ['cooking', 'medical']);
        
        return {
            type: 'morale',
            text: this.localization.get('events.morale.title', { name: survivor.name }),
            choices: {
                left: {
                    text: this.localization.get('events.morale.choices.organize'),
                    consequences: () => {
                        const food = hasSocialSkill ? 12 : 15;
                        const water = hasSocialSkill ? 12 : 15;
                        const morale = hasSocialSkill ? 30 : 25;
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
                        const morale = hasSocialSkill ? -15 : -20;
                        const food = hasSocialSkill ? 10 : 8;
                        const water = hasSocialSkill ? 10 : 8;
                        this.resourceManager.modifyResource('morale', morale);
                        this.resourceManager.modifyResource('food', food);
                        this.resourceManager.modifyResource('water', water);
                        return this.localization.get('events.morale.outcomes.failure', {
                            morale: -morale,
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
                    const hasEngineer = this.survivorManager.getAllSurvivors()
                        .some(s => this.hasRelevantSkill(s, ['engineering']));
                    const materialLoss = hasEngineer ? -20 : -25;
                    const foodLoss = hasEngineer ? -15 : -20;
                    const moraleLoss = hasEngineer ? -15 : -20;
                    
                    this.resourceManager.modifyResource('materials', materialLoss);
                    this.resourceManager.modifyResource('food', foodLoss);
                    this.resourceManager.modifyResource('morale', moraleLoss);
                    return this.localization.get('misfortune.storm.outcome');
                }
            },
            {
                text: this.localization.get('misfortune.raiders.title'),
                consequences: () => {
                    const hasCombat = this.survivorManager.getAllSurvivors()
                        .some(s => this.hasRelevantSkill(s, ['combat']));
                    const medicineLoss = hasCombat ? -20 : -25;
                    const foodLoss = hasCombat ? -20 : -25;
                    const moraleLoss = hasCombat ? -20 : -25;
                    
                    this.resourceManager.modifyResource('medicine', medicineLoss);
                    this.resourceManager.modifyResource('food', foodLoss);
                    this.resourceManager.modifyResource('morale', moraleLoss);
                    
                    const survivor = this.survivorManager.getRandomSurvivor();
                    const healthLoss = hasCombat ? -25 : -35;
                    this.survivorManager.modifyHealth(survivor.id, healthLoss);
                    return this.localization.get('misfortune.raiders.outcome', { name: survivor.name });
                }
            },
            {
                text: this.localization.get('misfortune.disease.title'),
                consequences: () => {
                    const hasMedical = this.survivorManager.getAllSurvivors()
                        .some(s => this.hasRelevantSkill(s, ['medical']));
                    const healthLoss = hasMedical ? -15 : -20;
                    const medicineLoss = hasMedical ? -25 : -30;
                    const moraleLoss = hasMedical ? -15 : -20;
                    
                    this.survivorManager.getAllSurvivors().forEach(survivor => {
                        this.survivorManager.modifyHealth(survivor.id, healthLoss);
                    });
                    this.resourceManager.modifyResource('medicine', medicineLoss);
                    this.resourceManager.modifyResource('morale', moraleLoss);
                    return this.localization.get('misfortune.disease.outcome');
                }
            }
        ];

        const event = misfortuneEvents[Math.floor(Math.random() * misfortuneEvents.length)];
        const result = event.consequences();
        
        if (!this.survivorManager.hasSurvivors() || this.resourceManager.hasExtremeResources()) {
            this.gameState.setGameOver();
        }

        return result;
    }

    resolveChoice(choice) {
        if (!this.currentEvent) return null;
        
        const result = this.currentEvent.choices[choice].consequences();
        
        if (!this.survivorManager.hasSurvivors() || this.resourceManager.hasExtremeResources()) {
            this.gameState.setGameOver();
        }

        return result;
    }
} 
export class SurvivorManager {
    constructor() {
        this.survivors = [
            {
                id: 1,
                name: "Sarah",
                health: 100,
                skills: ["medical", "cooking"],
                backstory: "Former nurse who lost her family in the initial attacks.",
                relationships: {}
            },
            {
                id: 2,
                name: "Marcus",
                health: 100,
                skills: ["combat", "engineering"],
                backstory: "Ex-military engineer with PTSD from recent conflicts.",
                relationships: {}
            },
            {
                id: 3,
                name: "Elena",
                health: 100,
                skills: ["scavenging", "stealth"],
                backstory: "Street-smart teenager who survived on her own for months.",
                relationships: {}
            }
        ];

        // Initialize relationships
        this.initializeRelationships();
    }

    initializeRelationships() {
        this.survivors.forEach(survivor => {
            this.survivors.forEach(other => {
                if (survivor.id !== other.id) {
                    survivor.relationships[other.id] = 0; // Neutral relationship
                }
            });
        });
    }

    getSurvivor(id) {
        return this.survivors.find(s => s.id === id);
    }

    getAllSurvivors() {
        return [...this.survivors];
    }

    modifyHealth(id, amount) {
        const survivor = this.getSurvivor(id);
        if (survivor) {
            survivor.health = Math.max(0, Math.min(100, survivor.health + amount));
            if (survivor.health <= 0) {
                this.removeSurvivor(id);
            }
            return survivor.health;
        }
        return 0;
    }

    modifyRelationship(id1, id2, amount) {
        const survivor1 = this.getSurvivor(id1);
        const survivor2 = this.getSurvivor(id2);
        
        if (survivor1 && survivor2) {
            survivor1.relationships[id2] = Math.max(-100, Math.min(100, survivor1.relationships[id2] + amount));
            survivor2.relationships[id1] = Math.max(-100, Math.min(100, survivor2.relationships[id1] + amount));
        }
    }

    removeSurvivor(id) {
        const index = this.survivors.findIndex(s => s.id === id);
        if (index !== -1) {
            this.survivors.splice(index, 1);
            // Update relationships
            this.survivors.forEach(survivor => {
                delete survivor.relationships[id];
            });
        }
    }

    hasSurvivors() {
        return this.survivors.length > 0;
    }

    getRandomSurvivor() {
        if (this.survivors.length === 0) return null;
        return this.survivors[Math.floor(Math.random() * this.survivors.length)];
    }

    getRandomSurvivorPair() {
        if (this.survivors.length < 2) return null;
        const survivor1 = this.getRandomSurvivor();
        let survivor2;
        do {
            survivor2 = this.getRandomSurvivor();
        } while (survivor2.id === survivor1.id);
        return [survivor1, survivor2];
    }
} 
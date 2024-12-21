import { SurvivorGenerator } from './survivorGenerator.js';

export class SurvivorManager {
    constructor() {
        this.survivors = [];
        this.generator = new SurvivorGenerator();
        this.initializeSurvivors();
    }

    initializeSurvivors() {
        this.survivors = this.generator.generateInitialSurvivors();
    }

    getAllSurvivors() {
        return this.survivors;
    }

    getSurvivor(id) {
        return this.survivors.find(s => s.id === id);
    }

    getRandomSurvivor() {
        return this.survivors[Math.floor(Math.random() * this.survivors.length)];
    }

    getRandomSurvivorPair() {
        const firstIndex = Math.floor(Math.random() * this.survivors.length);
        let secondIndex;
        do {
            secondIndex = Math.floor(Math.random() * this.survivors.length);
        } while (secondIndex === firstIndex);

        return [this.survivors[firstIndex], this.survivors[secondIndex]];
    }

    modifyHealth(id, amount) {
        const survivor = this.getSurvivor(id);
        if (survivor) {
            survivor.health = Math.max(0, Math.min(100, survivor.health + amount));
            if (survivor.health <= 0) {
                this.removeSurvivor(id);
            }
        }
    }

    modifyRelationship(id1, id2, amount) {
        const survivor1 = this.getSurvivor(id1);
        const survivor2 = this.getSurvivor(id2);
        
        if (survivor1 && survivor2) {
            survivor1.relationships[id2] = Math.max(0, Math.min(100, 
                (survivor1.relationships[id2] || 0) + amount));
            survivor2.relationships[id1] = Math.max(0, Math.min(100, 
                (survivor2.relationships[id1] || 0) + amount));
        }
    }

    removeSurvivor(id) {
        const index = this.survivors.findIndex(s => s.id === id);
        if (index !== -1) {
            this.survivors.splice(index, 1);
            // Remove relationships with this survivor
            this.survivors.forEach(survivor => {
                delete survivor.relationships[id];
            });
        }
    }

    hasSurvivors() {
        return this.survivors.length > 0;
    }

    addNewSurvivor() {
        const newId = Math.max(...this.survivors.map(s => s.id), 0) + 1;
        const newSurvivor = this.generator.generateSurvivor(newId);
        
        // Initialize relationships with existing survivors
        this.survivors.forEach(survivor => {
            const initialRelationship = Math.floor(Math.random() * 51); // 0-50
            survivor.relationships[newId] = initialRelationship;
            newSurvivor.relationships[survivor.id] = initialRelationship;
        });

        this.survivors.push(newSurvivor);
        return newSurvivor;
    }

    getSurvivorDetails(id) {
        const survivor = this.getSurvivor(id);
        if (!survivor) return null;

        return {
            id: survivor.id,
            name: survivor.name,
            background: survivor.background,
            trait: survivor.trait,
            health: survivor.health,
            skills: survivor.skills,
            relationships: Object.entries(survivor.relationships).map(([otherId, value]) => ({
                with: this.getSurvivor(parseInt(otherId)).name,
                value
            }))
        };
    }
} 
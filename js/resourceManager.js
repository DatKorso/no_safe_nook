export class ResourceManager {
    constructor() {
        this.resources = {
            food: 50,
            water: 50,
            medicine: 50,
            materials: 50,
            morale: 50
        };

        this.dailyConsumption = {
            food: 3,
            water: 5,
            medicine: 2,
            materials: 1,
            morale: 2
        };
    }

    getResource(type) {
        return this.resources[type];
    }

    modifyResource(type, amount) {
        const newValue = Math.max(0, Math.min(100, this.resources[type] + amount));
        this.resources[type] = newValue;
        return newValue;
    }

    consumeDailyResources() {
        for (const [resource, amount] of Object.entries(this.dailyConsumption)) {
            this.modifyResource(resource, -amount);
        }
    }

    hasExtremeResources() {
        return Object.values(this.resources).some(amount => amount <= 0 || amount >= 100);
    }

    getResourceStatus() {
        return { ...this.resources };
    }

    getExtremeResourcesDescription() {
        const extremes = [];
        for (const [resource, amount] of Object.entries(this.resources)) {
            if (amount <= 0) {
                extremes.push(`${resource} depleted`);
            } else if (amount >= 100) {
                extremes.push(`${resource} overflow`);
            }
        }
        return extremes.join(', ');
    }
} 
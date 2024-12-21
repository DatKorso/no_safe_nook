export class ResourceManager {
    constructor() {
        this.resources = {
            food: 50,
            water: 50,
            medicine: 50,
            materials: 50,
            morale: 50
        };
    }

    initialize() {
        this.resources = {
            food: 50,
            water: 50,
            medicine: 50,
            materials: 50,
            morale: 50
        };
    }

    getResource(type) {
        return this.resources[type];
    }

    modifyResource(type, amount) {
        if (this.resources[type] !== undefined) {
            this.resources[type] = Math.max(0, Math.min(100, this.resources[type] + amount));
        }
    }

    consumeDailyResources() {
        // Base consumption rates (adjusted to be more forgiving)
        const baseConsumption = {
            food: -3,
            water: -4,
            medicine: -1,
            materials: -2,
            morale: -2
        };

        // Apply consumption with dynamic adjustments
        Object.entries(baseConsumption).forEach(([resource, amount]) => {
            let finalAmount = amount;

            // Adjust consumption based on current levels
            if (this.resources[resource] < 30) {
                // Reduce consumption when resources are low
                finalAmount = Math.floor(amount * 0.7);
            } else if (this.resources[resource] > 80) {
                // Increase consumption when resources are abundant
                finalAmount = Math.floor(amount * 1.3);
            }

            // Special morale adjustments
            if (resource === 'morale') {
                // Morale drops faster when other resources are low
                const criticalResources = Object.entries(this.resources)
                    .filter(([key, value]) => key !== 'morale' && value < 30).length;
                finalAmount -= criticalResources;

                // Morale improves slightly when resources are abundant
                const abundantResources = Object.entries(this.resources)
                    .filter(([key, value]) => key !== 'morale' && value > 70).length;
                finalAmount += Math.floor(abundantResources * 0.5);
            }

            this.modifyResource(resource, finalAmount);
        });
    }

    hasExtremeResources() {
        return Object.values(this.resources).some(value => value <= 0 || value >= 100);
    }

    getExtremeResourcesDescription() {
        const extremes = [];
        Object.entries(this.resources).forEach(([resource, value]) => {
            if (value <= 0) {
                extremes.push(`${resource} depleted`);
            } else if (value >= 100) {
                extremes.push(`${resource} overflow`);
            }
        });
        return extremes.join(', ');
    }
} 
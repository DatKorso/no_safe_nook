export default {
    // UI elements
    ui: {
        title: "No Safe Nook",
        day: "Day",
        week: "Week",
        resources: {
            food: "Food",
            water: "Water",
            medicine: "Medicine",
            materials: "Materials",
            morale: "Morale"
        },
        survivors: "Survivors",
        health: "Health",
        skills: "Skills",
        relationships: "Relationships"
    },

    // Skills
    skills: {
        medical: "Medical",
        cooking: "Cooking",
        combat: "Combat",
        engineering: "Engineering",
        scavenging: "Scavenging",
        stealth: "Stealth"
    },

    // Events
    events: {
        welcome: "Welcome to No Safe Nook. Your journey of survival begins...",
        scavenging: {
            title: "{name} has found a potentially dangerous building to scavenge. It might contain valuable supplies, but the structure looks unstable.",
            choices: {
                risk: "Risk entering the building",
                safe: "Look for a safer location"
            },
            outcomes: {
                success: "{name} successfully found supplies! Food +{food}, Medicine +{medicine}, Morale +{morale}",
                injury: "{name} was injured by falling debris. Health -{health}, Morale -{morale}",
                small: "{name} found small amounts of supplies but feels discouraged. Food +{food}, Water +{water}, Morale -{morale}"
            }
        },
        trade: {
            title: "{name} has encountered a group of traders offering food in exchange for medicine and materials.",
            choices: {
                accept: "Accept the trade",
                decline: "Decline the offer"
            },
            outcomes: {
                success: "Trade completed. Food +{food}, Medicine -{medicine}, Materials -{materials}",
                decline: "The traders leave. Morale -{morale}"
            }
        },
        exploration: {
            title: "{name} has discovered a new area that might have valuable resources, but it's far from the shelter.",
            choices: {
                explore: "Send an exploration team",
                stay: "Stay close to shelter"
            },
            outcomes: {
                success: "{name}'s team found a resource cache! Materials +{materials}, Water +{water}, Morale +{morale}",
                failure: "{name} got lost and injured. Health -{health}, Water -{water}, Morale -{morale}",
                stay: "Found some materials nearby. Materials +{materials}, Morale -{morale}"
            }
        },
        defense: {
            title: "A small group of raiders is approaching the shelter. They haven't noticed us yet.",
            choices: {
                fight: "Prepare for combat",
                hide: "Hide and wait it out"
            },
            outcomes: {
                success: "Successfully defended the shelter and salvaged their supplies! Materials +{materials}, Food +{food}, Morale +{morale}",
                failure: "The defense failed. {name} was injured, and we lost supplies. Materials -{materials}, Food -{food}, Morale -{morale}",
                hide: "They took some supplies but left. Food -{food}, Medicine -{medicine}, Morale -{morale}"
            }
        },
        community: {
            title: "{name1} and {name2} want to share resources with a nearby family in need.",
            choices: {
                share: "Share our supplies",
                hoard: "Keep everything for ourselves"
            },
            outcomes: {
                share: "The sharing strengthened community bonds. Food -{food}, Water -{water}, Morale +{morale}",
                hoard: "The decision created tension in the group. Morale -{morale}"
            }
        },
        conflict: {
            title: "{name1} and {name2} are arguing over resource distribution.",
            choices: {
                side1: "Support {name}'s position",
                side2: "Support {name}'s position"
            },
            outcomes: {
                result: "{name} is upset but resources are better managed. Relationship decreased, Morale -{morale}"
            }
        },
        medical: {
            title: "{name} has fallen ill and needs medicine.",
            choices: {
                use: "Use medicine to treat them",
                alternative: "Use alternative treatment"
            },
            outcomes: {
                success: "{name} was treated successfully. Medicine -{medicine}, Health +{health}, Morale +{morale}",
                failure: "No medicine available. {name}'s health deteriorates. Health -{health}, Morale -{morale}",
                alternative: "{name} recovers slowly. Water -{water}, Food -{food}, Health +{health}"
            }
        },
        shelter: {
            title: "The shelter needs repairs. Ignoring it risks resource loss, but repairs require materials.",
            choices: {
                repair: "Repair the shelter",
                postpone: "Postpone repairs"
            },
            outcomes: {
                success: "Shelter repaired successfully. Materials -{materials}, Morale +{morale}",
                failure: "Poor shelter conditions affected supplies. Food -{food}, Medicine -{medicine}, Morale -{morale}"
            }
        },
        morale: {
            title: "{name} suggests organizing a group activity to boost morale, but it will consume some resources.",
            choices: {
                organize: "Organize the activity",
                focus: "Focus on survival"
            },
            outcomes: {
                success: "The activity improved everyone's spirits! Food -{food}, Water -{water}, Morale +{morale}",
                failure: "The group feels dejected but saved resources. Morale -{morale}, Food +{food}, Water +{water}"
            }
        }
    },

    // Misfortune events
    misfortune: {
        storm: {
            title: "A violent storm has damaged the shelter!",
            outcome: "Storm damage has affected resources and morale!"
        },
        raiders: {
            title: "Raiders have attacked the shelter!",
            outcome: "Raiders stole supplies and {name} was injured!"
        },
        disease: {
            title: "A disease outbreak has occurred!",
            outcome: "Disease has spread through the group!"
        }
    },

    // Game over messages
    gameOver: {
        title: "Game Over!",
        survived: "Your group survived for {days} days ({weeks} weeks).",
        reasons: {
            noSurvivors: "All survivors have perished...",
            resources: "Resource management crisis: {reason}"
        },
        restart: "Click OK to restart."
    }
}; 
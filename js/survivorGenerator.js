export class SurvivorGenerator {
    constructor() {
        this.firstNames = [
            // Russian names
            'Ivan', 'Dmitri', 'Mikhail', 'Alexei', 'Nikolai', 'Vladimir', 'Boris',
            'Elena', 'Natasha', 'Olga', 'Anna', 'Maria', 'Tatiana', 'Sofia',
            // English names
            'James', 'John', 'Michael', 'William', 'David', 'Robert', 'Thomas',
            'Emma', 'Sarah', 'Emily', 'Alice', 'Lucy', 'Grace', 'Sophie'
        ];

        this.lastNames = [
            // Russian surnames
            'Ivanov', 'Petrov', 'Smirnov', 'Kuznetsov', 'Popov', 'Sokolov', 'Lebedev',
            'Ivanova', 'Petrova', 'Smirnova', 'Kuznetsova', 'Popova', 'Sokolova', 'Lebedeva',
            // English surnames
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis',
            'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris'
        ];

        this.backgrounds = [
            'Former Military', 'Doctor', 'Engineer', 'Chef', 'Police Officer', 'Teacher',
            'Mechanic', 'Nurse', 'Construction Worker', 'Hunter', 'Farmer', 'Security Guard',
            'Paramedic', 'Firefighter', 'Survivalist', 'Scout'
        ];

        this.traits = [
            'Optimistic', 'Pessimistic', 'Brave', 'Cautious', 'Leader', 'Follower',
            'Resourceful', 'Innovative', 'Protective', 'Independent', 'Team Player',
            'Quick Learner', 'Determined', 'Adaptable', 'Patient', 'Impulsive'
        ];
    }

    generateSkills(background) {
        const allSkills = ['medical', 'cooking', 'combat', 'engineering', 'scavenging', 'stealth'];
        const skills = [];

        // Assign primary skill based on background
        switch (background) {
            case 'Former Military':
            case 'Police Officer':
                skills.push('combat');
                break;
            case 'Doctor':
            case 'Nurse':
            case 'Paramedic':
                skills.push('medical');
                break;
            case 'Engineer':
            case 'Mechanic':
                skills.push('engineering');
                break;
            case 'Chef':
                skills.push('cooking');
                break;
            case 'Hunter':
            case 'Survivalist':
            case 'Scout':
                skills.push('scavenging');
                break;
            case 'Security Guard':
                skills.push('stealth');
                break;
            default:
                skills.push(allSkills[Math.floor(Math.random() * allSkills.length)]);
        }

        // Add 1-2 random additional skills
        const remainingSkills = allSkills.filter(skill => !skills.includes(skill));
        const additionalSkillCount = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < additionalSkillCount && remainingSkills.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * remainingSkills.length);
            skills.push(remainingSkills.splice(randomIndex, 1)[0]);
        }

        return skills;
    }

    generateHealth() {
        // Generate random health between 70 and 100
        return Math.floor(Math.random() * 31) + 70;
    }

    generateSurvivor(id) {
        const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
        const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
        const background = this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
        const trait = this.traits[Math.floor(Math.random() * this.traits.length)];
        
        return {
            id,
            name: `${firstName} ${lastName}`,
            background,
            trait,
            health: this.generateHealth(),
            skills: this.generateSkills(background),
            relationships: {}
        };
    }

    generateInitialSurvivors(count = 4) {
        const survivors = [];
        const usedNames = new Set();

        for (let i = 0; i < count; i++) {
            let survivor;
            do {
                survivor = this.generateSurvivor(i + 1);
            } while (usedNames.has(survivor.name));

            usedNames.add(survivor.name);
            survivors.push(survivor);
        }

        // Initialize relationships between survivors
        survivors.forEach(survivor => {
            survivors.forEach(other => {
                if (survivor.id !== other.id) {
                    // Generate random initial relationship value between 0 and 50
                    survivor.relationships[other.id] = Math.floor(Math.random() * 51);
                }
            });
        });

        // Ensure balanced skill distribution
        const allSkills = ['medical', 'cooking', 'combat', 'engineering', 'scavenging', 'stealth'];
        const missingCriticalSkills = allSkills.filter(skill => 
            !survivors.some(survivor => survivor.skills.includes(skill))
        );

        if (missingCriticalSkills.length > 0) {
            // Add missing critical skills to random survivors
            missingCriticalSkills.forEach(skill => {
                const randomSurvivor = survivors[Math.floor(Math.random() * survivors.length)];
                if (randomSurvivor.skills.length > 2) {
                    randomSurvivor.skills.pop();
                }
                randomSurvivor.skills.push(skill);
            });
        }

        return survivors;
    }
} 
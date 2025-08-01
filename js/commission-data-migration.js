/**
 * Commission Data Migration Script
 * Converts existing commission data to match CSV format
 * Use this to migrate from old structure to new CSV-based structure
 */

class CommissionDataMigration {
    constructor() {
        this.firebaseSystem = null;
    }

    async init() {
        // Wait for Firebase system to be ready
        while (!window.firebaseCommissionSystem) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.firebaseSystem = window.firebaseCommissionSystem;
        console.log('🔄 Commission Data Migration ready');
    }

    async migrateToCSVFormat() {
        if (!this.firebaseSystem) {
            console.error('❌ Firebase system not ready');
            return;
        }

        console.log('🔄 Starting commission data migration to CSV format...');
        
        const commissions = this.firebaseSystem.getAllCommissions();
        let migrationCount = 0;

        for (const commission of commissions) {
            try {
                const migratedData = this.convertToCSVFormat(commission);
                
                // Only update if there are changes needed
                if (this.needsMigration(commission)) {
                    await this.firebaseSystem.updateCommission(commission.id, migratedData);
                    migrationCount++;
                    console.log(`✅ Migrated commission ${commission.id}`);
                }
            } catch (error) {
                console.error(`❌ Failed to migrate commission ${commission.id}:`, error);
            }
        }

        console.log(`🎉 Migration complete! Migrated ${migrationCount} commissions.`);
        return migrationCount;
    }

    convertToCSVFormat(commission) {
        return {
            // New CSV-based fields
            artist: commission.artist || 'TBD',
            dateOfCommission: commission.dateOfCommission || commission.dateCommissioned || null,
            descriptionOfCommission: commission.descriptionOfCommission || commission.title || commission.description || 'Commission',
            cost: commission.cost || 0,
            type: this.mapCommissionType(commission.type),
            status: this.mapCommissionStatus(commission.status),
            characters: commission.characters || [],
            
            // Keep existing fields for backward compatibility
            title: commission.title || commission.descriptionOfCommission || 'Commission',
            description: commission.description || commission.descriptionOfCommission || '',
            progress: commission.progress || 0,
            isPublic: commission.isPublic !== false,
            
            // Keep metadata
            lastUpdate: commission.lastUpdate || new Date().toISOString(),
            id: commission.id
        };
    }

    mapCommissionType(oldType) {
        const typeMapping = {
            'Character Portrait': 'Headshot',
            'Scene Art': 'Full-Body',
            'Icon/Avatar': 'Headshot',
            'Concept Art': 'Full-Body',
            'Reference Sheet': 'Multi-Character',
            'Custom': 'Full-Body'
        };
        
        return typeMapping[oldType] || oldType || 'Full-Body';
    }

    mapCommissionStatus(status) {
        const statusMapping = {
            'planning': 'Planning',
            'queued': 'Queued',
            'in-progress': 'In Progress',
            'review': 'Review',
            'revisions': 'Revisions',
            'completed': 'Complete',
            'delivered': 'Complete',
            'on-hold': 'In Progress',
            'cancelled': 'Complete'
        };
        
        return statusMapping[status] || status || 'In Progress';
    }

    needsMigration(commission) {
        // Check if commission needs migration to CSV format
        return !commission.descriptionOfCommission || 
               !commission.dateOfCommission || 
               typeof commission.cost === 'undefined';
    }

    async importFromCSVData(csvData) {
        if (!this.firebaseSystem) {
            console.error('❌ Firebase system not ready');
            return;
        }

        console.log('📥 Importing commission data from CSV...');
        
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        let importCount = 0;

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            try {
                const values = this.parseCSVLine(line);
                const commissionData = this.csvRowToCommission(headers, values);
                
                if (commissionData.artist && commissionData.descriptionOfCommission) {
                    await this.firebaseSystem.addCommission(commissionData);
                    importCount++;
                    console.log(`✅ Imported commission: ${commissionData.descriptionOfCommission}`);
                }
            } catch (error) {
                console.error(`❌ Failed to import CSV line ${i}:`, error);
            }
        }

        console.log(`🎉 CSV import complete! Imported ${importCount} commissions.`);
        return importCount;
    }

    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        values.push(current.trim());
        return values;
    }

    csvRowToCommission(headers, values) {
        const commission = {
            artist: '',
            dateOfCommission: null,
            descriptionOfCommission: '',
            cost: 0,
            character: 'Unknown',
            type: 'Full-Body',
            status: 'In Progress',
            characters: [],
            progress: 0,
            isPublic: true,
            lastUpdate: new Date().toISOString()
        };

        headers.forEach((header, index) => {
            const value = values[index] || '';
            
            switch (header.toLowerCase()) {
                case 'artist':
                    commission.artist = value || 'TBD';
                    break;
                case 'date of commission':
                    commission.dateOfCommission = this.parseDate(value);
                    break;
                case 'description of commission':
                    commission.descriptionOfCommission = value;
                    commission.title = value; // Backward compatibility
                    commission.description = value;
                    break;
                case 'cost':
                    commission.cost = this.parseCost(value);
                    break;
                case 'type':
                    commission.type = value || 'Full-Body';
                    break;
                case 'status':
                    commission.status = this.normalizeStatus(value);
                    break;
            }
        });

        // Extract characters from description and set primary character
        const extractedChars = this.extractCharacters(commission.descriptionOfCommission);
        commission.character = extractedChars[0] || 'Unknown';
        commission.characters = extractedChars;
        
        return commission;
    }

    parseDate(dateStr) {
        if (!dateStr) return null;
        
        try {
            const date = new Date(dateStr);
            return date.toISOString().split('T')[0]; // YYYY-MM-DD format
        } catch {
            return null;
        }
    }

    parseCost(costStr) {
        if (!costStr) return 0;
        
        const cleaned = costStr.toString().replace(/[$,]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    }

    normalizeStatus(status) {
        const normalized = status.toLowerCase().replace(/\s+/g, '-');
        const validStatuses = ['planning', 'queued', 'in-progress', 'review', 'revisions', 'completed', 'delivered', 'on-hold', 'cancelled'];
        
        if (normalized.includes('progress') || normalized.includes('pending')) return 'in-progress';
        if (normalized.includes('complete')) return 'completed';
        if (normalized.includes('payment')) return 'queued';
        
        return validStatuses.includes(normalized) ? normalized : 'in-progress';
    }

    extractCharacters(description) {
        const commonCharacters = ['Darla', 'Ariella', 'Caelielle', 'Aridoe', 'Ari-Doe', 'A.R.I.E.L.L.A'];
        const found = [];
        
        for (const char of commonCharacters) {
            if (description.toLowerCase().includes(char.toLowerCase())) {
                found.push(char);
            }
        }
        
        return found.length > 0 ? found : ['Unknown'];
    }
}

// Export for use in console or other scripts
window.CommissionDataMigration = CommissionDataMigration;

console.log('📋 Commission Data Migration script loaded. Use:');
console.log('const migration = new CommissionDataMigration();');
console.log('await migration.init();');
console.log('await migration.migrateToCSVFormat();');

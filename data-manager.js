class DataManager {
    constructor() {
        this.storage = window.localStorage;
        this.keys = CONFIG.storage.keys;
        this.maxRecords = CONFIG.storage.maxRecords;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveSpeedRecord(record) {
        const history = this.getSpeedHistory();
        const newRecord = {
            id: this.generateId(),
            timestamp: Date.now(),
            ...record
        };
        history.unshift(newRecord);
        if (history.length > this.maxRecords) {
            history.pop();
        }
        this.storage.setItem(this.keys.speedHistory, JSON.stringify(history));
        return newRecord;
    }

    getSpeedHistory(limit = null) {
        try {
            const data = this.storage.getItem(this.keys.speedHistory);
            const history = data ? JSON.parse(data) : [];
            return limit ? history.slice(0, limit) : history;
        } catch (e) {
            console.error('Error reading speed history:', e);
            return [];
        }
    }

    saveLatencyRecord(record) {
        const history = this.getLatencyHistory();
        const newRecord = {
            id: this.generateId(),
            timestamp: Date.now(),
            ...record
        };
        history.unshift(newRecord);
        if (history.length > this.maxRecords) {
            history.pop();
        }
        this.storage.setItem(this.keys.latencyHistory, JSON.stringify(history));
        return newRecord;
    }

    getLatencyHistory(limit = null) {
        try {
            const data = this.storage.getItem(this.keys.latencyHistory);
            const history = data ? JSON.parse(data) : [];
            return limit ? history.slice(0, limit) : history;
        } catch (e) {
            console.error('Error reading latency history:', e);
            return [];
        }
    }

    clearSpeedHistory() {
        this.storage.removeItem(this.keys.speedHistory);
    }

    clearLatencyHistory() {
        this.storage.removeItem(this.keys.latencyHistory);
    }

    clearAllHistory() {
        this.clearSpeedHistory();
        this.clearLatencyHistory();
    }

    getSettings() {
        try {
            const data = this.storage.getItem(this.keys.settings);
            return data ? JSON.parse(data) : this.getDefaultSettings();
        } catch (e) {
            console.error('Error reading settings:', e);
            return this.getDefaultSettings();
        }
    }

    getDefaultSettings() {
        return {
            theme: 'dark',
            autoSave: true,
            soundEnabled: false
        };
    }

    saveSettings(settings) {
        this.storage.setItem(this.keys.settings, JSON.stringify(settings));
    }

    exportData() {
        return {
            speedHistory: this.getSpeedHistory(),
            latencyHistory: this.getLatencyHistory(),
            settings: this.getSettings(),
            exportTime: new Date().toISOString()
        };
    }

    importData(data) {
        if (data.speedHistory) {
            this.storage.setItem(this.keys.speedHistory, JSON.stringify(data.speedHistory));
        }
        if (data.latencyHistory) {
            this.storage.setItem(this.keys.latencyHistory, JSON.stringify(data.latencyHistory));
        }
        if (data.settings) {
            this.storage.setItem(this.keys.settings, JSON.stringify(data.settings));
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}

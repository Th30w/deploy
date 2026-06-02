class LatencyTestEngine {
    constructor() {
        this.categories = CONFIG.appCategories;
        this.testResults = {};
        this.listeners = {
            progress: [],
            complete: [],
            error: []
        };
    }

    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    async testSingleApp(app) {
        try {
            const latency = await this.measureLatencyWithRetry(app.endpoint, 3);
            const result = {
                app: app.name,
                icon: app.icon,
                category: this.getCategoryName(app),
                latency: latency,
                status: this.getLatencyStatus(latency),
                timestamp: Date.now()
            };

            this.testResults[app.name] = result;
            return result;
        } catch (e) {
            console.error(`Failed to test ${app.name}:`, e);
            return {
                app: app.name,
                icon: app.icon,
                category: this.getCategoryName(app),
                latency: -1,
                status: 'error',
                timestamp: Date.now(),
                error: e.message
            };
        }
    }

    async measureLatency(url) {
        return new Promise((resolve) => {
            const startTime = performance.now();
            const timeout = setTimeout(() => {
                resolve(5000);
            }, 5000);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            fetch(url, {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-store',
                signal: controller.signal
            })
            .then(() => {
                clearTimeout(timeout);
                clearTimeout(timeoutId);
                const endTime = performance.now();
                resolve(Math.round(endTime - startTime));
            })
            .catch((e) => {
                clearTimeout(timeout);
                clearTimeout(timeoutId);
                const endTime = performance.now();
                const elapsed = Math.round(endTime - startTime);
                if (elapsed >= 5000) {
                    resolve(5000);
                } else {
                    resolve(elapsed);
                }
            });
        });
    }

    async measureLatencyWithRetry(url, retries = 2) {
        let minLatency = 5000;
        
        for (let i = 0; i < retries; i++) {
            const latency = await this.measureLatency(url);
            if (latency < minLatency) {
                minLatency = latency;
            }
            if (i < retries - 1) {
                await new Promise(r => setTimeout(r, 100));
            }
        }
        
        return minLatency;
    }

    async testCategory(category) {
        const apps = this.categories[category];
        if (!apps) {
            throw new Error(`Unknown category: ${category}`);
        }

        const results = [];
        this.emit('progress', {
            category: category,
            message: `开始测试${this.getCategoryDisplayName(category)}...`
        });

        for (const app of apps) {
            const result = await this.testSingleApp(app);
            results.push(result);
            this.emit('progress', {
                category: category,
                current: app.name,
                latency: result.latency,
                status: result.status
            });
        }

        this.emit('complete', {
            category: category,
            results: results
        });

        return results;
    }

    async testAll() {
        const allResults = {};
        const categories = Object.keys(this.categories);

        for (const category of categories) {
            this.emit('progress', {
                category: category,
                message: `正在测试${this.getCategoryDisplayName(category)}...`
            });

            const results = await this.testCategory(category);
            allResults[category] = results;
        }

        this.emit('complete', { results: allResults });
        return allResults;
    }

    getCategoryName(app) {
        for (const [category, apps] of Object.entries(this.categories)) {
            if (apps.includes(app)) {
                return category;
            }
        }
        return 'unknown';
    }

    getCategoryDisplayName(category) {
        const displayNames = {
            games: '游戏',
            video: '视频',
            social: '社交',
            ecommerce: '电商',
            cloud: '云服务'
        };
        return displayNames[category] || category;
    }

    getLatencyStatus(latency) {
        if (latency < 0) return 'error';
        if (latency <= 20) return 'excellent';
        if (latency <= 50) return 'good';
        if (latency <= 100) return 'fair';
        return 'poor';
    }

    getLatencyRating(latency) {
        const status = this.getLatencyStatus(latency);
        const ratings = {
            excellent: { label: '极好', color: '#10B981' },
            good: { label: '良好', color: '#3B82F6' },
            fair: { label: '一般', color: '#F59E0B' },
            poor: { label: '较差', color: '#EF4444' },
            error: { label: '错误', color: '#64748B' }
        };
        return ratings[status] || ratings.error;
    }

    getTestResults() {
        return this.testResults;
    }

    clearResults() {
        this.testResults = {};
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LatencyTestEngine;
}

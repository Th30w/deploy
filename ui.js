class SpeedTestUI {
    constructor(speedTestEngine, latencyEngine, dataManager) {
        this.speedTest = speedTestEngine;
        this.latencyEngine = latencyEngine;
        this.dataManager = dataManager;
        this.currentPhase = 'idle';
        this.animationFrame = null;
    }

    init() {
        this.bindEvents();
        this.loadHistory();
        this.setupEngineListeners();
        this.updateNetworkInfo();
    }

    bindEvents() {
        const startBtn = document.getElementById('startTest');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startSpeedTest());
        }

        const abortBtn = document.getElementById('abortTest');
        if (abortBtn) {
            abortBtn.addEventListener('click', () => this.abortTest());
        }

        const clearHistoryBtn = document.getElementById('clearHistory');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchCategory(e));
        });

        document.querySelectorAll('.test-all-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.testCategory(e));
        });

        this.setupLatencyTestListeners();
    }

    setupLatencyTestListeners() {
        document.querySelectorAll('.app-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const appName = e.currentTarget.dataset.app;
                const category = e.currentTarget.dataset.category;
                this.testSingleApp(appName, category);
            });
        });
    }

    setupEngineListeners() {
        this.speedTest.on('progress', (data) => this.handleSpeedTestProgress(data));
        this.speedTest.on('complete', (results) => this.handleSpeedTestComplete(results));
        this.speedTest.on('error', (error) => this.handleSpeedTestError(error));

        this.latencyEngine.on('progress', (data) => this.handleLatencyTestProgress(data));
        this.latencyEngine.on('complete', (data) => this.handleLatencyTestComplete(data));
    }

    async startSpeedTest() {
        const startBtn = document.getElementById('startTest');
        const abortBtn = document.getElementById('abortTest');

        startBtn.classList.add('hidden');
        abortBtn.classList.remove('hidden');

        this.resetResults();
        this.animateResults();

        try {
            await this.speedTest.startFullTest();
        } catch (e) {
            console.error('Speed test error:', e);
        }
    }

    abortTest() {
        this.speedTest.abort();
        const startBtn = document.getElementById('startTest');
        const abortBtn = document.getElementById('abortTest');

        startBtn.classList.remove('hidden');
        abortBtn.classList.add('hidden');

        this.currentPhase = 'idle';
    }

    resetResults() {
        const elements = {
            downloadValue: document.getElementById('downloadValue'),
            uploadValue: document.getElementById('uploadValue'),
            pingValue: document.getElementById('pingValue'),
            jitterValue: document.getElementById('jitterValue')
        };

        Object.values(elements).forEach(el => {
            if (el) el.textContent = '0';
        });

        document.querySelectorAll('.metric-card').forEach(card => {
            card.classList.remove('completed', 'testing');
        });
    }

    animateResults() {
        const elements = {
            download: document.getElementById('downloadValue'),
            upload: document.getElementById('uploadValue'),
            ping: document.getElementById('pingValue'),
            jitter: document.getElementById('jitterValue')
        };

        Object.entries(elements).forEach(([key, el]) => {
            if (el) {
                el.classList.add('animating');
                el.textContent = '0.00';
            }
        });
    }

    updateBars(downloadSpeed, uploadSpeed) {
        const maxSpeed = 150;
        
        const downloadBar = document.getElementById('downloadBar');
        const downloadBarValue = document.getElementById('downloadBarValue');
        if (downloadBar) {
            const percentage = Math.min((downloadSpeed / maxSpeed) * 100, 100);
            downloadBar.style.width = percentage + '%';
        }
        if (downloadBarValue) {
            downloadBarValue.textContent = downloadSpeed.toFixed(2) + ' MB/s';
        }

        const uploadBar = document.getElementById('uploadBar');
        const uploadBarValue = document.getElementById('uploadBarValue');
        if (uploadBar) {
            const percentage = Math.min((uploadSpeed / maxSpeed) * 100, 100);
            uploadBar.style.width = percentage + '%';
        }
        if (uploadBarValue) {
            uploadBarValue.textContent = uploadSpeed.toFixed(2) + ' MB/s';
        }
    }

    handleSpeedTestProgress(data) {
        this.currentPhase = data.phase;

        const phaseMap = {
            download: 'download',
            upload: 'upload',
            ping: 'ping',
            jitter: 'jitter'
        };

        const phaseKey = phaseMap[data.phase];
        if (phaseKey) {
            const card = document.querySelector(`.metric-card[data-metric="${phaseKey}"]`);
            if (card) {
                card.classList.add('testing');
            }
        }

        if (data.message) {
            this.updateStatus(data.message);
        }

        if (data.currentSpeed !== undefined) {
            if (data.phase === 'download') {
                const downloadEl = document.getElementById('downloadValue');
                if (downloadEl) {
                    downloadEl.textContent = data.currentSpeed.toFixed(2) + ' MB/s';
                }
                
                const downloadBarValue = document.getElementById('downloadBarValue');
                if (downloadBarValue) {
                    downloadBarValue.textContent = data.currentSpeed.toFixed(2) + ' MB/s';
                }
                
                const downloadBar = document.getElementById('downloadBar');
                if (downloadBar) {
                    const maxSpeed = 150;
                    const percentage = Math.min((data.currentSpeed / maxSpeed) * 100, 100);
                    downloadBar.style.width = percentage + '%';
                }

                if (data.downloaded !== undefined) {
                    const downloadInfo = document.getElementById('downloadInfo');
                    if (downloadInfo) {
                        downloadInfo.textContent = `已下载: ${data.downloaded} MB / 1024 MB`;
                    }
                }
            } else if (data.phase === 'upload') {
                const uploadEl = document.getElementById('uploadValue');
                if (uploadEl) {
                    uploadEl.textContent = data.currentSpeed.toFixed(2) + ' MB/s';
                }
                
                const uploadBarValue = document.getElementById('uploadBarValue');
                if (uploadBarValue) {
                    uploadBarValue.textContent = data.currentSpeed.toFixed(2) + ' MB/s';
                }
                
                const uploadBar = document.getElementById('uploadBar');
                if (uploadBar) {
                    const maxSpeed = 150;
                    const percentage = Math.min((data.currentSpeed / maxSpeed) * 100, 100);
                    uploadBar.style.width = percentage + '%';
                }

                if (data.uploaded !== undefined) {
                    const uploadInfo = document.getElementById('uploadInfo');
                    if (uploadInfo) {
                        uploadInfo.textContent = `已上传: ${data.uploaded} MB / 512 MB`;
                    }
                }
            }
        }

        if (data.progress !== undefined) {
            if (data.phase === 'download') {
                const progressBar = document.getElementById('downloadProgress');
                if (progressBar) {
                    progressBar.style.width = data.progress + '%';
                }
                const progressText = document.getElementById('downloadProgressText');
                if (progressText) {
                    progressText.textContent = Math.round(data.progress) + '%';
                }
            } else if (data.phase === 'upload') {
                const progressBar = document.getElementById('uploadProgress');
                if (progressBar) {
                    progressBar.style.width = data.progress + '%';
                }
                const progressText = document.getElementById('uploadProgressText');
                if (progressText) {
                    progressText.textContent = Math.round(data.progress) + '%';
                }
            }
        }
    }

    handleSpeedTestComplete(results) {
        this.animateNumber('downloadValue', results.download, ' MB/s');
        this.animateNumber('uploadValue', results.upload, ' MB/s');
        this.animateNumber('pingValue', results.ping, ' ms');
        this.animateNumber('jitterValue', results.jitter, ' ms');

        const downloadCard = document.querySelector('.metric-card[data-metric="download"]');
        const uploadCard = document.querySelector('.metric-card[data-metric="upload"]');
        const pingCard = document.querySelector('.metric-card[data-metric="ping"]');
        const jitterCard = document.querySelector('.metric-card[data-metric="jitter"]');

        [downloadCard, uploadCard, pingCard, jitterCard].forEach(card => {
            if (card) {
                card.classList.remove('testing');
                card.classList.add('completed');
            }
        });

        const downloadRating = this.speedTest.getRating('download', results.download);
        const uploadRating = this.speedTest.getRating('upload', results.upload);
        const pingRating = this.speedTest.getRating('ping', results.ping);
        const jitterRating = this.speedTest.getRating('jitter', results.jitter);

        this.updateRating('downloadRating', downloadRating);
        this.updateRating('uploadRating', uploadRating);
        this.updateRating('pingRating', pingRating);
        this.updateRating('jitterRating', jitterRating);

        this.updateBars(results.download, results.upload);

        this.dataManager.saveSpeedRecord(results);
        this.updateHistoryDisplay();

        const startBtn = document.getElementById('startTest');
        const abortBtn = document.getElementById('abortTest');
        startBtn.classList.remove('hidden');
        abortBtn.classList.add('hidden');

        this.updateStatus('测速完成');
    }

    handleSpeedTestError(error) {
        console.error('Speed test error:', error);
        this.updateStatus('测速失败: ' + error.message);

        const startBtn = document.getElementById('startTest');
        const abortBtn = document.getElementById('abortTest');
        startBtn.classList.remove('hidden');
        abortBtn.classList.add('hidden');
    }

    animateNumber(elementId, targetValue, suffix) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const duration = CONFIG.ui.numberAnimationDuration;
        const startTime = performance.now();
        const startValue = parseFloat(element.textContent) || 0;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (targetValue - startValue) * easeOutQuart;

            if (elementId.includes('ping') || elementId.includes('jitter')) {
                element.textContent = Math.round(currentValue) + suffix;
            } else {
                element.textContent = currentValue.toFixed(2) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    updateProgress(progressId, percent) {
        const progressBar = document.getElementById(progressId);
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
    }

    updateStatus(message) {
        const statusEl = document.getElementById('statusMessage');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    updateRating(elementId, rating) {
        const ratingEl = document.getElementById(elementId);
        if (ratingEl) {
            ratingEl.textContent = rating.label;
            ratingEl.style.color = rating.color;
        }
    }

    async testSingleApp(appName, category) {
        const appConfig = CONFIG.appCategories[category]?.find(app => app.name === appName);
        if (!appConfig) return;

        const card = document.querySelector(`.app-card[data-app="${appName}"]`);
        if (card) {
            card.classList.add('testing');
            const latencyEl = card.querySelector('.latency-value');
            if (latencyEl) latencyEl.textContent = '测试中...';
        }

        const result = await this.latencyEngine.testSingleApp(appConfig);

        if (card) {
            card.classList.remove('testing');
            const latencyEl = card.querySelector('.latency-value');
            if (latencyEl) {
                if (result.latency > 0) {
                    latencyEl.textContent = result.latency + ' ms';
                } else {
                    latencyEl.textContent = '超时';
                }
            }

            const statusEl = card.querySelector('.status-badge');
            if (statusEl) {
                const rating = this.latencyEngine.getLatencyRating(result.latency);
                statusEl.textContent = rating.label;
                statusEl.style.backgroundColor = rating.color;
            }
        }

        this.dataManager.saveLatencyRecord({
            appName: result.app,
            category: result.category,
            latency: result.latency,
            status: result.status
        });
    }

    async testCategory(e) {
        const category = e.currentTarget.dataset.category;
        
        const cards = document.querySelectorAll(`.category-content.active .app-card`);
        cards.forEach(card => {
            card.classList.add('testing');
            const latencyEl = card.querySelector('.latency-value');
            if (latencyEl) latencyEl.textContent = '测试中...';
        });

        const results = await this.latencyEngine.testCategory(category);

        results.forEach(result => {
            const card = document.querySelector(`.app-card[data-app="${result.app}"]`);
            if (card) {
                card.classList.remove('testing');
                const latencyEl = card.querySelector('.latency-value');
                if (latencyEl) {
                    if (result.latency > 0) {
                        latencyEl.textContent = result.latency + ' ms';
                    } else {
                        latencyEl.textContent = '超时';
                    }
                }

                const statusEl = card.querySelector('.status-badge');
                if (statusEl) {
                    const rating = this.latencyEngine.getLatencyRating(result.latency);
                    statusEl.textContent = rating.label;
                    statusEl.style.backgroundColor = rating.color;
                }
            }

            this.dataManager.saveLatencyRecord({
                appName: result.app,
                category: result.category,
                latency: result.latency,
                status: result.status
            });
        });
    }

    switchCategory(e) {
        const category = e.currentTarget.dataset.category;

        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        e.currentTarget.classList.add('active');

        document.querySelectorAll('.category-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetContent = document.getElementById(`category-${category}`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    handleLatencyTestProgress(data) {
        if (data.message) {
            this.updateLatencyStatus(data.message);
        }
    }

    handleLatencyTestComplete(data) {
        this.updateLatencyStatus(`${this.latencyEngine.getCategoryDisplayName(data.category)} 测试完成`);
    }

    updateLatencyStatus(message) {
        const statusEl = document.getElementById('latencyStatus');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    loadHistory() {
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const history = this.dataManager.getSpeedHistory(10);
        const historyContainer = document.getElementById('historyList');

        if (!historyContainer) return;

        if (history.length === 0) {
            historyContainer.innerHTML = '<p class="empty-state">暂无历史记录</p>';
            return;
        }

        historyContainer.innerHTML = history.map(record => {
            const date = new Date(record.timestamp);
            const timeStr = date.toLocaleString('zh-CN', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
                <div class="history-item">
                    <div class="history-time">${timeStr}</div>
                    <div class="history-stats">
                        <span class="stat">↓ ${record.download || 0} MB/s</span>
                        <span class="stat">↑ ${record.upload || 0} MB/s</span>
                        <span class="stat">⏱ ${record.ping || 0} ms</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    clearHistory() {
        if (confirm('确定要清除所有历史记录吗？')) {
            this.dataManager.clearAllHistory();
            this.updateHistoryDisplay();
            this.updateStatus('历史记录已清除');
        }
    }

    updateNetworkInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const networkInfo = document.getElementById('networkInfo');

        if (connection && networkInfo) {
            const typeMap = {
                '4g': '4G',
                '3g': '3G',
                '2g': '2G',
                'slow-2g': '慢2G',
                'wifi': 'WiFi',
                'ethernet': '有线'
            };

            const type = typeMap[connection.effectiveType] || connection.effectiveType;
            networkInfo.textContent = `网络类型: ${type}`;
        }
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        this.dataManager.saveSettings({ ...this.dataManager.getSettings(), theme: newTheme });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpeedTestUI;
}

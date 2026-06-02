class MobileSpeedTestUI {
    constructor(speedTestEngine, latencyEngine, dataManager) {
        this.speedTest = speedTestEngine;
        this.latencyEngine = latencyEngine;
        this.dataManager = dataManager;
        this.currentTab = 'test';
    }

    init() {
        this.bindEvents();
        this.setupEngineListeners();
        this.loadHistory();
        this.updateNetworkInfo();
    }

    bindEvents() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e));
        });

        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchCategory(e));
        });

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

        document.querySelectorAll('.test-all-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.testCategory(e));
        });

        document.querySelectorAll('.app-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const appName = e.currentTarget.dataset.app;
                const category = e.currentTarget.dataset.category;
                this.testSingleApp(appName, category);
            });
        });

        const nodeSelect = document.getElementById('nodeSelect');
        if (nodeSelect) {
            nodeSelect.addEventListener('change', (e) => this.handleNodeChange(e));
        }

        const refreshLocationBtn = document.getElementById('refreshLocation');
        if (refreshLocationBtn) {
            refreshLocationBtn.addEventListener('click', () => this.refreshLocation());
        }

        this.populateNodeSelect();
        this.autoSelectNode();
    }

    populateNodeSelect() {
        const select = document.getElementById('nodeSelect');
        if (!select) return;

        const nodes = getAllNodes();
        nodes.forEach(node => {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = `${node.name} (${node.province})`;
            select.appendChild(option);
        });
    }

    async autoSelectNode() {
        const display = document.getElementById('currentNode');
        if (display) {
            display.textContent = '正在获取位置...';
        }

        try {
            const location = await this.speedTest.getLocation();
            const nearestNode = findNearestNode(location.lat, location.lng);
            this.displaySelectedNode(nearestNode);

            const select = document.getElementById('nodeSelect');
            if (select) {
                select.value = nearestNode.id;
            }
        } catch (e) {
            if (display) {
                display.textContent = '无法获取位置，使用默认节点';
            }
            const defaultNode = SPEED_NODES.nodes[0];
            this.displaySelectedNode(defaultNode);
        }
    }

    async refreshLocation() {
        await this.autoSelectNode();
    }

    handleNodeChange(e) {
        const selectedValue = e.target.value;
        if (selectedValue === 'auto') {
            this.autoSelectNode();
        } else {
            const node = getNodeById(selectedValue);
            if (node) {
                this.displaySelectedNode(node);
            }
        }
    }

    displaySelectedNode(node) {
        const display = document.getElementById('currentNode');
        if (display) {
            display.textContent = `📍 ${node.name} (${node.province})`;
        }
    }

    setupEngineListeners() {
        this.speedTest.on('progress', (data) => this.handleSpeedTestProgress(data));
        this.speedTest.on('complete', (results) => this.handleSpeedTestComplete(results));
        this.speedTest.on('error', (error) => this.handleSpeedTestError(error));

        this.latencyEngine.on('progress', (data) => this.handleLatencyTestProgress(data));
        this.latencyEngine.on('complete', (data) => this.handleLatencyTestComplete(data));
    }

    switchTab(e) {
        const tab = e.currentTarget.dataset.tab;

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.currentTarget.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const targetContent = document.getElementById(`tab-${tab}`);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        this.currentTab = tab;
    }

    switchCategory(e) {
        const category = e.currentTarget.dataset.category;

        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.currentTarget.classList.add('active');

        document.querySelectorAll('.apps-section').forEach(section => {
            section.classList.remove('active');
        });

        const targetSection = document.getElementById(`category-${category}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    async startSpeedTest() {
        const startBtn = document.getElementById('startTest');
        const abortBtn = document.getElementById('abortTest');

        startBtn.classList.add('hidden');
        abortBtn.classList.remove('hidden');

        this.resetResults();

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
    }

    resetResults() {
        const elements = ['downloadValue', 'uploadValue', 'pingValue', 'jitterValue'];
        elements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '0';
        });

        const ratings = ['downloadRating', 'uploadRating', 'pingRating', 'jitterRating'];
        ratings.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = '--';
                el.style.background = '#64748B';
            }
        });
    }

    handleSpeedTestProgress(data) {
        if (data.message) {
            this.updateStatus(data.message);
        }

        if (data.currentSpeed !== undefined) {
            if (data.phase === 'download') {
                const downloadEl = document.getElementById('downloadValue');
                if (downloadEl) {
                    downloadEl.textContent = data.currentSpeed.toFixed(2);
                }
                
                const downloadGaugeValue = document.getElementById('downloadGaugeValue');
                if (downloadGaugeValue) {
                    downloadGaugeValue.textContent = data.currentSpeed.toFixed(2);
                }
            } else if (data.phase === 'upload') {
                const uploadEl = document.getElementById('uploadValue');
                if (uploadEl) {
                    uploadEl.textContent = data.currentSpeed.toFixed(2);
                }
                
                const uploadGaugeValue = document.getElementById('uploadGaugeValue');
                if (uploadGaugeValue) {
                    uploadGaugeValue.textContent = data.currentSpeed.toFixed(2);
                }
            }
        }
    }

    handleSpeedTestComplete(results) {
        this.animateNumber('downloadValue', results.download);
        this.animateNumber('uploadValue', results.upload);
        this.animateNumber('pingValue', results.ping);
        this.animateNumber('jitterValue', results.jitter);

        this.animateNumber('downloadGaugeValue', results.download);
        this.animateNumber('uploadGaugeValue', results.upload);

        const downloadRating = this.speedTest.getRating('download', results.download);
        const uploadRating = this.speedTest.getRating('upload', results.upload);
        const pingRating = this.speedTest.getRating('ping', results.ping);
        const jitterRating = this.speedTest.getRating('jitter', results.jitter);

        this.updateRating('downloadRating', downloadRating);
        this.updateRating('uploadRating', uploadRating);
        this.updateRating('pingRating', pingRating);
        this.updateRating('jitterRating', jitterRating);

        const gaugeValue = document.getElementById('gaugeValue');
        if (gaugeValue) {
            gaugeValue.textContent = results.download.toFixed(2);
        }

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

    animateNumber(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const duration = 1500;
        const startTime = performance.now();
        const startValue = parseFloat(element.textContent) || 0;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (targetValue - startValue) * easeOutQuart;

            if (elementId.includes('ping') || elementId.includes('jitter')) {
                element.textContent = Math.round(currentValue);
            } else {
                element.textContent = currentValue.toFixed(2);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
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
            ratingEl.style.background = rating.color;
        }
    }

    async testSingleApp(appName, category) {
        const appConfig = CONFIG.appCategories[category]?.find(app => app.name === appName);
        if (!appConfig) return;

        const item = document.querySelector(`.app-item[data-app="${appName}"]`);
        if (item) {
            item.classList.add('testing');
            const latencyEl = item.querySelector('.latency-value');
            if (latencyEl) latencyEl.textContent = '...';
        }

        const result = await this.latencyEngine.testSingleApp(appConfig);

        if (item) {
            item.classList.remove('testing');
            const latencyEl = item.querySelector('.latency-value');
            if (latencyEl) {
                if (result.latency > 0) {
                    latencyEl.textContent = result.latency + 'ms';
                } else {
                    latencyEl.textContent = '超时';
                }
            }

            const statusEl = item.querySelector('.status-badge');
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
        
        const cards = document.querySelectorAll(`.apps-section.active .app-item`);
        cards.forEach(card => {
            card.classList.add('testing');
            const latencyEl = card.querySelector('.latency-value');
            if (latencyEl) latencyEl.textContent = '测试中...';
        });

        const results = await this.latencyEngine.testCategory(category);

        results.forEach(result => {
            const card = document.querySelector(`.app-item[data-app="${result.app}"]`);
            if (card) {
                card.classList.remove('testing');
                const latencyEl = card.querySelector('.latency-value');
                if (latencyEl) {
                    if (result.latency > 0) {
                        latencyEl.textContent = result.latency + 'ms';
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

    handleLatencyTestProgress(data) {
        if (data.message) {
            this.updateLatencyStatus(data.message);
        }
    }

    handleLatencyTestComplete(data) {
        this.updateLatencyStatus('测试完成');
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
            networkInfo.textContent = `网络: ${type}`;
        }
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        }

        this.dataManager.saveSettings({ ...this.dataManager.getSettings(), theme: newTheme });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const speedTest = new SpeedTestEngine();
    const latencyEngine = new LatencyTestEngine();
    const dataManager = new DataManager();

    const ui = new MobileSpeedTestUI(speedTest, latencyEngine, dataManager);

    ui.init();

    const settings = dataManager.getSettings();
    if (settings.theme) {
        document.documentElement.setAttribute('data-theme', settings.theme);
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.textContent = settings.theme === 'dark' ? '🌙' : '☀️';
        }
    }

    window.speedTestApp = {
        speedTest,
        latencyEngine,
        dataManager,
        ui
    };

    console.log('Wi-Fi Speed Test (Mobile) initialized successfully');
});

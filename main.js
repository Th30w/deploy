document.addEventListener('DOMContentLoaded', () => {
    const speedTest = new SpeedTestEngine();
    const latencyEngine = new LatencyTestEngine();
    const dataManager = new DataManager();

    const ui = new SpeedTestUI(speedTest, latencyEngine, dataManager);

    ui.init();

    const settings = dataManager.getSettings();
    if (settings.theme) {
        document.documentElement.setAttribute('data-theme', settings.theme);
    }

    populateNodeSelect();

    const nodeSelect = document.getElementById('nodeSelect');
    if (nodeSelect) {
        nodeSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            if (selectedValue === 'auto') {
                autoSelectNode();
            } else {
                const selectedNode = getNodeById(selectedValue);
                if (selectedNode) {
                    displaySelectedNode(selectedNode);
                }
            }
        });
    }

    const refreshLocationBtn = document.getElementById('refreshLocation');
    if (refreshLocationBtn) {
        refreshLocationBtn.addEventListener('click', () => {
            autoSelectNode();
        });
    }

    function populateNodeSelect() {
        const select = document.getElementById('nodeSelect');
        if (!select) return;

        select.innerHTML = '<option value="auto">自动选择（推荐）</option>';

        const nodes = getAllNodes();
        nodes.forEach(node => {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = `${node.name} (${node.province})`;
            select.appendChild(option);
        });
    }

    async function autoSelectNode() {
        const currentNodeDisplay = document.getElementById('currentNode');
        if (currentNodeDisplay) {
            currentNodeDisplay.textContent = '正在获取您的位置信息...';
        }

        try {
            const location = await speedTest.getLocation();
            const nearestNode = findNearestNode(location.lat, location.lng);
            displaySelectedNode(nearestNode);

            const nodeSelect = document.getElementById('nodeSelect');
            if (nodeSelect) {
                nodeSelect.value = nearestNode.id;
            }
        } catch (e) {
            if (currentNodeDisplay) {
                currentNodeDisplay.textContent = '无法获取位置，将使用默认节点';
            }
            const defaultNode = SPEED_NODES.nodes[0];
            displaySelectedNode(defaultNode);
        }
    }

    function displaySelectedNode(node) {
        const currentNodeDisplay = document.getElementById('currentNode');
        if (currentNodeDisplay) {
            currentNodeDisplay.innerHTML = `
                <div class="node-info">
                    <span class="node-name">📍 ${node.name}</span>
                    <span class="node-province">${node.province}</span>
                </div>
            `;
        }
    }

    autoSelectNode();

    window.speedTestApp = {
        speedTest,
        latencyEngine,
        dataManager,
        ui
    };

    console.log('Wi-Fi Speed Test (Desktop) initialized successfully');
});

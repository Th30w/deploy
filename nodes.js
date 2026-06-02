const SPEED_NODES = {
    defaultDownloadUrl: 'https://speed.cloudflare.com/__down?bytes=10000000',
    defaultUploadUrl: 'https://speed.cloudflare.com/__up',
    defaultPingUrl: 'https://speed.cloudflare.com/__down?bytes=0',

    nodes: [
        {
            id: 'beijing',
            name: '北京',
            province: '北京市',
            lat: 39.9042,
            lng: 116.4074,
            provider: 'auto'
        },
        {
            id: 'shanghai',
            name: '上海',
            province: '上海市',
            lat: 31.2304,
            lng: 121.4737,
            provider: 'auto'
        },
        {
            id: 'guangzhou',
            name: '广州',
            province: '广东省',
            lat: 23.1291,
            lng: 113.2644,
            provider: 'auto'
        },
        {
            id: 'shenzhen',
            name: '深圳',
            province: '广东省',
            lat: 22.5431,
            lng: 114.0579,
            provider: 'auto'
        },
        {
            id: 'chengdu',
            name: '成都',
            province: '四川省',
            lat: 30.5728,
            lng: 104.0668,
            provider: 'auto'
        },
        {
            id: 'hangzhou',
            name: '杭州',
            province: '浙江省',
            lat: 30.2741,
            lng: 120.1551,
            provider: 'auto'
        },
        {
            id: 'wuhan',
            name: '武汉',
            province: '湖北省',
            lat: 30.5928,
            lng: 114.3055,
            provider: 'auto'
        },
        {
            id: 'xian',
            name: '西安',
            province: '陕西省',
            lat: 34.3416,
            lng: 108.9398,
            provider: 'auto'
        },
        {
            id: 'nanjing',
            name: '南京',
            province: '江苏省',
            lat: 32.0603,
            lng: 118.7969,
            provider: 'auto'
        },
        {
            id: 'tianjin',
            name: '天津',
            province: '天津市',
            lat: 39.3434,
            lng: 117.3616,
            provider: 'auto'
        },
        {
            id: 'chongqing',
            name: '重庆',
            province: '重庆市',
            lat: 29.4316,
            lng: 106.9123,
            provider: 'auto'
        },
        {
            id: 'dalian',
            name: '大连',
            province: '辽宁省',
            lat: 38.9140,
            lng: 121.6147,
            provider: 'auto'
        },
        {
            id: 'qingdao',
            name: '青岛',
            province: '山东省',
            lat: 36.0671,
            lng: 120.3826,
            provider: 'auto'
        },
        {
            id: 'xiamen',
            name: '厦门',
            province: '福建省',
            lat: 24.4798,
            lng: 118.0894,
            provider: 'auto'
        },
        {
            id: 'changsha',
            name: '长沙',
            province: '湖南省',
            lat: 28.2282,
            lng: 112.9388,
            provider: 'auto'
        },
        {
            id: 'zhengzhou',
            name: '郑州',
            province: '河南省',
            lat: 34.7466,
            lng: 113.6253,
            provider: 'auto'
        },
        {
            id: 'shenyang',
            name: '沈阳',
            province: '辽宁省',
            lat: 41.8057,
            lng: 123.4328,
            provider: 'auto'
        },
        {
            id: 'harbin',
            name: '哈尔滨',
            province: '黑龙江省',
            lat: 45.8038,
            lng: 126.5340,
            provider: 'auto'
        },
        {
            id: 'fuzhou',
            name: '福州',
            province: '福建省',
            lat: 26.0745,
            lng: 119.2965,
            provider: 'auto'
        },
        {
            id: 'nanchang',
            name: '南昌',
            province: '江西省',
            lat: 28.6829,
            lng: 115.8579,
            provider: 'auto'
        },
        {
            id: 'kunming',
            name: '昆明',
            province: '云南省',
            lat: 25.0406,
            lng: 102.7129,
            provider: 'auto'
        },
        {
            id: 'guiyang',
            name: '贵阳',
            province: '贵州省',
            lat: 26.6470,
            lng: 106.6302,
            provider: 'auto'
        },
        {
            id: 'nanning',
            name: '南宁',
            province: '广西省',
            lat: 22.8170,
            lng: 108.3665,
            provider: 'auto'
        },
        {
            id: 'taiyuan',
            name: '太原',
            province: '山西省',
            lat: 37.8706,
            lng: 112.5489,
            provider: 'auto'
        },
        {
            id: 'jinan',
            name: '济南',
            province: '山东省',
            lat: 36.6512,
            lng: 117.1205,
            provider: 'auto'
        },
        {
            id: 'shijiazhuang',
            name: '石家庄',
            province: '河北省',
            lat: 38.0428,
            lng: 114.5149,
            provider: 'auto'
        },
        {
            id: 'changchun',
            name: '长春',
            province: '吉林省',
            lat: 43.8171,
            lng: 125.3235,
            provider: 'auto'
        },
        {
            id: 'lanzhou',
            name: '兰州',
            province: '甘肃省',
            lat: 36.0611,
            lng: 103.8343,
            provider: 'auto'
        },
        {
            id: 'urumqi',
            name: '乌鲁木齐',
            province: '新疆',
            lat: 43.8256,
            lng: 87.6168,
            provider: 'auto'
        },
        {
            id: 'yinchuan',
            name: '银川',
            province: '宁夏',
            lat: 38.4680,
            lng: 106.2731,
            provider: 'auto'
        },
        {
            id: 'xining',
            name: '西宁',
            province: '青海省',
            lat: 36.6171,
            lng: 101.7782,
            provider: 'auto'
        },
        {
            id: 'hohhot',
            name: '呼和浩特',
            province: '内蒙古',
            lat: 40.8414,
            lng: 111.7519,
            provider: 'auto'
        },
        {
            id: 'haikou',
            name: '海口',
            province: '海南省',
            lat: 20.0444,
            lng: 110.1999,
            provider: 'auto'
        }
    ]
};

function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function findNearestNode(userLat, userLng) {
    let nearestNode = SPEED_NODES.nodes[0];
    let minDistance = Infinity;

    SPEED_NODES.nodes.forEach(node => {
        const distance = getDistance(userLat, userLng, node.lat, node.lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearestNode = node;
        }
    });

    return nearestNode;
}

function getAllNodes() {
    return SPEED_NODES.nodes;
}

function getNodeById(id) {
    return SPEED_NODES.nodes.find(node => node.id === id);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SPEED_NODES, getDistance, findNearestNode, getAllNodes, getNodeById };
}

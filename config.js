const CONFIG = {
    storage: {
        keys: {
            speedHistory: 'speed_test_history',
            latencyHistory: 'latency_test_history',
            settings: 'app_settings'
        },
        maxRecords: 50
    },

    speedTest: {
        downloadTestUrl: 'https://speed.cloudflare.com/__down?bytes=10000000',
        uploadTestUrl: 'https://speed.cloudflare.com/__up',
        pingTestUrl: 'https://speed.cloudflare.com/__down?bytes=0',
        testDuration: 10000,
        pingIterations: 5,
        timeout: 15000
    },

    appCategories: {
        games: [
            { name: '英雄联盟', icon: 'gamepad-2', endpoint: 'https://api.riotgames.com' },
            { name: '王者荣耀', icon: 'gamepad-2', endpoint: 'https://qt.qq.com' },
            { name: '原神', icon: 'sparkles', endpoint: 'https://api.mihoyo.com' },
            { name: '和平精英', icon: 'crosshair', endpoint: 'https://pg.qq.com' }
        ],
        video: [
            { name: 'YouTube', icon: 'youtube', endpoint: 'https://www.youtube.com' },
            { name: 'Netflix', icon: 'tv', endpoint: 'https://www.netflix.com' },
            { name: 'B站', icon: 'video', endpoint: 'https://api.bilibili.com' },
            { name: '抖音', icon: 'music', endpoint: 'https://www.douyin.com' }
        ],
        social: [
            { name: '微信', icon: 'message-circle', endpoint: 'https://weixin.qq.com' },
            { name: 'QQ', icon: 'mail', endpoint: 'https://im.qq.com' },
            { name: 'Telegram', icon: 'send', endpoint: 'https://telegram.org' }
        ],
        ecommerce: [
            { name: '淘宝', icon: 'shopping-bag', endpoint: 'https://www.taobao.com' },
            { name: '京东', icon: 'shopping-cart', endpoint: 'https://www.jd.com' },
            { name: '拼多多', icon: 'package', endpoint: 'https://www.pinduoduo.com' }
        ],
        cloud: [
            { name: 'AWS', icon: 'cloud', endpoint: 'https://aws.amazon.com' },
            { name: '阿里云', icon: 'cloud', endpoint: 'https://www.aliyun.com' },
            { name: '腾讯云', icon: 'server', endpoint: 'https://cloud.tencent.com' }
        ]
    },

    rating: {
        download: [
            { min: 100, label: '优秀', color: '#10B981' },
            { min: 50, label: '良好', color: '#3B82F6' },
            { min: 10, label: '一般', color: '#F59E0B' },
            { min: 0, label: '较差', color: '#EF4444' }
        ],
        upload: [
            { min: 50, label: '优秀', color: '#10B981' },
            { min: 20, label: '良好', color: '#3B82F6' },
            { min: 5, label: '一般', color: '#F59E0B' },
            { min: 0, label: '较差', color: '#EF4444' }
        ],
        ping: [
            { max: 20, label: '极好', color: '#10B981' },
            { max: 50, label: '良好', color: '#3B82F6' },
            { max: 100, label: '一般', color: '#F59E0B' },
            { max: Infinity, label: '较差', color: '#EF4444' }
        ],
        jitter: [
            { max: 5, label: '极稳定', color: '#10B981' },
            { max: 20, label: '稳定', color: '#3B82F6' },
            { max: 50, label: '一般', color: '#F59E0B' },
            { max: Infinity, label: '不稳定', color: '#EF4444' }
        ]
    },

    ui: {
        animationDuration: 600,
        progressUpdateInterval: 100,
        numberAnimationDuration: 1500
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

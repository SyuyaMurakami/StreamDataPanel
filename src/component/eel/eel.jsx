// src/component/eel/eel.jsx

let config = {
	WEB_SOCKET: 'ws://localhost:9005/ws',
	TITLE: 'Real-Time Data Panel',
	CHART_TYPE: 'ChartType',
	KEY_WORD: 'KeyWord',
	SUBSCRIBE: 'SUBSCRIBE',
	FAILED: 'FAILED',
	SUCCESS: 'SUCCESS',
};

export async function loadConfig() {
    if (typeof eel === 'undefined') {
        console.warn("Eel object not found. Using default/placeholder configuration.");
        return config;
    }

    try {
        // 调用 Python 暴露的函数 (注意最后的 () 用于获取返回值)
        const pyConfig = await eel.get_initial_config()(); 
        config = pyConfig;
        console.log("Configuration loaded from Python successfully.");
        return config;
    } catch (error) {
        console.error("Failed to load configuration from Python:", error);
        return config;
    }
}

export function getConfig() {
    return config;
}

export const getConfigValue = (key) => getConfig()[key];
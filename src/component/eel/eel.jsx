// src/component/eel/eel.jsx

let config = {
	WEB_SOCKET: 'ws://localhost:9005/ws',
	TITLE: 'Stream Data Panel',
	CHART_TYPE: 'ChartType',
	KEY_WORD: 'KeyWord',
	SUBSCRIBE: 'SUBSCRIBE',
	FAILED: 'FAILED',
	SUCCESS: 'SUCCESS',
};

export async function loadConfig() {
    try {
        const response = await fetch('/config');
        const hsConfig = await response.json();
        config = hsConfig;
        console.log("Configuration loaded from Haskell successfully.");
        return config;
    } catch (hsError) {
        console.log("Failed to load configuration from Haskell:", hsError);
        if (typeof eel === 'undefined') {
            console.warn("Eel object not found. Using default/placeholder configuration.");
            return config;
        }
        try {
            const pyConfig = await eel.get_initial_config()(); 
            config = pyConfig;
            console.log("Configuration loaded from Python successfully.");
            return config;
        } catch (pyError) {
            console.error("Failed to load configuration from Python:", pyError);
            return config;
        }    
    }
}

export function getConfig() {
    return config;
}

export const getConfigValue = (key) => getConfig()[key];
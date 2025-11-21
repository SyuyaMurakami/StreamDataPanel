// src/component/context/ConfigContext.jsx
import React, { createContext, useContext } from 'react';

// Create the Context object
const ConfigContext = createContext(null);

// Create a custom Hook for easy context consumption
export const useConfigContext = () => {
    const context = useContext(ConfigContext);
    // Ensure the hook is used inside the Provider
    if (!context) {
        throw new Error('useConfigContext must be used within a ConfigProvider');
    }
    return context;
};

// Create the Provider Component (Modified)
export const ConfigProvider = ({ 
    children, 
    exportLayout, 
    importLayout, 
    triggerImport, 
    importInputRef, 
    isImporting,
    // Receive panel title state
    panelTitle,
    setPanelTitle,
}) => {
    
    // Aggregate properties and methods to be shared (Modified)
    const contextValue = {
        exportLayout,
        importLayout,
        triggerImport,
        importInputRef,
        isImporting,
        // Expose panel title state
        panelTitle,
        setPanelTitle,
    };

    return (
        // Provide the aggregated context value
        <ConfigContext.Provider value={contextValue}>
            {children}
        </ConfigContext.Provider>
    );
};
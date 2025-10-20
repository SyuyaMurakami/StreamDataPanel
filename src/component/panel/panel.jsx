// src/component/panel/panel.jsx

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import Chart from '../chart/chart.jsx';
import * as ChartConst from '../chart/chartConst.jsx'
import * as EelConst from '../eel/eelConst.jsx';
import { useTheme } from '../theme/theme.jsx';
import { ConfigProvider } from '../config/ConfigContext.jsx';

// Import custom Hooks
import usePanelCore from './panelCanvas.jsx';
import useConfigIO from '../config/configHook.jsx';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Helper function (for rendering purposes)
const capitalString = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// Hook to manage ECharts double-click listeners for zooming
const useChartDblClickEffect = (charts, handleChartDoubleClick, chartRefs, chartListeners) => {
    useEffect(() => {
        const currentChartRefs = chartRefs.current;
        const currentListeners = chartListeners.current;
        
        // Iterate through the current charts list, checking/adding/removing listeners
        charts.forEach(chart => {
            const chartId = chart.id;
            // Check if double-click zoom is allowed for this chart type
            const isDblClickAllowed = ChartConst.GLOBAL_UPDATE_CHART.has(chart.chartType);
            const hasListener = currentListeners.has(chartId);

            // Bind the listener if not already bound and dbl-click is allowed
            if (!hasListener && isDblClickAllowed) {
                const echartsInstance = currentChartRefs.get(chartId);
                
                if (echartsInstance) {
                    const domElement = echartsInstance.getDom();
                    const dblClickHandler = (event) => {
                        event.stopPropagation(); // Prevent grid layout double-click events if any
                        handleChartDoubleClick(chartId); 
                    };

                    domElement.addEventListener('dblclick', dblClickHandler);
                    currentListeners.set(chartId, { domElement, handler: dblClickHandler });
                }
            }
            
            // Remove listener if it exists but dbl-click is no longer allowed (e.g., chart type changed)
            if (hasListener && !isDblClickAllowed) {
                const value = currentListeners.get(chartId);
                value.domElement.removeEventListener('dblclick', value.handler);
                currentListeners.delete(chartId);
            }
        });

        // Remove listeners for charts that have been deleted/removed from the list
        const currentChartIds = new Set(charts.map(c => c.id));
        
        currentListeners.forEach((value, chartId) => {
            if (!currentChartIds.has(chartId)) {
                value.domElement.removeEventListener('dblclick', value.handler);
                currentListeners.delete(chartId);
            }
        });

        // Cleanup function is not strictly needed here as listeners are managed inside the loop,
        // but it's good practice to ensure listeners are removed on unmount.
        // However, since `chartListeners.current` is a ref, the cleanup is mostly handled by re-running the effect.

    }, [charts, handleChartDoubleClick, chartRefs, chartListeners]);
}

/* Logic to force ECharts resize after zoom/unzoom state change */
const useChartResizeEffect = (chartStates, chartRefs) => {
    useEffect(() => {
        // Only run resize for charts that are in the 'on' state (i.e., zoomed in)
        // or when their state has just flipped, though the logic below focuses on the final state check.
        Object.entries(chartStates).forEach(([chartId, state]) => {
            if (state === 'on') {
                const echartsInstance = chartRefs.current.get(chartId);
                if (echartsInstance) {
                    // Force ECharts to redraw and adjust dimensions
                    echartsInstance.resize(); 
                }
            }
        });
    }, [chartStates, chartRefs]); // Rerun when chartStates change (zoom/unzoom)
}


const Panel = ({ children }) => {
    // --- State and Core Hooks ---
    const { theme, changeTheme, allThemes, currentThemeName } = useTheme();

    const [panelTitle, setPanelTitle] = useState(EelConst.TITLE());
    const [isImporting, setIsImporting] = useState(false); // Flag to indicate if config is being imported
    const [chartStates, setChartStates] = useState({}); // Stores chart zoom state: {chartId: 'on' | 'off'}

    const {
        charts,
        layouts, setLayouts,
        chartTypeInput, setChartTypeInput,
        keyWordInput, setKeyWordInput,
        subscriptionStatus,
        chartData, chartRefs, 
        addChart, removeChart, setChartInstance,
    } = usePanelCore(isImporting, chartStates); 
    
    // Ref to store event listeners for cleaning up double-click effects
    const chartListeners = useRef(new Map());


    /**
     * Internal handler to toggle chart zoom state and force ECharts Resize
     * @param {string} chartId 
     * @param {Object} chartInfo 
     */
    const toggleChartZoom = useCallback((chartId, chartInfo) => {
        setChartStates(prevStates => {
            // Determine current state, default to 'off'
            const currentState = prevStates[chartId] === 'on' ? 'on' : 'off'; 
            const newState = currentState === 'on' ? 'off' : 'on';
            
            console.log(`[Chart DoubleClick] ID: ${chartId}, State: ${newState}, Type: ${chartInfo.chartType}`);
            
            const echartsInstance = chartRefs.current.get(chartId);
            if (echartsInstance) {
                // Resize must happen after state change to ensure the DOM element has the new dimensions
                setTimeout(() => echartsInstance.resize(), 0); 
            }
            
            return { ...prevStates, [chartId]: newState };
        });
    }, [chartRefs]); // Only needs chartRefs as a dependency

    /* Double-click handler */
    const handleChartDoubleClick = useCallback((chartId) => {
        
        const chartInfo = charts.find(c => c.id === chartId);

        // Validation logic for double-click is done here, depending on 'charts'
        if (!chartInfo || !ChartConst.GLOBAL_UPDATE_CHART.has(chartInfo.chartType)) {
             return; 
        }

        // Delegate state change and side effects to the stable internal function
        toggleChartZoom(chartId, chartInfo);
        
    }, [charts, toggleChartZoom]); // Depends on charts and the stable toggleChartZoom

    // --- Side Effect Hooks Invocation ---
    useChartDblClickEffect(charts, handleChartDoubleClick, chartRefs, chartListeners);
    useChartResizeEffect(chartStates, chartRefs);


    // Config IO Hook (import/export logic)
    const {
        importInputRef,
        triggerImport,
        exportLayout,
        importLayout,
    } = useConfigIO({
        panelTitle, setPanelTitle,
        currentThemeName, allThemes, changeTheme,
        charts, layouts, setLayouts,
        addChart, removeChart,
        chartRefs, setIsImporting, isImporting
    });

    // Renders the controls (chart type input, keyword input, and subscribe button)
    const renderControls = () => (
        <div className="controls">
            <div className="underline-input-group">
                <div className="underline-input-wrapper">
                    <input
                        id="ChartType"
                        type="text"
                        className="underline-input"
                        placeholder=""
                        value={chartTypeInput}
                        onChange={(e) => setChartTypeInput(e.target.value)}
                    />
                    <label className="underline-label" htmlFor="ChartType">{EelConst.CHART_TYPE()}</label>
                </div>
                <div className="underline-input-wrapper">
                    <input
                        id="KeyWord"
                        type="text"
                        className="underline-input"
                        placeholder=""
                        value={keyWordInput}
                        onChange={(e) => setKeyWordInput(e.target.value)}
                    />
                    <label className="underline-label" htmlFor="KeyWord">{EelConst.KEY_WORD()}</label>
                </div>
            </div>
            <div className="underline-button-group">
                <button
                    className={`underline-button ${subscriptionStatus}`}
                    onClick={() => addChart(chartTypeInput, keyWordInput)}
                    disabled={isImporting} // Disable adding charts while importing
                >
                    {isImporting ? 'IMPORTING...' : subscriptionStatus === 'success' ? EelConst.SUCCESS() : subscriptionStatus === 'failure' ? EelConst.FAILED() : EelConst.SUBSCRIBE()}
                </button>
            </div>
        </div>
    );

    // Renders the responsive grid layout with chart items
    const renderGridItems = () => (
        <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={100}
            margin={[20, 20]}
            onLayoutChange={(_, allLayouts) => setLayouts(allLayouts)} // Update layouts state
            draggableHandle=".chart-drag-handle"
        >
            {charts.map(chart => (
                <div 
                    key={chart.id} 
                    // Add a class for zoomed state to control visual appearance
                    className={`chart-item ${chartStates[chart.id] === 'on' ? 'chart-item-zoomed' : ''}`} 
                >
                    <div className="chart-drag-handle">...</div>
                    <div className="chart-content">
                        <Chart
                            chartType={chart.chartType}
                            title={capitalString(`${chart.keyWord}`)}
                            data={chartData.current.get(chart.id) || []}
                            setInstance={(instance) => setChartInstance(chart.id, instance)} // Store ECharts instance in ref
                        />
                    </div>
                    <button
                        onClick={() => removeChart(chart.id)}
                        className="remove-button"
                    >
                        ×
                    </button>
                </div>
            ))}
        </ResponsiveGridLayout>
    );

    /* ConfigProvider wrapper and fixed content */
    const renderConfigWrapper = () => (
        <ConfigProvider
            exportLayout={exportLayout}
            importLayout={importLayout}
            triggerImport={triggerImport}
            importInputRef={importInputRef}
            isImporting={isImporting}
            panelTitle={panelTitle}
            setPanelTitle={setPanelTitle}
        >
            {children}

            {/* Hidden file input for layout import */}
            <input
                type="file"
                id="import-layout"
                ref={importInputRef}
                className="import-file"
                accept=".json"
                onChange={importLayout}
                disabled={isImporting}
                style={{ display: 'none' }}
            />

            <div className="panel">
                {renderControls()}
                <div className="grid-container">
                    {renderGridItems()}
                </div>
            </div>
        </ConfigProvider>
    );

    // Call the wrapper function to render
    return renderConfigWrapper();
};

export default Panel;
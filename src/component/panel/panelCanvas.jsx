// src/component/panel/panelCanvas.jsx

import { useState, useRef, useEffect, useCallback } from 'react';
import { transformSinglePointData } from '../data/dataTransformer.jsx';
import * as ChartConst from '../chart/chartConst.jsx';
import * as EelConst from '../eel/eelConst.jsx';

const lowerString = (str) => str.trim().toLowerCase();


/* WebSocket connection and timer cleanup logic upon component unmount */
const useWsCleanupEffect = (wsConnections, updateTimeout, subscriptionTimer, chartRefs, chartData) => {
    useEffect(() => {
        // Cleanup function runs on unmount
        return () => {
            clearTimeout(subscriptionTimer.current);
            clearTimeout(updateTimeout.current); 
            
            // Close all active WebSocket connections
            wsConnections.current.forEach(ws => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.close();
                }
            });
            // Clear all stored references and data
            chartRefs.current.clear();
            chartData.current.clear(); 
        };
    }, [wsConnections, updateTimeout, subscriptionTimer, chartRefs, chartData]);
};


/* Panel's core logic: state management, WebSocket connection, and chart operations */
const usePanelCore = (isImporting, chartStates) => {
    // UI/Input State
    const [charts, setCharts] = useState([]); // List of active charts {id, chartType, keyWord}
    const [layouts, setLayouts] = useState({ // Layouts for different screen breakpoints
        lg: [], md: [], sm: [], xs: [], xxs: [],
    });
    const [chartTypeInput, setChartTypeInput] = useState(''); // Input for chart type
    const [keyWordInput, setKeyWordInput] = useState(''); // Input for keyword
    const [subscriptionStatus, setSubscriptionStatus] = useState('idle'); // Status of the last subscription attempt

    // Data version, used to throttle Panel re-renders
    const [chartDataVersion, setChartDataVersion] = useState(0); 

    // Refs for persistent storage that do not trigger re-render on change
    const wsConnections = useRef(new Map()); // Stores active WebSocket instances by chartId
    const chartData = useRef(new Map()); // Stores chart data by chartId
    const chartRefs = useRef(new Map()); // Stores ECharts instances by chartId
    const subscriptionTimer = useRef(null); // Timer for clearing subscription status
    
    // Refs for data update throttling
    const dataUpdateQueued = useRef(false); // Flag for update throttling
    const updateTimeout = useRef(null); // Timeout ID for throttling

    // Stores the latest value of chartStates for access within ws.onmessage closure.
    const chartStatesRef = useRef(chartStates);

    // Update the Ref whenever chartStates changes
    useEffect(() => {
        chartStatesRef.current = chartStates;
    }, [chartStates]);


    // Function to set/store the ECharts instance
    const setChartInstance = useCallback((id, instance) => {
        if (instance) {
            chartRefs.current.set(id, instance);
        } else {
            chartRefs.current.delete(id);
        }
    }, []);

    // Centralized render trigger (throttled function)
    const triggerRender = useCallback(() => {
        if (dataUpdateQueued.current) return;

        dataUpdateQueued.current = true;

        updateTimeout.current = setTimeout(() => {
            // Increment version to force a re-render of components using chartData
            setChartDataVersion(v => v + 1); 
            dataUpdateQueued.current = false;
        }, 150); // Throttle delay: 150ms
    }, []);
    
    // Invoke the encapsulated cleanup Effect Hook
    useWsCleanupEffect(wsConnections, updateTimeout, subscriptionTimer, chartRefs, chartData);

    /* Logic for updating and clearing the subscription status.
     * @param {'success' | 'failure' | 'idle' | 'connecting'} status - The status to set
     */
    const handleSubscriptionStatus = useCallback((status) => {
        if (isImporting) return; // Skip status update in import mode
        
        setSubscriptionStatus(status);
        if (status !== 'connecting') {
            clearTimeout(subscriptionTimer.current);
            // Clear status back to 'idle' after a delay
            subscriptionTimer.current = setTimeout(() => setSubscriptionStatus('idle'), 1000); 
        }
    }, [isImporting]);


    /* Creates WebSocket message handling functions */
    const createWebSocketHandler = useCallback((newId, chartType, keyWord) => {
        const globalUpdateChart = ChartConst.GLOBAL_UPDATE_CHART;

        const onMessage = (ws) => (event) => {
            const message = JSON.parse(event.data);

            if (message.status) {
                // Subscription status message (success/failure)
                if (message.status === 'success') {
                    const newChart = { id: newId, chartType, keyWord };
                    
                    chartData.current.set(newId, []); // Initialize data array
                    wsConnections.current.set(newId, ws); // Store the active WS connection

                    setCharts(prev => {
                        const newChartsList = [...prev, newChart];
                        if (!isImporting) {
                            // Automatically add default layout for the new chart
                            setLayouts(prevLayouts => {
                                const newLayouts = { ...prevLayouts };
                                for (const breakpoint in newLayouts) {
                                    newLayouts[breakpoint] = [
                                        ...newLayouts[breakpoint],
                                        // Add a new layout item to the bottom (y: Infinity)
                                        { i: newId, x: 0, y: Infinity, w: 6, h: 3 }, 
                                    ];
                                }
                                return newLayouts;
                            });
                            // Update UI subscription status
                            handleSubscriptionStatus('success'); 
                        }
                        return newChartsList;
                    });

                } else if (message.status === 'failure') {
                    handleSubscriptionStatus('failure');
                    ws.close(); // Close connection on subscription failure
                }
            } else {
                // Real-time data message
                const transformedData = transformSinglePointData(message);
                if (transformedData) {
                    const currentData = chartData.current.get(newId);
                    
                    if (currentData) { 
                        // Check if the chart is paused (zoomed in)
                        const isPaused = chartStatesRef.current[newId] === 'on'; 

                        if (!isPaused) { // Only update data if not paused
                            let newData;
                            if (globalUpdateChart.has(chartType)) {
                                newData = transformedData; // Replace the entire dataset (e.g., Pie/Bar charts)
                            } else {
                                newData = [...currentData, transformedData]; // Append new data point (e.g., Line charts)
                                // Enforce data limit
                                if (newData.length > 100) { newData.shift(); } 
                            }
                            chartData.current.set(newId, newData);
                            triggerRender(); // Trigger a throttled render
                        }
                    }
                }
            }
        };

        const onError = (e, ws) => {
            console.error(`[WS Error] ID: ${newId}`, e); 
            wsConnections.current.delete(newId); 
            // If subscription hasn't succeeded yet, show failure status
            if (!charts.find(c => c.id === newId)) { 
                handleSubscriptionStatus('failure'); 
            }
        };

        return { onMessage, onError, onclose: () => { console.log(`[WS Close] ID: ${newId}`); } };
    }, [isImporting, handleSubscriptionStatus, triggerRender, chartStatesRef, charts]); // Added 'charts' to dependency for onError check


    // Add Chart (Core WebSocket logic)
    const addChart = useCallback((
        chartTypeOverride = chartTypeInput,
        keyWordOverride = keyWordInput
    ) => {
        return new Promise((resolve, reject) => {
            const chartType = lowerString(chartTypeOverride.trim());
            const keyWord = lowerString(keyWordOverride.trim());

            if (!chartType || !keyWord) {
                handleSubscriptionStatus('failure');
                reject(new Error("Chart type or keyword cannot be empty."));
                return;
            }

            const newId = crypto.randomUUID();
            const ws = new WebSocket(EelConst.WEB_SOCKET());

            // Set connecting status in UI
            if (!isImporting) setSubscriptionStatus('connecting');

            // Get handling functions
            const { onMessage, onError, onclose } = createWebSocketHandler(newId, chartType, keyWord);

            // Bind events
            ws.onopen = () => {
                const subscriptionMessage = { chart_type: chartType, key_word: keyWord, };
                // Send subscription request
                ws.send(JSON.stringify(subscriptionMessage)); 
            };

            // Use an intermediary function to resolve the Promise upon successful subscription
            const originalOnMessage = onMessage(ws);
            ws.onmessage = (event) => {
                originalOnMessage(event);
                const message = JSON.parse(event.data);
                // Resolve the promise only after the backend confirms successful subscription
                if (message.status === 'success') { 
                    resolve(newId);
                }
            };
            
            ws.onclose = onclose;
            ws.onerror = (e) => onError(e, ws);

        });
    }, [chartTypeInput, keyWordInput, isImporting, createWebSocketHandler, handleSubscriptionStatus]); 


    // Remove Chart
    const removeChart = useCallback((chartId) => {
        // Cleanup WebSocket connection
        const ws = wsConnections.current.get(chartId);
        if (ws) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
            wsConnections.current.delete(chartId);
        }

        // Cleanup Refs
        chartRefs.current.delete(chartId);
        chartData.current.delete(chartId);

        // Cleanup state
        setCharts(prev => prev.filter(chart => chart.id !== chartId));
        setLayouts(prevLayouts => {
            const newLayouts = {};
            for (const breakpoint in prevLayouts) {
                // Filter out the layout item for the removed chartId
                newLayouts[breakpoint] = prevLayouts[breakpoint].filter(item => item.i !== chartId);
            }
            return newLayouts;
        });
    }, []);

    return {
        charts, setCharts, // Expose setCharts for config import
        layouts, setLayouts, // Expose setLayouts for config import
        chartTypeInput, setChartTypeInput,
        keyWordInput, setKeyWordInput,
        subscriptionStatus,
        chartData, chartRefs, 
        addChart, removeChart, setChartInstance, 
    };
};

export default usePanelCore;
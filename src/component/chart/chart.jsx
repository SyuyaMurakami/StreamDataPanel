// src/component/chart/chart.jsx
import React from 'react';
import ReactECharts from 'echarts-for-react';
import { chartConfigs } from './chartConfig.jsx';
import { useTheme } from '../theme/theme.jsx'; // Assume this is the custom theme Hook

// ECharts related imports and registration
import { init, registerMap, use } from 'echarts'
import { SurfaceChart } from 'echarts-gl/charts'
import { Grid3DComponent } from 'echarts-gl/components'

// Register ECharts GL components/charts
use([SurfaceChart, Grid3DComponent])

/**
 * Get the ECharts configuration options
 * @param {string} chartType - Type of the chart (e.g., 'bar', 'line')
 * @param {string} title - Title of the chart
 * @param {Array<any>} chartData - Data for the chart
 * @param {string} theme - Current theme name (obtained from useTheme)
 * @returns {object} ECharts configuration object
 */
const getChartOptions = (chartType, title, chartData, theme) => {
    // Initialize data array
    const data = chartData || [];
    
    // The theme is now passed as an argument, no need to call useTheme() here
    
    // Return empty options if no data is available
    if (data.length === 0) return {};
    
    // Retrieve the configuration function based on chart type
    const configFunc = chartConfigs[chartType.toLowerCase()];
    
    // Pass the theme to the configuration function
    return configFunc ? configFunc(data, title, theme) : {}; 
};

// Chart component definition
const Chart = ({ chartType, title, data, setInstance }) => {
    // === Fix: Move useTheme to the top level of the Chart component ===
    // Get the current theme from the custom Hook
    const { theme } = useTheme(); 
    // =================================================

    // Use the new getChartOptions call, passing the current theme
    const options = getChartOptions(chartType, title, data, theme); 
    
    // Callback function executed when ECharts instance is ready
    const onChartReady = (echartsInstance) => {
        if (setInstance) {
            setInstance(echartsInstance); // Pass the instance to the parent component
        }
    };
    
    // useEffect to handle cleanup when the component unmounts
    React.useEffect(() => {
        return () => {
            if (setInstance) {
                setInstance(null); // Notify the parent component to clear the reference
            }
        };
    }, [setInstance]); // Re-run effect only if setInstance changes

    return (
        <ReactECharts 
            option={options} 
            // Consider passing the theme prop to ReactECharts so it can correctly apply the ECharts theme
            // theme={theme} 
            style={{ height: '100%', width: '100%' }} 
            onChartReady={onChartReady} 
        />
    );
};

export default Chart;
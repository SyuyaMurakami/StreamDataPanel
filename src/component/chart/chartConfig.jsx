// src/component/chart/chartConfig.jsx
import * as ChartConst from './chartConst.jsx'

/**
 * Get the base ECharts options, including title, tooltip, grid, and general settings.
 * @param {string} title - The title of the chart.
 * @param {object} theme - The current theme object, used for color customization.
 * @returns {object} The base ECharts option object.
 */
export const getBaseOptions = (title, theme) => ({
    // Set the threshold for incremental rendering
    progressive: 500,
    // Enable incremental rendering when data volume exceeds this value
    progressiveThreshold: 2000,
    animationDurationUpdate: 200,
    animationEasingUpdate: 'linear', 
    title: {
        text: title,
        left: ChartConst.TITLE_LEFT,
        textStyle: { fontSize: ChartConst.FONT_SIZE, color: theme?.['--primary-color'] || ChartConst.FONT_COLOR },
        top: ChartConst.TITLE_TOP,
    },
    tooltip: {
        trigger: ChartConst.TOOLTIP_TRIGGER,
        axisPointer: { type: ChartConst.TOOLTIP_AXIS_POINTER_TYPE, label: { backgroundColor: ChartConst.TOOLTIP_AXIS_POINTER_LABEL_BACKGROUND_COLOR } },
    },
    grid: {
        top: ChartConst.GRID_TOP,
        left: ChartConst.GRID_LEFT,
        right: ChartConst.GRID_RIGHT,
        bottom: ChartConst.GRID_BOTTOM,
        containLabel: ChartConst.GRID_CONTAIN_LABEL,
    },
    backgroundColor: ChartConst.BACKGROUND_COLOR,
});

/**
 * Calculates a 'nice' interval for the value axis based on the data range.
 * @param {number} min - The minimum value in the data.
 * @param {number} max - The maximum value in the data.
 * @returns {number} The calculated interval step.
 */
export const getValueAxisInterval = (min, max) => {
    const range = max - min;
    // Handle cases where range is zero or negative
    if (range <= 0) return 0.1;
    
    // Calculate a temporary step size for reference (aim for about 5 intervals)
    const tempStep = range / 5;
    
    // A list of 'nice' step sizes
    const niceSteps = [0.0001, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100];
    let bestStep = 1;
    
    // Find the smallest 'nice' step size that is greater than or equal to the temporary step
    for (let i = 0; i < niceSteps.length; i++) {
        if (niceSteps[i] >= tempStep) {
            bestStep = niceSteps[i];
            break;
        }
    }
    return bestStep;
};

/**
 * Get the configuration options for a value axis (e.g., y-axis).
 * Dynamically determines min, max, and interval based on data values.
 * @param {Array<number>} values - An array of numerical data values used to determine axis range.
 * @returns {object} ECharts value axis options object.
 */
export const getValueAxisOptions = (values) => {
    const valueMin = values.length > 0 ? Math.min(...values) : 0;
    const valueMax = values.length > 0 ? Math.max(...values) : 1;
    return {
        type: 'value',
        // Set maximum slightly above the max data value for padding
        max: (value) => parseFloat((value.max + 0.01).toFixed(ChartConst.DECIMAL)),
        // Set minimum slightly below the min data value for padding
        min: (value) => parseFloat((value.min - 0.01).toFixed(ChartConst.DECIMAL)),
        // Calculate and set the axis interval
        interval: parseFloat((values.length > 0 ? getValueAxisInterval(valueMin, valueMax) : 1).toFixed(ChartConst.DECIMAL)),
        axisLabel: {
            hideOverlap: ChartConst.AXIS_HIDE_OVERLAP,
            // Format axis labels to a fixed decimal place
            formatter: (value) => value.toFixed(ChartConst.DECIMAL),
        },
        axisLine: { lineStyle: { color: ChartConst.AXIS_LINE_COLOR } },
        splitLine: { lineStyle: { color: ChartConst.AXIS_SPLIT_LINE_COLOR, type: ChartConst.AXIS_SPLIT_LINE_TYPE } },
    };
};

/**
 * Get the common and specific options for a series item (data visualization).
 * @param {string} chartType - The type of chart/series (e.g., 'line', 'bar', 'scatter').
 * @param {string} seriesName - The name of the series.
 * @param {Array<any>} seriesData - The data array for the series.
 * @returns {object} ECharts series options object.
 */
export const getSeriesOptions = (chartType, seriesName, seriesData) => {
    const common = {
        name: seriesName,
        type: chartType,
    };
    // Options specific to Line and Sequence chart types
    if (['line', 'sequence', 'lines', 'sequences'].includes(chartType)) {
        return {
            ...common,
            smooth: ChartConst.SMOOTH,
            showSymbol: ChartConst.SHOW_SYMBOL,
            lineStyle: { width: ChartConst.LINE_WIDTH },
            areaStyle: { color: ChartConst.AREA_COLOR },
            data: seriesData,
        };
    }
    // Options specific to Bar chart type
    if (chartType === 'bar') {
        return {
            ...common,
            data: seriesData,
        };
    }
    // Options specific to Scatter chart type
    if (chartType === 'scatter') {
        return {
            ...common,
            data: seriesData,
            symbolSize: ChartConst.SCATTER_SYMBOL_SIZE,
        };
    }
    // Default common options for other types
    return common;
};

// Configuration map for different chart types
export const chartConfigs = {
    // Configuration for a single Sequence chart
    sequence: (data, title, theme) => ({
        ...getBaseOptions(title, theme),
        xAxis: {
            type: ChartConst.SEQUENCE_X_AXIS_TYPE,
            axisLine: { lineStyle: { color: ChartConst.AXIS_LINE_COLOR } },
            axisLabel: { interval: ChartConst.SEQUENCE_X_AXIS_LABEL_INTERVAL, hideOverlap: ChartConst.AXIS_HIDE_OVERLAP },
        },
        yAxis: getValueAxisOptions(data.map((d) => d.value)),
        series: [
            getSeriesOptions(
                'line',
                'Sequence Value',
                data.map((item) => ({id:item.id, value:[item.index, item.value]}))
            ),
        ],
    }),
    // Configuration for a single Line chart
    line: (data, title, theme) => ({
        ...getBaseOptions(title, theme),
        xAxis: {
            type: ChartConst.LINE_X_AXIS_TYPE,
            axisLine: { lineStyle: { color: ChartConst.AXIS_LINE_COLOR } },
            axisLabel: { interval: ChartConst.LINE_X_AXIS_LABEL_INTERVAL, hideOverlap: ChartConst.AXIS_HIDE_OVERLAP },
        },
        yAxis: getValueAxisOptions(data.map((d) => d.value)),
        series: [
            getSeriesOptions(
                'line',
                'Line Value',
                data.map((item) => [item.index, item.value])
            ),
        ],
    }),
    // Configuration for a single Bar chart
    bar: (data, title, theme) => ({
        ...getBaseOptions(title, theme),
        tooltip: { ...getBaseOptions(title).tooltip, axisPointer: { type: ChartConst.BAR_TOOLTIP_AXISPOINTER_TYPE } },
        xAxis: {
            type: ChartConst.BAR_X_AXIS_TYPE,
            data: data.map((item) => ({id:item.id, value:item.index})),
            axisLabel: { interval: ChartConst.BAR_X_AXIS_LABEL_INTERVAL, hideOverlap: ChartConst.AXIS_HIDE_OVERLAP },
        },
        yAxis: getValueAxisOptions(data.map((d) => d.value)),
        series: [getSeriesOptions('bar', 'Bar Value', data.map((item) => ({id:item.id, value:item.value})))],
    }),
    // Configuration for a Pie chart
    pie: (data, title, theme) => ({
        title: getBaseOptions(title, theme).title,
        tooltip: { trigger: ChartConst.PIE_TOOLTIP_TRIGGER, formatter: ChartConst.PIE_TOOLTIP_FORMATTER },
        series: [
            {
                name: 'Pie Value',
                type: 'pie',
                radius: ChartConst.PIE_RADIUS,
                avoidLabelOverlap: ChartConst.AXIS_HIDE_OVERLAP,
                label: { show: ChartConst.PIE_SHOW_LABEL, position: 'outside', formatter: '{b}' },
                labelLine: { show: ChartConst.PIE_SHOW_LABEL_LINE },
                // Data mapping for Pie chart
                data: data.value[0].map((dimension, index) => ({ id: dimension, value: data.value[1][index], name: dimension })),
            },
        ],
    }),
    // Configuration for a Scatter chart
    scatter: (data, title, theme) => ({
        ...getBaseOptions(title, theme),
        tooltip: {
            trigger: ChartConst.SCATTER_TOOLTIP_TRIGGER,
            // Custom formatter to display coordinates with fixed decimals
            formatter: (params) => `(${params.value[0].toFixed(ChartConst.DECIMAL)}, ${params.value[1].toFixed(ChartConst.DECIMAL)})`,
        },
        // Both axes use value options for numerical data
        xAxis: getValueAxisOptions(data.map((d) => d.value)),
        yAxis: getValueAxisOptions(data.map((d) => d.value)),
        series: [
            getSeriesOptions(
                'scatter',
                'Scatter Value',
                data.map((item) => ({id:item.id, value:item.value}))
            ),
        ],
    }),
    // Configuration for a Radar chart
    radar: (data, title, theme) => ({
        title: getBaseOptions(title, theme).title,
        animationDurationUpdate: 10, 
        radar: {
            // Indicator configuration from data
            indicator: data.value[0].map((dimension, index) => {
                return {
                    name: dimension,
                    max: data.value[1][index],
                };
            }),
            center: [ChartConst.RADAR_INNER_DIAMETER, ChartConst.RADAR_OUTER_DIAMETER],
            radius: ChartConst.RADAR_RADIUS,
            axisName: { color: ChartConst.AXIS_NAME_COLOR, textStyle: { fontSize: ChartConst.AXIS_NAME_FONT_SIZE } },
        },
        series: [
            {
                name: 'Radar Value',
                type: 'radar',
                data: [{value: data.value[2], name: 'Data'}],
                lineStyle: { width: ChartConst.LINE_WIDTH, color: ChartConst.LINE_COLOR },
                areaStyle: { color: ChartConst.AREA_COLOR },
            },
        ],
    }),
    // Configuration for multiple Sequences chart
    sequences: (data, title, theme) => ({
        ...getBaseOptions(title, theme),
        tooltip: { ...getBaseOptions(title).tooltip },
        legend: {
            // Legend data from the keys of the value object
            data: Object.keys(data[0].value),
            top: ChartConst.LEGEND_TOP,
            selectedMode: ChartConst.LEGEND_SELECT_MODE,
        },
        xAxis: {
            type: ChartConst.SEQUENCE_X_AXIS_TYPE,
            axisLine: { lineStyle: { color: ChartConst.AXIS_LINE_COLOR } },
            axisLabel: { interval: ChartConst.SEQUENCE_X_AXIS_LABEL_INTERVAL, hideOverlap: ChartConst.AXIS_HIDE_OVERLAP },
        },
        // Flatten all values to calculate the overall y-axis range
        yAxis: getValueAxisOptions(data.flatMap((item) => Object.values(item.value))),
        // Create a series for each key in the value object
        series: Object.keys(data[0].value).map((name) =>
            getSeriesOptions(
                'line',
                name,
                data.map((item) => ({id:item.id, value:[item.index, item.value[name]]}))
            )
        ),
    }),
    // Configuration for multiple Lines chart
    lines: (data, title, theme) => ({
        ...getBaseOptions(title, theme),
        tooltip: { ...getBaseOptions(title).tooltip },
        legend: {
            data: Object.keys(data[0].value),
            top: ChartConst.LEGEND_TOP,
            selectedMode: ChartConst.LEGEND_SELECT_MODE,
        },
        xAxis: {
            type: ChartConst.LINE_X_AXIS_TYPE,
            data: data.map((item) => item.index),
            axisLine: { lineStyle: { color: ChartConst.AXIS_LINE_COLOR } },
            axisLabel: { interval: ChartConst.LINE_X_AXIS_LABEL_INTERVAL, hideOverlap: ChartConst.AXIS_HIDE_OVERLAP },
        },
        yAxis: getValueAxisOptions(data.flatMap((item) => Object.values(item.value))),
        series: Object.keys(data[0].value).map((name) =>
            getSeriesOptions(
                'line',
                name,
                data.map((item) => [item.index, item.value[name]])
            )
        ),
    }),
    // Configuration for multiple Bars chart
    bars: (data, title, theme) => ({
        ...getBaseOptions(title, theme),
        tooltip: { ...getBaseOptions(title).tooltip, axisPointer: { type: ChartConst.BAR_TOOLTIP_AXISPOINTER_TYPE } },
        legend: {
            data: Object.keys(data[0].value),
            top: ChartConst.LEGEND_TOP,
            selectedMode: ChartConst.LEGEND_SELECT_MODE,
        },
        xAxis: {
            type: ChartConst.BAR_X_AXIS_TYPE,
            data: data.map((item) => item.index),
            axisLabel: { interval: ChartConst.BAR_X_AXIS_LABEL_INTERVAL, hideOverlap: ChartConst.AXIS_HIDE_OVERLAP },
        },
        yAxis: getValueAxisOptions(data.flatMap((item) => Object.values(item.value))),
        series: Object.keys(data[0].value).map((name) =>
            getSeriesOptions(
                'bar',
                name,
                data.map((item) => item.value[name])
            )
        ),
    }),
    // Configuration for a single Area chart
    area: (data, title, theme) => ({
        ...getBaseOptions(title, theme),
        xAxis: {
            type: ChartConst.AREA_CHART_X_AXIS_TYPE,
            axisLine: { lineStyle: { color: ChartConst.AXIS_LINE_COLOR } },
            axisLabel: { interval: ChartConst.AREA_CHART_X_AXIS_LABEL_INTERVAL, hideOverlap: ChartConst.AXIS_HIDE_OVERLAP },
        },
        yAxis: getValueAxisOptions(data.value[1]),
        series: [
            getSeriesOptions(
                'line',
                'Area Value',
                // Map data to [x, y] format
                data.value[0].map((dimension, index) => [dimension, data.value[1][index]])
            ),
        ],
    }),
    // Configuration for multiple Areas chart
    areas: (data, title, theme) => ({
        ...getBaseOptions(title, theme),
        tooltip: { ...getBaseOptions(title).tooltip },
        legend: {
            data: data.value[1],
            top: ChartConst.LEGEND_TOP,
            selectedMode: ChartConst.LEGEND_SELECT_MODE,
        },
        xAxis: {
            type: ChartConst.AREA_CHART_X_AXIS_TYPE,
            data: data.value[0],
            axisLine: { lineStyle: { color: ChartConst.AXIS_LINE_COLOR } },
            axisLabel: { interval: ChartConst.AREA_CHART_X_AXIS_LABEL_INTERVAL, hideOverlap: ChartConst.AXIS_HIDE_OVERLAP },
        },
        // Use all y-values to calculate the y-axis range
        yAxis: getValueAxisOptions(data.value[2].flat()),
        // Create a series for each set of area data
        series: data.value[1].map((name, index) =>
            getSeriesOptions(
                'line',
                name,
                // Map series data to [x, y] format
                data.value[2][index].map((item, x) => [data.value[0][x], item])
            )
        ),
    }),
    // Configuration for a Surface chart (3D)
    surface: (data, title, theme) => ({
        ...getBaseOptions(title, theme),
        // 3D axis configurations
        xAxis3D: {
            name: data.value[0][ChartConst.SURFACE_X_DIMENSION],
            nameTextStyle: { color: theme?.['--primary-color'] || ChartConst.FONT_COLOR },
            type: ChartConst.SURFACE_X_AXIS_TYPE,
        },
        yAxis3D: {
            name: data.value[0][ChartConst.SURFACE_Y_DIMENSION],
            nameTextStyle: { color: theme?.['--primary-color'] || ChartConst.FONT_COLOR },
            type: ChartConst.SURFACE_Y_AXIS_TYPE,
        },
        zAxis3D: {
            name: data.value[0][ChartConst.SURFACE_Z_DIMENSION],
            nameTextStyle: { color: theme?.['--primary-color'] || ChartConst.FONT_COLOR },
            type: ChartConst.SURFACE_Z_AXIS_TYPE,
        },
        grid3D: {
            boxWidth: ChartConst.SURFACE_GRID3D_BOXWIDTH,
            boxDepth: ChartConst.SURFACE_GRID3D_DEPTH,
            viewControl: { distance: ChartConst.SURFACE_GRID3D_VIEWCONTROL_DISTANCE },
        },
        visualMap: {
            type: ChartConst.SURFACE_VISUALMAP_TYPE,
            left: ChartConst.SURFACE_VISUALMAP_LEFT,
            top: ChartConst.SURFACE_VISUALMAP_TOP,
            dimension: ChartConst.SURFACE_VISUALMAP_DIMENSION,
            // Calculate min/max for visual map range
            min: Math.min(...(data.value[2].map(item => item[ChartConst.SURFACE_VISUALMAP_DIMENSION]))),
            max: Math.max(...(data.value[2].map(item => item[ChartConst.SURFACE_VISUALMAP_DIMENSION]))),
            text: ChartConst.SURFACE_VISUALMAP_TEXT,
            calculable: ChartConst.SURFACE_VISUALMAP_CALCULABLE,
            inRange: { color: ChartConst.SURFACE_VISUALMAP_INRANGE_COLOR }
        },
        series: [{
            type: 'surface',
            name: 'Surface Value',
            dataShape: data.value[1],
            data: data.value[2],
            wireframe: { show: ChartConst.SURFACE_SERIES_WIREFRAME_SHOW },
            surface : { smooth: ChartConst.SMOOTH },
            shading: ChartConst.SURFACE_SERIES_SHADING,
        }],
    }),
    // Configuration for a Text chart
    text: (data, title, theme) => ({
        title: getBaseOptions(title, theme).title,
        backgroundColor: ChartConst.BACKGROUND_COLOR,
        graphic: [
            {
                type: 'text',
                left: ChartConst.TEXT_CHART_LEFT,
                top: ChartConst.TEXT_CHART_TOP,
                style: {
                    text: data && data.value ? data.value : '',
                    fill: theme?.['--primary-color'] || ChartConst.FONT_COLOR,
                    fontSize: ChartConst.TEXT_CHART_FONT_SIZE, 
                    fontWeight: ChartConst.TEXT_CHART_FONT_WEIGHT,
                    textAlign: ChartConst.TEXT_CHART_FONT_ALIGN,
                    textVerticalAlign: ChartConst.TEXT_CHART_FONT_VERTICAL_ALIGN,
                    lineHeight: ChartConst.TEXT_CHART_LINE_HEIGHT,
                },
                zlevel: ChartConst.TEXT_CHART_Z_LEVEL, 
            }
        ]
    }),
    // Configuration for a Gauge chart
    gauge: (data, title, theme) => {
        const dataValueRangeList = data.value[1];
        const dataValueMin = dataValueRangeList[0];
        const dataValueMax = dataValueRangeList[1];
        const dataValueRange = dataValueMax - dataValueMin;
        const dataValueSplitOne = dataValueMin + dataValueRange * ChartConst.GAUGE_SPLIT[0];
        const dataValueSplitTwo = dataValueMin + dataValueRange * ChartConst.GAUGE_SPLIT[1];
        const dataValueSplitThree = dataValueMin + dataValueRange * ChartConst.GAUGE_SPLIT[2];

        return {
            title: getBaseOptions(title, theme).title,
            backgroundColor: ChartConst.BACKGROUND_COLOR,
            series: [
                {
                    type: 'gauge',
                    center: ChartConst.GAUGE_CENTER,
                    radius: ChartConst.GAUGE_RADIUS,
                    startAngle: ChartConst.GAUGE_ANGLE[0],
                    endAngle: ChartConst.GAUGE_ANGLE[1],
                    min: dataValueMin,
                    max: dataValueMax,
                    splitNumber: ChartConst.GAUGE_SPLIT_NUMBER,
                    axisLine: { lineStyle: { width: ChartConst.GAUGE_AXIS_LINE_WIDTH, color: ChartConst.GAUGE_AXIS_LINE_COLOR } },
                    axisTick: { length: ChartConst.GAUGE_AXIS_TICK_LENGTH, lineStyle: { color: ChartConst.GAUGE_LINE_STYLE } },
                    splitLine: { length: ChartConst.GAUGE_SPLIT_LINE_LENGTH, lineStyle: { color: ChartConst.GAUGE_LINE_STYLE } },
                    axisLabel: {
                        distance: ChartConst.GAUGE_AXIS_LABEL_DISTANCE,
                        formatter: function (value) {
                            if (value <= dataValueSplitOne) {
                                return '{one|' + value.toFixed(2) + '}';
                            } else if (value <= dataValueSplitTwo) {
                                return '{two|' + value.toFixed(2) + '}';
                            } else if (value <= dataValueSplitThree) {
                                return '{three|' + value.toFixed(2) + '}';
                            } else {
                                return '{four|' + value.toFixed(2) + '}';
                            }
                        },
                        rich: {
                            one: { color: ChartConst.GAUGE_COLOR[0], fontSize: ChartConst.GAUGE_AXIS_LABEL_FONT_SIZE },
                            two: { color: ChartConst.GAUGE_COLOR[1], fontSize: ChartConst.GAUGE_AXIS_LABEL_FONT_SIZE },
                            three: { color: ChartConst.GAUGE_COLOR[2], fontSize: ChartConst.GAUGE_AXIS_LABEL_FONT_SIZE },
                            four: { color: ChartConst.GAUGE_COLOR[3], fontSize: ChartConst.GAUGE_AXIS_LABEL_FONT_SIZE },
                        },
                    },
                    pointer: { width: ChartConst.GAUGE_POINTER_WIDTH },
                    title: {
                        color: theme?.['--primary-color'],
                        fontSize: ChartConst.GAUGE_TITLE_FONT_SIZE,
                        offsetCenter: ChartConst.GAUGE_TITLE_OFFSET_CENTER,
                        fontWeight: ChartConst.GAUGE_TITLE_FONT_WEIGHT,
                    },
                    detail: {
                        valueAnimation: true,
                        fontSize: ChartConst.GAUGE_DETAIL_FONT_SIZE,
                        color: theme?.['--primary-color'],
                        offsetCenter: ChartConst.GAUGE_DETAIL_OFFSET_CENTER,
                        formatter: function (value) { return value.toFixed(2) },
                    },
                    data: [{value: data.value[2], name: data.value[0]}]
                }
            ]
        }
    },
};
// src/component/chart/chartConst.jsx

// Chart Type
export const GLOBAL_UPDATE_CHART = new Set(['surface', 'radar', 'area', 'areas', 'pie', 'text', 'gauge']);
export const SEQUENCE_UPDATE_CHART = new Set(['line', 'lines', 'bar', 'bars', 'sequence', 'sequences', 'scatter']);

// General Setting
export const BACKGROUND_COLOR = 'transparent';
export const DECIMAL = 2;
export const SHOW_SYMBOL = false;
export const SMOOTH = true;

export const AXIS_NAME_COLOR = '#333';
export const AXIS_NAME_FONT_SIZE = 12;
export const AXIS_LINE_COLOR = '#999';
export const AXIS_SPLIT_LINE_TYPE = 'dashed';
export const AXIS_SPLIT_LINE_COLOR = '#e0e0e0';
export const AXIS_HIDE_OVERLAP = true;

export const AREA_COLOR = 'rgba(64, 158, 255, 0.2)';
export const FONT_COLOR = '#673ab7';
export const FONT_SIZE = 16;

export const GRID_TOP = '23%'
export const GRID_LEFT = '3%';
export const GRID_RIGHT = '3%';
export const GRID_BOTTOM = '10%';
export const GRID_CONTAIN_LABEL = true;

export const TOOLTIP_TRIGGER = 'axis';
export const TOOLTIP_AXIS_POINTER_TYPE = 'cross';
export const TOOLTIP_AXIS_POINTER_LABEL_BACKGROUND_COLOR = '#6a7985';

export const TITLE_LEFT = 'center';
export const TITLE_TOP = 7;

export const LEGEND_TOP = 35;
export const LEGEND_SELECT_MODE = false;

// Line Chart
export const LINE_WIDTH = 2;
export const LINE_COLOR = '#409eff';
export const LINE_X_AXIS_TYPE = 'category';
export const LINE_X_AXIS_LABEL_INTERVAL = 'auto';

// Area Chart
export const AREA_CHART_WIDTH = 2;
export const AREA_CHART_COLOR = '#409eff';
export const AREA_CHART_X_AXIS_TYPE = 'category';
export const AREA_CHART_X_AXIS_LABEL_INTERVAL = 'auto';

// Sequence Chart
export const SEQUENCE_X_AXIS_TYPE = 'time';
export const SEQUENCE_X_AXIS_LABEL_INTERVAL = 'auto';

// Bar Chart
export const BAR_X_AXIS_TYPE = 'category';
export const BAR_X_AXIS_LABEL_INTERVAL = 'auto';
export const BAR_TOOLTIP_AXISPOINTER_TYPE = 'shadow';

// Pie Chart
export const PIE_SHOW_LABEL = true;
export const PIE_SHOW_LABEL_LINE = true;
export const PIE_RADIUS = ['40%', '65%'];
export const PIE_TOOLTIP_TRIGGER = 'item';
export const PIE_TOOLTIP_FORMATTER = '{b}: {c} ({d}%)';

// Scatter Chart
export const SCATTER_TOOLTIP_TRIGGER = 'item';
export const SCATTER_SYMBOL_SIZE = 10;

// Radar Chart
export const RADAR_INNER_DIAMETER = '50%';
export const RADAR_OUTER_DIAMETER = '60%';
export const RADAR_RADIUS = '70%';

//3D Surface Chart
export const SURFACE_X_DIMENSION = 0;
export const SURFACE_Y_DIMENSION = 1;
export const SURFACE_Z_DIMENSION = 2;
export const SURFACE_VISUALMAP_DIMENSION = 2;
export const SURFACE_GRID3D_BOXWIDTH = 100;
export const SURFACE_GRID3D_DEPTH = 100;
export const SURFACE_GRID3D_VIEWCONTROL_DISTANCE = 250;
export const SURFACE_X_AXIS_TYPE = 'value';
export const SURFACE_Y_AXIS_TYPE = 'value';
export const SURFACE_Z_AXIS_TYPE = 'value';
export const SURFACE_VISUALMAP_TYPE = 'continuous';
export const SURFACE_VISUALMAP_LEFT = 'right';
export const SURFACE_VISUALMAP_TOP = 'center';
export const SURFACE_VISUALMAP_TEXT = ['High', 'Low'];
export const SURFACE_VISUALMAP_CALCULABLE = true;
export const SURFACE_VISUALMAP_INRANGE_COLOR = [ '#5470c6', '#73c0de',  '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#d73027', '#ee6666'];
export const SURFACE_SERIES_WIREFRAME_SHOW = false;
export const SURFACE_SERIES_SHADING = 'color';

// Text Chart
export const TEXT_CHART_LEFT = 'center';
export const TEXT_CHART_TOP = 'center';
export const TEXT_CHART_FONT_SIZE = 'clamp(1.2rem, 1.6vw, 2.2rem)';
export const TEXT_CHART_FONT_WEIGHT = 'bold';
export const TEXT_CHART_FONT_ALIGN = 'center';
export const TEXT_CHART_FONT_VERTICAL_ALIGN = 'middle';
export const TEXT_CHART_LINE_HEIGHT = 40;
export const TEXT_CHART_Z_LEVEL = 10;

// Gauge Chart
export const GAUGE_CENTER = ['50%', '55%'];
export const GAUGE_RADIUS = '90%';
export const GAUGE_ANGLE = [210, -30];
export const GAUGE_SPLIT_NUMBER = 4;
export const GAUGE_SPLIT = [0.25, 0.5, 0.75, 1];
export const GAUGE_COLOR = ['#91cc75', '#fac858', '#fc8452', '#ee6666'];
export const GAUGE_AXIS_LINE_COLOR = [[0.25, '#91cc75'], [0.50, '#fac858'], [0.75, '#fc8452'], [1.00, '#ee6666']];
export const GAUGE_AXIS_LINE_WIDTH = 15;
export const GAUGE_AXIS_TICK_LENGTH = 10;
export const GAUGE_AXIS_LABEL_FONT_SIZE = 'clamp(0.6rem, 0.8vw, 1.0rem)';
export const GAUGE_AXIS_LABEL_DISTANCE = 30;
export const GAUGE_SPLIT_LINE_LENGTH = 20;
export const GAUGE_LINE_STYLE = 'auto';
export const GAUGE_POINTER_WIDTH = 5;
export const GAUGE_TITLE_FONT_SIZE = 'clamp(0.9rem, 0.8vw, 1.5rem)';
export const GAUGE_TITLE_FONT_WEIGHT = 'bold';
export const GAUGE_TITLE_OFFSET_CENTER = [0, '40%'];
export const GAUGE_DETAIL_FONT_SIZE = 'clamp(0.9rem, 0.8vw, 1.5rem)';
export const GAUGE_DETAIL_OFFSET_CENTER = [0, '60%'];


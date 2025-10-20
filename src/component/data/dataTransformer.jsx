// /src/component/data/dataTransformer.jsx

/**
 * * @param {Object} rawData - raw data obj from websocket
 * * @returns {Object} - converted data obj
 */
const transformSinglePointData = (rawData) => {

  if (!rawData || typeof rawData.timestamp === 'undefined' || typeof rawData.value === 'undefined') {
    console.error("Invalid data format received:", rawData);
    return null;
  }

  return {
    id: rawData.id || `data-${Date.now()}-${pointIndex}`,
    index: rawData.timestamp,
    value: rawData.value,
  };
};

/**
 * * @param {Array<Object>} rawDataList - a list of raw data point
 * * @returns {Array<Object>} - converted list
 */
const transformDataList = (rawDataList) => {
  if (!Array.isArray(rawDataList)) {
    console.error("Input is not an array:", rawDataList);
    return [];
  }
  
  return rawDataList.map(item => transformSinglePointData(item)).filter(item => item !== null);
};

export { 
  transformSinglePointData,
  transformDataList,
};
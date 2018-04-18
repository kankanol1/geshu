/**
 * define all the styles used in work canvas.
 */

const colorMap = {
  source: '#ff7a3a',
};

export const getStylesForType = (str) => {
  return colorMap[str];
};


const componentIconDict = {
  'csv-source': 'icon-csv-source',
  'column-transform': 'icon-preparation-transform',
  // the above are tests.

};

export const getIconNameForComponent = (str) => {
  return componentIconDict[str];
};

export default { getStylesForType, getIconNameForComponent };

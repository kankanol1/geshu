/**
 * define all the styles used in work canvas.
 */

const colorMap = {
  source: '#ff7a3a',
};

export const getStylesForType = (str) => {
  if (str === 'DataSink') {
    return '#ff7a3a';
  }
  // return colorMap[str];
  return '#3B57FF';
};


const componentIconDict = {
  'csv-source': 'icon-csv-source',
  'column-transform': 'icon-preparation-transform',
  // the above are tests.
  JsonDataSource: 'icon-datasource-csv', //
  ParquetDataSource: 'icon-datasource-parquet',
  TokenizerStage: 'icon-classifier-word-split',
  ColumnFilterTransformer: 'icon-preparation-filter',
  CommonPredictor: 'icon-prediction-common',
  LogisticRegressionStage: 'icon-classifier-logistic-regression',
  ConsoleDataSink: 'icon-datasink-avro', //
  JdbcDataSource: 'icon-datasource-db',
  AddLiteralColumnTransformer: 'icon-preparation-add-column',
  RandomSplitTransformer: 'icon-preparation-random-split',
  SelectTransformer: 'icon-preparation-select',
  ConsoleModelSink: 'icon-model-default',
  TrainValidationSplitTuner: 'icon-tuning-cv', //
  MetricsPredictor: 'icon-classifier-model-metrics', //
  CollectDataSink: 'icon-datasink-parquet', //
  ColumnRenameTransformer: 'icon-preparation-rename',
  FileDataSource: 'icon-datasource-csv',
  HashingTFStage: 'icon-classifier-hashingtf',
  CrossValidationTuner: 'icon-tuning-cv',

};

export const getIconNameForComponent = (str) => {
  return componentIconDict[str];
};

export default { getStylesForType, getIconNameForComponent };

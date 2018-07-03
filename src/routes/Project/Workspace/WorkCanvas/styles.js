/**
 * define all the styles used in work canvas.
 */

const colorMap = {
  source: '#ff7a3a',
};

export const getStylesForType = (str) => {
  switch (str) {
    case 'DataSink': return '#6f58c5';
    case 'Predictor': return '#ff7a3a';
    case 'Tuner': return '#06bad0';
    case 'DataSource': return '#e96664';
    case 'Stage': return '#ee8f03';
    case 'PStage': return '#ee8f03';
    case 'ModelSource': return '#48d16b';
    case 'ModelSink': return '#48d16b';
    case 'Transformer': return '#3B57FF';
    default:
      // eslint-disable-next-line
      console.warn('no color found for type: ', str);
      return '#000';
  }
};


const componentIconDict = {
  'csv-source': 'icon-csv-source',
  'column-transform': 'icon-preparation-transform',
  // the above are tests.
  JsonDataSource: 'icon-datasource-csv', //
  ParquetDataSource: 'icon-datasource-parquet',
  AvroDataSource: 'icon-datasource-avro',

  TokenizerStage: 'icon-classifier-word-split',
  ColumnFilterTransformer: 'icon-preparation-filter',
  CommonPredictor: 'icon-prediction-common',
  LogisticRegressionStage: 'icon-classifier-logistic-regression',
  ConsoleDataSink: 'icon-datasink-avro', //
  JdbcDataSource: 'icon-datasource-db',

  AddLiteralColumnTransformer: 'icon-preparation-add-column',
  RandomSplitTransformer: 'icon-preparation-random-split',
  UnionTransformer: 'icon-preparation-union',
  ColumnSplitTransformer: 'icon-preparation-split-column',
  FilterTransformer: 'icon-preparation-filter',
  ProjectTransformer: 'icon-preparation-select',
  ColumnValueInTransformer: 'icon-preparation-add-null',
  JoinTransformer: 'icon-preparation-join',
  TypeConversionTransformer: 'icon-preparation-transform',
  DropDuplicatesTransformer: 'icon-preparation-unique',
  ColumnRenameTransformer: 'icon-preparation-rename',

  MetricsPredictor: 'icon-classifier-model-metrics', //
  HashingTFStage: 'icon-classifier-hashingtf',
  DecisionTreeClassifierPStage: 'icon-classifier-decision-tree',
  // TODO: fix the following
  OneHotEncoderStage: 'icon-encoder-one-hot',
  SupportVectorMachineClassifierStage: 'icon-classifier-svm',
  HashingTF: 'icon-classifier-hashingtf',
  NaiveBayesClassifierStage: 'icon-classifier-naive-bayes',
  RandomForestClassifierPStage: 'icon-classifier-random-forest',
  GradientBoostedTreeClassifierPStage: 'icon-classifier-boost-tree',
  MultilayerPerceptronClassifierStage: 'icon-classifier-nn',

  GradientBoostedTreeRegressorPStage: 'icon-regression-boost-tree',
  LinearRegressionStage: 'icon-regression-linear-regression',
  DecisionTreeRegressorPStage: 'icon-regression-decision-tree',
  RandomForestRegressorPStage: 'icon-regression-random-forest',


  ConsoleModelSink: 'icon-model-default',
  TrainValidationSplitTuner: 'icon-tuning-cv', //
  CollectDataSink: 'icon-datasink-parquet', //
  FileDataSource: 'icon-datasource-csv',
  CrossValidationTuner: 'icon-tuning-cv',

  FileModelSink: 'icon-model-default',
  KMeansStage: 'icon-clustering-kmeans',
  FileModelSource: 'icon-model-default',

  FileDataSink: 'icon-datasink-csv',
  ParquetDataSink: 'icon-datasink-parquet',

};

export const getIconNameForComponent = (str) => {
  return componentIconDict[str];
};

export default { getStylesForType, getIconNameForComponent };

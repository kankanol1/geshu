/**
 * define all the styles used in work canvas.
 */

const colorMap = {
  source: '#ff7a3a',
};

export const getStylesForType = (str, code) => {
  // exceptions.
  if (code.indexOf('Classifier') > 0) {
    return '#ff7a3a';
  } else if (code.indexOf('Regress') > 0) {
    return '#ee8f03';
  }
  switch (code) {
    case 'StringIndexerPStage':
    case 'OneHotEncoderPStage':
    case 'ImputerPStage':
    case 'BucketizerPStage':
      return '#3B57FF';
    case 'KMeansStage':
      return '#95C801';
    default:
      break;
  }
  switch (str) {
    case 'DataSink':
      return '#6f58c5';
    case 'Predictor':
      return '#319FF8';
    case 'Tuner':
      return '#06bad0';
    case 'DataSource':
      return '#e96664';
    case 'Stage':
      return '#FF7A3A';
    case 'PStage':
      return '#ee8f03';
    case 'ModelSource':
      return '#48d16b';
    case 'ModelSink':
      return '#48d16b';
    case 'Transformer':
      return '#3B57FF';
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

  MetricsPredictor: 'icon-prediction-common', //
  HashingTFStage: 'icon-classifier-hashingtf',
  DecisionTreeClassifierPStage: 'icon-classifier-decision-tree',
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

  // TODO: fix the following
  VectorAssemblerPStage: 'icon-classifier-cv',
  OneHotEncoderPStage: 'icon-preparation-filter',
  StringIndexerPStage: 'icon-preparation-transform',
  HiveDataSink: 'icon-datasink-db',

  ImputerPStage: 'icon-preparation-add-null',
  BucketizerPStage: 'icon-preparation-split-column',

  AggregateTransformer: 'icon-preparation-filter',
  SwitchCaseTransformer: 'icon-preparation-filter',
};

export const getIconNameForComponent = str => {
  return componentIconDict[str];
};

export const componentSize = { height: 100, width: 100 };

export default { getStylesForType, getIconNameForComponent, componentSize };

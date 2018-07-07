const componentList = [
  {
    name: 'DataSink',
    key: 'DataSink',
    components: [
      {
        name: 'CollectDataSink',
        code: 'CollectDataSink',
        type: 'DataSink',
        inputs: [
          {
            id: 'i1',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.5,
            connects: [
              'Dataset',
              'DatasetRef',
            ],
          },
        ],
        outputs: [],
      },
      {
        name: 'FileDataSink',
        code: 'FileDataSink',
        type: 'DataSink',
        inputs: [
          {
            id: 'i1',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.5,
            connects: [
              'Dataset',
              'DatasetRef',
            ],
          },
        ],
        outputs: [],
      },
      {
        name: 'ParquetDataSink',
        code: 'ParquetDataSink',
        type: 'DataSink',
        inputs: [
          {
            id: 'i1',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.5,
            connects: [
              'Dataset',
              'DatasetRef',
            ],
          },
        ],
        outputs: [],
      },
      {
        name: 'ConsoleDataSink',
        code: 'ConsoleDataSink',
        type: 'DataSink',
        inputs: [
          {
            id: 'i1',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.5,
            connects: [
              'Dataset',
              'DatasetRef',
            ],
          },
        ],
        outputs: [],
      },
      {
        name: 'HiveDataSink',
        code: 'HiveDataSink',
        type: 'DataSink',
        inputs: [
          {
            id: 'i1',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.5,
            connects: [
              'Dataset',
              'DatasetRef',
            ],
          },
        ],
        outputs: [],
      },
    ],
  },
  {
    name: 'Transformer',
    key: 'Transformer',
    components: [
      {
        name: 'AddLiteralColumnTransformer',
        code: 'AddLiteralColumnTransformer',
        type: 'Transformer',
        inputs: [
          {
            id: 'i1',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.5,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'data',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'RandomSplitTransformer',
        code: 'RandomSplitTransformer',
        type: 'Transformer',
        inputs: [
          {
            id: 'i1',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.5,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'f',
            hint: 'Dataset',
            x: 1,
            y: 0.3333333333333333,
            type: 'Dataset',
          },
          {
            id: 'o2',
            label: 's',
            hint: 'Dataset',
            x: 1,
            y: 0.6666666666666666,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'UnionTransformer',
        code: 'UnionTransformer',
        type: 'Transformer',
        inputs: [
          {
            id: 'i1',
            label: 'left',
            hint: 'left',
            x: 3,
            y: 0.3333333333333333,
            connects: [
              'Dataset',
            ],
          },
          {
            id: 'i2',
            label: 'right',
            hint: 'right',
            x: 3,
            y: 0.6666666666666666,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'data',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'ColumnSplitTransformer',
        code: 'ColumnSplitTransformer',
        type: 'Transformer',
        inputs: [
          {
            id: 'i1',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.5,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'data',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'FilterTransformer',
        code: 'FilterTransformer',
        type: 'Transformer',
        inputs: [
          {
            id: 'i1',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.5,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'data',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'ProjectTransformer',
        code: 'ProjectTransformer',
        type: 'Transformer',
        inputs: [
          {
            id: 'i1',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.5,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'data',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'ColumnValueInTransformer',
        code: 'ColumnValueInTransformer',
        type: 'Transformer',
        inputs: [
          {
            id: 'i1',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.5,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'data',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'JoinTransformer',
        code: 'JoinTransformer',
        type: 'Transformer',
        inputs: [
          {
            id: 'i1',
            label: 'left',
            hint: 'left',
            x: 3,
            y: 0.3333333333333333,
            connects: [
              'Dataset',
            ],
          },
          {
            id: 'i2',
            label: 'right',
            hint: 'right',
            x: 3,
            y: 0.6666666666666666,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'data',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'ColumnRenameTransformer',
        code: 'ColumnRenameTransformer',
        type: 'Transformer',
        inputs: [
          {
            id: 'i1',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.5,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'data',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'TypeConversionTransformer',
        code: 'TypeConversionTransformer',
        type: 'Transformer',
        inputs: [
          {
            id: 'i1',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.5,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'data',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'DropDuplicatesTransformer',
        code: 'DropDuplicatesTransformer',
        type: 'Transformer',
        inputs: [
          {
            id: 'i1',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.5,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'data',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
    ],
  },
  {
    name: 'Predictor',
    key: 'Predictor',
    components: [
      {
        name: 'CommonPredictor',
        code: 'CommonPredictor',
        type: 'Predictor',
        inputs: [
          {
            id: 'i1',
            label: 'model',
            hint: 'model',
            x: 3,
            y: 0.3333333333333333,
            connects: [
              'Model',
              'TunedModel',
            ],
          },
          {
            id: 'i2',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.6666666666666666,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'dataRef',
            hint: 'DatasetRef',
            x: 1,
            y: 0.5,
            type: 'DatasetRef',
          },
        ],
      },
      {
        name: 'MetricsPredictor',
        code: 'MetricsPredictor',
        type: 'Predictor',
        inputs: [
          {
            id: 'i1',
            label: 'model',
            hint: 'model',
            x: 3,
            y: 0.3333333333333333,
            connects: [
              'Model',
              'TunedModel',
            ],
          },
          {
            id: 'i2',
            label: 'data',
            hint: 'data',
            x: 3,
            y: 0.6666666666666666,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'dataRef',
            hint: 'DatasetRef',
            x: 1,
            y: 0.5,
            type: 'DatasetRef',
          },
        ],
      },
    ],
  },
  {
    name: 'PStage',
    key: 'PStage',
    components: [
      {
        name: 'DecisionTreeClassifierPStage',
        code: 'DecisionTreeClassifierPStage',
        type: 'PStage',
        inputs: [
          {
            id: 'i1',
            label: 'trainSet',
            hint: 'trainSet',
            x: 3,
            y: 0.3333333333333333,
            connects: [
              'Model',
              'Dataset',
            ],
          },
          {
            id: 'i2',
            label: 'fullSet',
            hint: 'fullSet',
            x: 3,
            y: 0.6666666666666666,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
      {
        name: 'OneHotEncoderStage',
        code: 'OneHotEncoderStage',
        type: 'PStage',
        inputs: [
          {
            id: 'i1',
            label: 'trainSet',
            hint: 'trainSet',
            x: 3,
            y: 0.3333333333333333,
            connects: [
              'Model',
              'Dataset',
            ],
          },
          {
            id: 'i2',
            label: 'fullSet',
            hint: 'fullSet',
            x: 3,
            y: 0.6666666666666666,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
      {
        name: 'StringIndexerPStage',
        code: 'StringIndexerPStage',
        type: 'PStage',
        inputs: [
          {
            id: 'i1',
            label: 'trainSet',
            hint: 'trainSet',
            x: 3,
            y: 0.3333333333333333,
            connects: [
              'Model',
              'Dataset',
            ],
          },
          {
            id: 'i2',
            label: 'fullSet',
            hint: 'fullSet',
            x: 3,
            y: 0.6666666666666666,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
      {
        name: 'GradientBoostedTreeRegressorPStage',
        code: 'GradientBoostedTreeRegressorPStage',
        type: 'PStage',
        inputs: [
          {
            id: 'i1',
            label: 'trainSet',
            hint: 'trainSet',
            x: 3,
            y: 0.3333333333333333,
            connects: [
              'Model',
              'Dataset',
            ],
          },
          {
            id: 'i2',
            label: 'fullSet',
            hint: 'fullSet',
            x: 3,
            y: 0.6666666666666666,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
      {
        name: 'RandomForestClassifierPStage',
        code: 'RandomForestClassifierPStage',
        type: 'PStage',
        inputs: [
          {
            id: 'i1',
            label: 'trainSet',
            hint: 'trainSet',
            x: 3,
            y: 0.3333333333333333,
            connects: [
              'Model',
              'Dataset',
            ],
          },
          {
            id: 'i2',
            label: 'fullSet',
            hint: 'fullSet',
            x: 3,
            y: 0.6666666666666666,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
      {
        name: 'DecisionTreeRegressorPStage',
        code: 'DecisionTreeRegressorPStage',
        type: 'PStage',
        inputs: [
          {
            id: 'i1',
            label: 'trainSet',
            hint: 'trainSet',
            x: 3,
            y: 0.3333333333333333,
            connects: [
              'Model',
              'Dataset',
            ],
          },
          {
            id: 'i2',
            label: 'fullSet',
            hint: 'fullSet',
            x: 3,
            y: 0.6666666666666666,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
      {
        name: 'GradientBoostedTreeClassifierPStage',
        code: 'GradientBoostedTreeClassifierPStage',
        type: 'PStage',
        inputs: [
          {
            id: 'i1',
            label: 'trainSet',
            hint: 'trainSet',
            x: 3,
            y: 0.3333333333333333,
            connects: [
              'Model',
              'Dataset',
            ],
          },
          {
            id: 'i2',
            label: 'fullSet',
            hint: 'fullSet',
            x: 3,
            y: 0.6666666666666666,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
      {
        name: 'RandomForestRegressorPStage',
        code: 'RandomForestRegressorPStage',
        type: 'PStage',
        inputs: [
          {
            id: 'i1',
            label: 'trainSet',
            hint: 'trainSet',
            x: 3,
            y: 0.3333333333333333,
            connects: [
              'Model',
              'Dataset',
            ],
          },
          {
            id: 'i2',
            label: 'fullSet',
            hint: 'fullSet',
            x: 3,
            y: 0.6666666666666666,
            connects: [
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
    ],
  },
  {
    name: 'ModelSink',
    key: 'ModelSink',
    components: [
      {
        name: 'ConsoleModelSink',
        code: 'ConsoleModelSink',
        type: 'ModelSink',
        inputs: [
          {
            id: 'i1',
            label: 'model',
            hint: 'model',
            x: 3,
            y: 0.5,
            connects: [
              'Model',
              'TunedModel',
            ],
          },
        ],
        outputs: [],
      },
      {
        name: 'FileModelSink',
        code: 'FileModelSink',
        type: 'ModelSink',
        inputs: [
          {
            id: 'i1',
            label: 'model',
            hint: 'model',
            x: 3,
            y: 0.5,
            connects: [
              'Model',
              'TunedModel',
            ],
          },
        ],
        outputs: [],
      },
    ],
  },
  {
    name: 'Stage',
    key: 'Stage',
    components: [
      {
        name: 'TokenizerStage',
        code: 'TokenizerStage',
        type: 'Stage',
        inputs: [
          {
            id: 'i1',
            label: 'all',
            hint: 'all',
            x: 3,
            y: 0.5,
            connects: [
              'Model',
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
      {
        name: 'SupportVectorMachineClassifierStage',
        code: 'SupportVectorMachineClassifierStage',
        type: 'Stage',
        inputs: [
          {
            id: 'i1',
            label: 'all',
            hint: 'all',
            x: 3,
            y: 0.5,
            connects: [
              'Model',
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
      {
        name: 'LinearRegressionStage',
        code: 'LinearRegressionStage',
        type: 'Stage',
        inputs: [
          {
            id: 'i1',
            label: 'all',
            hint: 'all',
            x: 3,
            y: 0.5,
            connects: [
              'Model',
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
      {
        name: 'NaiveBayesClassifierStage',
        code: 'NaiveBayesClassifierStage',
        type: 'Stage',
        inputs: [
          {
            id: 'i1',
            label: 'all',
            hint: 'all',
            x: 3,
            y: 0.5,
            connects: [
              'Model',
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
      {
        name: 'HashingTFStage',
        code: 'HashingTFStage',
        type: 'Stage',
        inputs: [
          {
            id: 'i1',
            label: 'all',
            hint: 'all',
            x: 3,
            y: 0.5,
            connects: [
              'Model',
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
      {
        name: 'MultilayerPerceptronClassifierStage',
        code: 'MultilayerPerceptronClassifierStage',
        type: 'Stage',
        inputs: [
          {
            id: 'i1',
            label: 'all',
            hint: 'all',
            x: 3,
            y: 0.5,
            connects: [
              'Model',
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
      {
        name: 'KMeansStage',
        code: 'KMeansStage',
        type: 'Stage',
        inputs: [
          {
            id: 'i1',
            label: 'all',
            hint: 'all',
            x: 3,
            y: 0.5,
            connects: [
              'Model',
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
      {
        name: 'VectorAssemblerStage',
        code: 'VectorAssemblerStage',
        type: 'Stage',
        inputs: [
          {
            id: 'i1',
            label: 'all',
            hint: 'all',
            x: 3,
            y: 0.5,
            connects: [
              'Model',
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
      {
        name: 'LogisticRegressionStage',
        code: 'LogisticRegressionStage',
        type: 'Stage',
        inputs: [
          {
            id: 'i1',
            label: 'all',
            hint: 'all',
            x: 3,
            y: 0.5,
            connects: [
              'Model',
              'Dataset',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
    ],
  },
  {
    name: 'Tuner',
    key: 'Tuner',
    components: [
      {
        name: 'TrainValidationSplitTuner',
        code: 'TrainValidationSplitTuner',
        type: 'Tuner',
        inputs: [
          {
            id: 'i1',
            label: 'model',
            hint: 'model',
            x: 3,
            y: 0.5,
            connects: [
              'Model',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'Model',
            hint: 'TunedModel',
            x: 1,
            y: 0.5,
            type: 'TunedModel',
          },
        ],
      },
      {
        name: 'CrossValidationTuner',
        code: 'CrossValidationTuner',
        type: 'Tuner',
        inputs: [
          {
            id: 'i1',
            label: 'model',
            hint: 'model',
            x: 3,
            y: 0.5,
            connects: [
              'Model',
            ],
          },
        ],
        outputs: [
          {
            id: 'o1',
            label: 'Model',
            hint: 'TunedModel',
            x: 1,
            y: 0.5,
            type: 'TunedModel',
          },
        ],
      },
    ],
  },
  {
    name: 'ModelSource',
    key: 'ModelSource',
    components: [
      {
        name: 'FileModelSource',
        code: 'FileModelSource',
        type: 'ModelSource',
        inputs: [],
        outputs: [
          {
            id: 'o1',
            label: 'model',
            hint: 'Model',
            x: 1,
            y: 0.5,
            type: 'Model',
          },
        ],
      },
    ],
  },
  {
    name: 'DataSource',
    key: 'DataSource',
    components: [
      {
        name: 'FileDataSource',
        code: 'FileDataSource',
        type: 'DataSource',
        inputs: [],
        outputs: [
          {
            id: 'o1',
            label: 'data',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'ParquetDataSource',
        code: 'ParquetDataSource',
        type: 'DataSource',
        inputs: [],
        outputs: [
          {
            id: 'o1',
            label: 'data',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'JsonDataSource',
        code: 'JsonDataSource',
        type: 'DataSource',
        inputs: [],
        outputs: [
          {
            id: 'o1',
            label: 'data',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'JdbcDataSource',
        code: 'JdbcDataSource',
        type: 'DataSource',
        inputs: [],
        outputs: [
          {
            id: 'o1',
            label: 'data',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'AvroDataSource',
        code: 'AvroDataSource',
        type: 'DataSource',
        inputs: [],
        outputs: [
          {
            id: 'o1',
            label: 'data',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
    ],
  },
];

export default componentList;

const componentList = [
  {
    name: 'DataSink',
    key: 'DataSink',
    components: [
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
            label: 'dataset',
            hint: 'dataset',
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
            label: 'dataset',
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
            label: 'dataset',
            hint: 'dataset',
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
            label: 'dataset',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'ColumnFilterTransformer',
        code: 'ColumnFilterTransformer',
        type: 'Transformer',
        inputs: [
          {
            id: 'i1',
            label: 'dataset',
            hint: 'dataset',
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
            label: 'dataset',
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
            label: 'dataset',
            hint: 'dataset',
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
            label: 'dataset',
            hint: 'Dataset',
            x: 1,
            y: 0.5,
            type: 'Dataset',
          },
        ],
      },
      {
        name: 'SelectTransformer',
        code: 'SelectTransformer',
        type: 'Transformer',
        inputs: [
          {
            id: 'i1',
            label: 'dataset',
            hint: 'dataset',
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
            label: 'dataset',
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
            label: 'model/tunedModel',
            hint: 'model/tunedModel',
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
            label: 'model/tunedModel',
            hint: 'model/tunedModel',
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
            label: 'model/tunedModel',
            hint: 'model/tunedModel',
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
        name: 'LogisticRegressionStage',
        code: 'LogisticRegressionStage',
        type: 'Stage',
        inputs: [
          {
            id: 'i1',
            label: 'data/model',
            hint: 'data/model',
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
        name: 'TokenizerStage',
        code: 'TokenizerStage',
        type: 'Stage',
        inputs: [
          {
            id: 'i1',
            label: 'data/model',
            hint: 'data/model',
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
            label: 'data/model',
            hint: 'data/model',
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
            label: 'tunedModel',
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
            label: 'tunedModel',
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
    components: [],
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
            label: 'dataset',
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
            label: 'dataset',
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
            label: 'dataset',
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
            label: 'dataset',
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

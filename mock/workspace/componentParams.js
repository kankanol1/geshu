/**
 * mock: get all the params of a component.
 * */

const allComponents = {
  /* ==================================== */
  ConsoleDataSink: {
    title: 'ConsoleDataSinkConf',
    type: 'object',
    properties: {},
  },
  /* ==================================== */
  AddLiteralColumnTransformer: {
    title: 'AllLiteralColumnTransformerConf',
    type: 'object',
    properties: {
      columnName: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
      },
      literal: {
        title: 'Fixed_Any',
        type: 'object',
        properties: {
          value: {
            title: 'Any',
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
  /* ==================================== */
  RandomSplitTransformer: {
    title: 'RandomSplitTransformerConf',
    type: 'object',
    properties: {
      weights: {
        title: 'Fixed_Double_Array',
        type: 'object',
        properties: {
          value: {
            type: 'array',
            items: {
              type: 'number',
              // format: 'number',
            },
          },
        },
      },
    },
  },
  /* ==================================== */
  ColumnFilterTransformer: {
    title: 'ColumnFilterTransformerConf',
    type: 'object',
    properties: {
      columnName: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
      },
      valueList: {
        title: 'Fixed_String_Array',
        type: 'object',
        properties: {
          value: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  /* ==================================== */
  ColumnRenameTransformer: {
    title: 'ColumnRenameTransformerConf',
    type: 'object',
    properties: {
      existingName: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
      },
      newName: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
      },
    },
  },
  /* ==================================== */
  SelectTransformer: {
    title: 'SelectTransformerConf',
    type: 'object',
    properties: {
      cols: {
        title: 'Fixed_String_Array',
        type: 'object',
        properties: {
          value: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  /* ==================================== */
  CommonPredictor: {
    title: 'CommonPredictorConf',
    type: 'object',
    properties: {},
  },
  ConsoleModelSink: {
    title: 'ConsoleModelSinkConf',
    type: 'object',
    properties: {},
  },
  LogisticRegressionStage: {
    title: 'LogisticRegressionStageConf',
    type: 'object',
    properties: {
      maxIter: {
        title: 'Tunable_Int',
        type: 'object',
        properties: {
          tunableType: {
            type: 'string',
            enum: [
              'FIXED',
              'GRID',
              'RANGE',
            ],
          },
          tunableValue: {
            required: false,
            type: 'array',
            items: {
              type: 'number',
              format: 'number',
            },
          },
          value: {
            required: false,
            type: 'number',
            format: 'number',
          },
        },
      },
      regParam: {
        title: 'Tunable_Double',
        type: 'object',
        properties: {
          tunableType: {
            type: 'string',
            enum: [
              'FIXED',
              'GRID',
              'RANGE',
            ],
          },
          tunableValue: {
            required: false,
            type: 'array',
            items: {
              type: 'number',
              format: 'number',
            },
          },
          value: {
            required: false,
            type: 'number',
            format: 'number',
          },
        },
      },
    },
  },
  TokenizerStage: {
    title: 'TokenizerStageConf',
    type: 'object',
    properties: {
      inputCol: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
      },
      outputCol: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
      },
    },
  },
  HashingTFStage: {
    title: 'HashingTFStageConf',
    type: 'object',
    properties: {
      inputCol: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
      },
      numFeatures: {
        title: 'Tunable_Int',
        type: 'object',
        properties: {
          tunableType: {
            type: 'string',
            enum: [
              'FIXED',
              'GRID',
              'RANGE',
            ],
          },
          tunableValue: {
            required: false,
            type: 'array',
            items: {
              type: 'number',
              format: 'number',
            },
          },
          value: {
            required: false,
            type: 'number',
            format: 'number',
          },
        },
      },
      outputCol: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
      },
    },
  },
  CrossValidationTuner: {
    title: 'CrossValidationTunerConf',
    type: 'object',
    properties: {
      evaluator: {
        type: 'string',
        enum: [
          'BinaryClassification',
          'MulticlassClassification',
          'Regression',
        ],
      },
      numFolds: {
        title: 'Fixed_Int',
        type: 'object',
        properties: {
          value: {
            type: 'number',
            format: 'number',
          },
        },
      },
    },
  },
  FileDataSource: {
    title: 'FileDataSourceConf',
    type: 'object',
    properties: {
      definedSchema: {
        title: 'Switch_Schema',
        type: 'object',
        properties: {
          on: {
            type: 'boolean',
          },
          schema: {
            required: false,
            type: 'array',
            items: {
              title: 'StructFieldMapping',
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                nullable: {
                  type: 'boolean',
                },
                type: {
                  type: 'string',
                },
              },
            },
          },
        },
        description: '是否指定表格Schema',
      },
      format: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '文件格式',
      },
      header: {
        required: false,
        title: 'Fixed_Boolean',
        type: 'object',
        properties: {
          value: {
            type: 'boolean',
          },
        },
        description: '文件是否包含Header',
      },
      path: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '文件路径',
      },
    },
  },
  'csv-source': {
    title: 'CSVSource',
    type: 'object',
    properties: {
      diy: {
        title: 'DIY',
        type: 'object',
        description: '自定義組件',
        properties: {
          value: {
            type: 'string',
          },
        },
      },
    },
  },
};

const componentParam = (id) => {
  return allComponents[id];
};

export default componentParam;

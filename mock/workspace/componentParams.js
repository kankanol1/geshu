/**
 * mock: get all the params of a component.
 * */

const allComponents = {
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
        description: '输入列',
      },
      outputCol: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '输出列',
      },
    },
  },
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
        description: '列名',
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
        description: '过滤值',
      },
    },
  },
  CommonPredictor: {
    title: 'CommonPredictorConf',
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
            description: '调节类型',
          },
          tunableValue: {
            required: false,
            type: 'array',
            items: {
              type: 'integer',
            },
            description: '参数取值',
          },
          value: {
            required: false,
            type: 'integer',
            description: '默认值',
          },
        },
        description: '最大迭代次数',
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
            description: '调节类型',
          },
          tunableValue: {
            required: false,
            type: 'array',
            items: {
              type: 'number',
            },
            description: '参数取值',
          },
          value: {
            required: false,
            type: 'number',
            description: '默认值',
          },
        },
        description: '迭代参数',
      },
    },
  },
  ConsoleDataSink: {
    title: 'ConsoleDataSinkConf',
    type: 'object',
    properties: {},
  },
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
        description: '列名',
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
        description: '值',
      },
    },
  },
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
            },
          },
        },
        description: '给个double的列表',
      },
    },
  },
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
        description: '选择列',
      },
    },
  },
  ConsoleModelSink: {
    title: 'ConsoleModelSinkConf',
    type: 'object',
    properties: {},
  },
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
        description: '重命名列',
      },
      newName: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '新列名',
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
        description: '输入列',
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
            description: '调节类型',
          },
          tunableValue: {
            required: false,
            type: 'array',
            items: {
              type: 'integer',
            },
            description: '参数取值',
          },
          value: {
            required: false,
            type: 'integer',
            description: '默认值',
          },
        },
        description: '特征数目',
      },
      outputCol: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '输出列',
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
        description: '评价类型',
      },
      numFolds: {
        title: 'Fixed_Int',
        type: 'object',
        properties: {
          value: {
            type: 'integer',
          },
        },
        description: 'fold',
      },
    },
  },
};

const componentParam = (id) => {
  return allComponents[id];
};

export default componentParam;

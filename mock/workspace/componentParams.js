/**
 * mock: get all the params of a component.
 * */

const allComponents = {
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
      database: {
        title: 'Database_Path',
        type: 'object',
        description: '选择数据库',
        properties: {
          value: {
            type: 'string',
          },
        },
      },
    },
  },
  FileDataSink: {
    title: 'FileDataSinkConf',
    type: 'object',
    properties: {
      format: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '存储格式',
      },
      relativePath: {
        title: 'Fixed_Remote_Path',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '相对路径',
      },
    },
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
            type: 'array',
            items: {
              type: 'integer',
            },
            description: '可调值',
          },
          value: {
            type: 'integer',
            description: '固定值',
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
            type: 'array',
            items: {
              type: 'number',
            },
            description: '可调值',
          },
          value: {
            type: 'number',
            description: '固定值',
          },
        },
        description: '正则化参数',
      },
    },
  },
  NaiveBayesClassifierStage: {
    title: 'NaiveBayesStageStageConf',
    type: 'object',
    properties: {},
  },
  JdbcDataSource: {
    title: 'JdbcDataSourceConf',
    type: 'object',
    properties: {
      dbtable: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '表名',
      },
      driver: {
        type: 'string',
        enum: [
          'com.mysql.cj.jdbc.Driver',
        ],
        description: '驱动',
      },
      password: {
        title: 'Fixed_Password',
        type: 'object',
        properties: {
          PASSWORD: {
            type: 'string',
          },
          SALT: {
            type: 'string',
          },
          encrypted: {
            type: 'boolean',
          },
          value: {
            type: 'string',
          },
        },
        description: '密码',
      },
      query: {
        required: false,
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '查询',
      },
      url: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: 'jdbc url',
      },
      user: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '用户名',
      },
    },
  },
  ParquetDataSink: {
    title: 'ParquetDataSinkConf',
    type: 'object',
    properties: {
      relativePath: {
        title: 'Fixed_Remote_Path',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '相对路径',
      },
    },
  },
  DropDuplicatesTransformer: {
    title: 'DropDuplicatesTransformerConf',
    type: 'object',
    properties: {
      columns: {
        title: 'Fixed_Column_Array',
        type: 'object',
        properties: {
          value: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        description: '去重列',
      },
    },
  },
  JoinTransformer: {
    title: 'JoinTransformerConf',
    type: 'object',
    properties: {
      joinExpr: {
        title: 'Fixed_Boolean_Expr',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: 'Join条件',
      },
    },
  },
  TrainValidationSplitTuner: {
    title: 'TrainValidationSplitTunerConf',
    type: 'object',
    properties: {
      modelType: {
        type: 'string',
        enum: [
          'BinaryClassification',
          'MulticlassClassification',
          'Regression',
          'Clustering',
        ],
        description: '模型类型',
      },
      trainRatio: {
        title: 'Fixed_Double',
        type: 'object',
        properties: {
          value: {
            type: 'number',
          },
        },
        description: '测试集比例',
      },
    },
  },
  StringIndexerPStage: {
    title: 'StringIndexerPStageConf',
    type: 'object',
    properties: {
      columnNamePairs: {
        title: 'Column_Name_Pair_Array',
        type: 'object',
        properties: {
          value: {
            type: 'array',
            items: {
              title: 'Column_Name_Pair',
              type: 'object',
              properties: {
                column: {
                  type: 'string',
                },
                name: {
                  type: 'string',
                },
              },
            },
          },
        },
        description: '输入输出列',
      },
    },
  },
  RandomForestClassifierPStage: {
    title: 'RandomForestClassifierPStageConf',
    type: 'object',
    properties: {
      featuresInputCol: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '特征列',
      },
      labelInputCol: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '标签列',
      },
      maxCategories: {
        title: 'Fixed_Int',
        type: 'object',
        properties: {
          value: {
            type: 'integer',
          },
        },
        description: '最大类别数',
      },
      treeNumber: {
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
            type: 'array',
            items: {
              type: 'integer',
            },
            description: '可调值',
          },
          value: {
            type: 'integer',
            description: '固定值',
          },
        },
        description: '树的个数',
      },
    },
  },
  ColumnSplitTransformer: {
    title: 'ColumnSplitTransformerConf',
    type: 'object',
    properties: {
      pattern: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '拆分模式',
      },
      sourceColumn: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '拆分列',
      },
      targetColumns: {
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
        description: '目标列',
      },
    },
  },
  HiveDataSink: {
    title: 'HiveDataSinkConf',
    type: 'object',
    properties: {},
  },
  GradientBoostedTreeClassifierPStage: {
    title: 'GradientBoostedTreeClassifierPStageConf',
    type: 'object',
    properties: {
      featuresInputCol: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '特征列',
      },
      labelInputCol: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '标签列',
      },
      maxCategories: {
        title: 'Fixed_Int',
        type: 'object',
        properties: {
          value: {
            type: 'integer',
          },
        },
        description: '最大类别数',
      },
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
            type: 'array',
            items: {
              type: 'integer',
            },
            description: '可调值',
          },
          value: {
            type: 'integer',
            description: '固定值',
          },
        },
        description: '最大迭代次数',
      },
    },
  },
  FileDataSource: {
    title: 'FileDataSourceConf',
    type: 'object',
    properties: {
      sourceConf: {
        title: 'File_Source_Conf',
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
            title: 'Read_File_Path',
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
    },
  },
  ProjectTransformer: {
    title: 'ProjectTransformerConf',
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
  HashingTFStage: {
    title: 'HashingTFStageConf',
    type: 'object',
    properties: {
      columnAndName: {
        title: 'Column_Name_Pair',
        type: 'object',
        properties: {
          column: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
        },
        description: '输入列和输出列',
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
            type: 'array',
            items: {
              type: 'integer',
            },
            description: '可调值',
          },
          value: {
            type: 'integer',
            description: '固定值',
          },
        },
        description: '特征数目',
      },
    },
  },
  CrossValidationTuner: {
    title: 'CrossValidationTunerConf',
    type: 'object',
    properties: {
      modelType: {
        type: 'string',
        enum: [
          'BinaryClassification',
          'MulticlassClassification',
          'Regression',
          'Clustering',
        ],
        description: '模型类型',
      },
      numFolds: {
        title: 'Fixed_Int',
        type: 'object',
        properties: {
          value: {
            type: 'integer',
          },
        },
        description: '折叠数',
      },
    },
  },
  FileModelSink: {
    title: 'ConsoleModelSinkConf',
    type: 'object',
    properties: {},
  },
  GradientBoostedTreeRegressorPStage: {
    title: 'GradientBoostedTreeRegressorPStageConf',
    type: 'object',
    properties: {
      featuresInputCol: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '特征列',
      },
      labelInputCol: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '标签列',
      },
      maxCategories: {
        title: 'Fixed_Int',
        type: 'object',
        properties: {
          value: {
            type: 'integer',
          },
        },
        description: '类别数阈值',
      },
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
            type: 'array',
            items: {
              type: 'integer',
            },
            description: '可调值',
          },
          value: {
            type: 'integer',
            description: '固定值',
          },
        },
        description: '最大迭代次数',
      },
    },
  },
  KMeansStage: {
    title: 'KMeansStageConf',
    type: 'object',
    properties: {
      featuresCol: {
        required: false,
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '特征列',
      },
      k: {
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
            type: 'array',
            items: {
              type: 'integer',
            },
            description: '可调值',
          },
          value: {
            type: 'integer',
            description: '固定值',
          },
        },
        description: 'K取值',
      },
      predictionCol: {
        required: false,
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '预测列',
      },
    },
  },
  ParquetDataSource: {
    title: 'ParquetDataSourceConf',
    type: 'object',
    properties: {
      path: {
        title: 'Read_File_Path',
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
  JsonDataSource: {
    title: 'JsonDataSourceConf',
    type: 'object',
    properties: {
      path: {
        title: 'Read_File_Path',
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
  ColumnValueInTransformer: {
    title: 'ColumnValueInTransformerConf',
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
  RandomForestRegressorPStage: {
    title: 'RandomForestRegressorPStageConf',
    type: 'object',
    properties: {
      featuresInputCol: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '特征列',
      },
      labelInputCol: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '标签列',
      },
      maxCategories: {
        title: 'Fixed_Int',
        type: 'object',
        properties: {
          value: {
            type: 'integer',
          },
        },
        description: '类别数阈值',
      },
      numTrees: {
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
            type: 'array',
            items: {
              type: 'integer',
            },
            description: '可调值',
          },
          value: {
            type: 'integer',
            description: '固定值',
          },
        },
        description: '树的数量',
      },
    },
  },
  TokenizerStage: {
    title: 'TokenizerStageConf',
    type: 'object',
    properties: {
      inputCol: {
        title: 'Fixed_Column',
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
  CommonPredictor: {
    title: 'CommonPredictorConf',
    type: 'object',
    properties: {},
  },
  LinearRegressionStage: {
    title: 'LinearRegressionStageConf',
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
            type: 'array',
            items: {
              type: 'integer',
            },
            description: '可调值',
          },
          value: {
            type: 'integer',
            description: '固定值',
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
            type: 'array',
            items: {
              type: 'number',
            },
            description: '可调值',
          },
          value: {
            type: 'number',
            description: '固定值',
          },
        },
        description: '正则化参数',
      },
    },
  },
  ConsoleDataSink: {
    title: 'ConsoleDataSinkConf',
    type: 'object',
    properties: {},
  },
  UnionTransformer: {
    title: 'UnionTransformerConf',
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
  SupportVectorMachineClassifierStage: {
    title: 'SupportVectorMachineClassifierStageConf',
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
            type: 'array',
            items: {
              type: 'integer',
            },
            description: '可调值',
          },
          value: {
            type: 'integer',
            description: '固定值',
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
            type: 'array',
            items: {
              type: 'number',
            },
            description: '可调值',
          },
          value: {
            type: 'number',
            description: '固定值',
          },
        },
        description: '正则化参数',
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
        description: '划分比例',
      },
    },
  },
  OneHotEncoderStage: {
    title: 'OneHotEncoderStageConf',
    type: 'object',
    properties: {
      columnNamePairArray: {
        title: 'Column_Name_Pair_Array',
        type: 'object',
        properties: {
          value: {
            type: 'array',
            items: {
              title: 'Column_Name_Pair',
              type: 'object',
              properties: {
                column: {
                  type: 'string',
                },
                name: {
                  type: 'string',
                },
              },
            },
          },
        },
        description: '输入列，输出列',
      },
    },
  },
  ConsoleModelSink: {
    title: 'ConsoleModelSinkConf',
    type: 'object',
    properties: {},
  },
  DecisionTreeClassifierPStage: {
    title: 'DecisionTreeClassifierPStageConf',
    type: 'object',
    properties: {
      featuresInputCol: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '特征列',
      },
      labelInputCol: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '标签列',
      },
      maxCategories: {
        title: 'Fixed_Int',
        type: 'object',
        properties: {
          value: {
            type: 'integer',
          },
        },
        description: '最大类别数',
      },
    },
  },
  MultilayerPerceptronClassifierStage: {
    title: 'MultilayerPerceptronClassifierStageConf',
    type: 'object',
    properties: {
      blockSize: {
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
            type: 'array',
            items: {
              type: 'integer',
            },
            description: '可调值',
          },
          value: {
            type: 'integer',
            description: '固定值',
          },
        },
        description: '块大小',
      },
      classNum: {
        title: 'Fixed_Int',
        type: 'object',
        properties: {
          value: {
            type: 'integer',
          },
        },
        description: '类别数量',
      },
      featureNum: {
        title: 'Fixed_Int',
        type: 'object',
        properties: {
          value: {
            type: 'integer',
          },
        },
        description: '特征数量',
      },
      hiddenLayerSizes: {
        title: 'Fixed_Int_Array',
        type: 'object',
        properties: {
          value: {
            type: 'array',
            items: {
              type: 'integer',
            },
          },
        },
        description: '隐藏层大小',
      },
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
            type: 'array',
            items: {
              type: 'integer',
            },
            description: '可调值',
          },
          value: {
            type: 'integer',
            description: '固定值',
          },
        },
        description: '最大迭代次数',
      },
      seed: {
        title: 'Fixed_Long',
        type: 'object',
        properties: {
          value: {
            type: 'integer',
          },
        },
        description: '种子值',
      },
    },
  },
  AvroDataSource: {
    title: 'AvroDataSourceConf',
    type: 'object',
    properties: {
      path: {
        title: 'Read_File_Path',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '文件路径',
      },
      schemaPath: {
        required: false,
        title: 'Read_File_Path',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: 'Schema路径',
      },
    },
  },
  MetricsPredictor: {
    title: 'MetricsPredictorConf',
    type: 'object',
    properties: {
      featuresCol: {
        required: false,
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '特征列',
      },
      labelColumn: {
        required: false,
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '标签列',
      },
      modelType: {
        type: 'string',
        enum: [
          'BinaryClassification',
          'MulticlassClassification',
          'Regression',
          'Clustering',
        ],
        description: '模型类型',
      },
      predictionCol: {
        required: false,
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '预测列',
      },
    },
  },
  DecisionTreeRegressorPStage: {
    title: 'DecisionTreeRegressorPStageConf',
    type: 'object',
    properties: {
      featuresInputCol: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '特征列',
      },
      labelInputCol: {
        title: 'Fixed_Column',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '标签列',
      },
      maxCategories: {
        title: 'Fixed_Int',
        type: 'object',
        properties: {
          value: {
            type: 'integer',
          },
        },
        description: '类别数阈值',
      },
    },
  },
  FileModelSource: {
    title: 'FileModelSourceConf',
    type: 'object',
    properties: {
      relativePath: {
        title: 'Fixed_Model_Path',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '模型位置',
      },
    },
  },
  CollectDataSink: {
    title: 'CollectDataSinkConf',
    type: 'object',
    properties: {},
  },
  ColumnRenameTransformer: {
    title: 'ColumnRenameTransformerConf',
    type: 'object',
    properties: {
      existingName: {
        title: 'Fixed_Column_Array',
        type: 'object',
        properties: {
          value: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        description: '重命名列',
      },
      newName: {
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
        description: '新列名',
      },
    },
  },
  TypeConversionTransformer: {
    title: 'TypeConversionTransformerConf',
    type: 'object',
    properties: {
      columns: {
        title: 'Fixed_Column_Array',
        type: 'object',
        properties: {
          value: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        description: '转换列',
      },
      types: {
        type: 'array',
        items: {
          type: 'string',
          enum: [
            'date',
            'long',
            'int',
            'float',
            'string',
            'decimal',
            'double',
            'short',
            'timestamp',
            'boolean',
            'byte',
          ],
        },
        description: '目标类型',
      },
    },
  },
  FilterTransformer: {
    title: 'FilterTransformerConf',
    type: 'object',
    properties: {
      conditionExpr: {
        title: 'Fixed_String',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
        },
        description: '条件表达式',
      },
    },
  },
  VectorAssemblerStage: {
    title: 'VectorAssemblerStageConf',
    type: 'object',
    properties: {
      inputColumns: {
        title: 'Fixed_Column_Array',
        type: 'object',
        properties: {
          value: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        description: '输入列',
      },
      outputColumn: {
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
};

const componentParam = (id) => {
  return allComponents[id];
};

export default componentParam;

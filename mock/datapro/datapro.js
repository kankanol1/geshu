const fakeComponents = {
  DataSource: [
    {
      name: 'CSVFileDataSource',
      code: 'FileDataSource',
    },
    {
      name: 'JSONFileDataSource',
      code: 'FileDataSource',
    },
    {
      name: 'ParquetFileDataSource',
      code: 'FileDataSource',
    },
    {
      name: 'TxtFileDataSource',
      code: 'FileDataSource',
    },
    {
      name: 'JdbcDataSource',
      code: 'JdbcDataSource',
    },
    {
      name: 'HiveDataSource',
      code: 'JdbcDataSource',
    },
    {
      name: 'KafkaDataSource',
      code: 'JdbcDataSource',
    },
    {
      name: 'AvroDataSource',
      code: 'AvroDataSource',
    },
  ],
  Transformer: [
    {
      name: 'PrepareTransformer',
      code: 'PrepareTransformer',
    },
    {
      name: 'TopNColumnTransformer',
      code: 'PrepareTransformer',
    },
    {
      name: 'WindowTransformer',
      code: 'RandomSplitTransformer',
    },
    {
      name: 'DistinctColumnTransformer',
      code: 'PrepareTransformer',
    },
    {
      name: 'SortTransformer',
      code: 'FilterTransformer',
    },
    {
      name: 'PivotTransformer',
      code: 'AddLiteralColumnTransformer',
    },
    {
      name: 'RandomSplitTransformer',
      code: 'RandomSplitTransformer',
    },
    {
      name: 'UnionTransformer',
      code: 'UnionTransformer',
    },
    {
      name: 'ColumnSplitTransformer',
      code: 'ColumnSplitTransformer',
    },
    {
      name: 'AggregateTransformer',
      code: 'AggregateTransformer',
    },
    {
      name: 'FilterTransformer',
      code: 'FilterTransformer',
    },
    {
      name: 'ProjectTransformer',
      code: 'ProjectTransformer',
    },
    {
      name: 'JoinTransformer',
      code: 'JoinTransformer',
    },
  ],
  DataSink: [
    {
      name: 'HiveDataSink',
      code: 'HiveDataSink',
    },
    {
      name: 'JDBCDataSink',
      code: 'HiveDataSink',
    },
    {
      name: 'CSVFileDataSink',
      code: 'FileDataSink',
    },
    {
      name: 'FileDataSink',
      code: 'FileDataSink',
    },
    {
      name: 'AvroFileDataSink',
      code: 'FileDataSink',
    },
    {
      name: 'ParquetFileDataSink',
      code: 'FileDataSink',
    },
    {
      name: 'JSONFileDataSink',
      code: 'FileDataSink',
    },
  ],
};

const components = {
  DataSource: [
    {
      code: 'FileDataSource',
      type: 'DataSource',
      name: 'FileDataSource',
    },
    {
      code: 'JDBCDataSource',
      type: 'DataSource',
      name: 'JDBCDataSource',
    },
    {
      code: 'AvroDataSource',
      type: 'DataSource',
      name: 'AvroDataSource',
    },
  ],
  Transformer: [
    {
      code: 'PrepareTransformer',
      type: 'Transformer',
      name: 'PrepareTransformer',
    },
    {
      code: 'SplitTransformer',
      type: 'Transformer',
      name: 'SplitTransformer',
    },
    {
      code: 'FilterTransformer',
      type: 'Transformer',
      name: 'FilterTransformer',
    },
    {
      code: 'ProjectTransformer',
      type: 'Transformer',
      name: 'ProjectTransformer',
    },
    {
      code: 'JoinTransformer',
      type: 'Transformer',
      name: 'JoinTransformer',
    },
    {
      code: 'UnionTransformer',
      type: 'Transformer',
      name: 'UnionTransformer',
    },
    {
      code: 'ColumnSplitTransformer',
      type: 'Transformer',
      name: 'ColumnSplitTransformer',
    },
    {
      code: 'RandomSplitTransformer',
      type: 'Transformer',
      name: 'RandomSplitTransformer',
    },
    {
      code: 'AddLiteralColumnTransformer',
      type: 'Transformer',
      name: 'AddLiteralColumnTransformer',
    },
    {
      code: 'AggregateTransformer',
      type: 'Transformer',
      name: 'AggregateTransformer',
    },
    {
      code: 'DistinctTransformer',
      type: 'Transformer',
      name: 'DistinctTransformer',
    },
  ],
  DataSink: [
    {
      code: 'FileDataSink',
      type: 'DataSink',
      name: 'FileDataSink',
    },
    {
      name: 'JDBCDataSink',
      code: 'HiveDataSink',
    },
  ],
  Schema: [
    {
      code: 'DefineSchemaSource',
      type: 'SchemaSource',
      name: 'DefineSchemaSource',
    },
    {
      code: 'MappingOperator',
      type: 'MappingOperator',
      name: 'MappingOperator',
    },
  ],
};

export default {
  'GET /api/datapro/meta/components': components,
};

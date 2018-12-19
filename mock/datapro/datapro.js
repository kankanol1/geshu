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
      name: 'FileDataSource',
      code: 'FileDataSource',
    },
    {
      name: 'JDBCDataSource',
      code: 'JDBCDataSource',
    },
    {
      name: 'AvroDataSource',
      code: 'AvroDataSource',
    },
  ],
  Transformer: [
    {
      name: 'AddLiteralColumnTransformer',
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
    {
      name: 'PrepareTransformer',
      code: 'PrepareTransformer',
    },
  ],
  DataSink: [
    {
      name: 'HiveDataSink',
      code: 'HiveDataSink',
    },
    {
      name: 'FileDataSink',
      code: 'FileDataSink',
    },
  ],
};

export default {
  'GET /api/datapro/meta/components': components,
};

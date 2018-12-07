const components = {
  DataSource: [
    {
      name: 'FileDataSource',
      code: 'FileDataSource',
    },
    {
      name: 'JdbcDataSource',
      code: 'JdbcDataSource',
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

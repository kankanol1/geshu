export function transformationTitle(type) {
  switch (type) {
    case 'SelectTransformation':
      return '列选择';
    case 'RenameTransformation':
      return '列重命名';
    case 'Rename1Transformation':
      return '列重命名(前后缀)';
    case 'Rename3Transformation':
      return '列重命名(模式替换)';
    case 'ConcatTransformation':
      return '多列连接';
    case 'ExtractDateTransformation':
      return '解析日期';
    case 'FillNullTransformation':
      return '补空值';
    default:
      return 'UnTranslated';
  }
}

const FillNullMapping = {
  MAX: '最大值',
  MIN: '最小值',
  AVG: '平均值',
  OTHER: '指定值',
  TRUE: '布尔值真',
  FALSE: '布尔值假',
  EMPTY: '空字符串',
};

export function transformationDescription(type, configs) {
  // const sep = '\xa0\xa0\xa0\xa0';
  switch (type) {
    case 'SelectTransformation':
      return (configs.fields || []).join(',');
    case 'RenameTransformation':
      return configs.fields.map((c, i) => `${c} -> ${configs.names[i]}`).join(',  ');
    case 'ConcatTransformation':
      if (configs === undefined) {
        return 'UnTranslated';
      } else {
        const cols = configs.fields.join(',');

        const as = configs.as || '[自动]';

        return `连接列: ${cols} => ${as}`;
      }
    case 'ExtractDateTransformation':
      return `解析日期: ${configs.timestampExtractors
        .map(i => `${i.field}(${i.pattern})`)
        .join(',')}`;
    case 'FillNullTransformation': {
      const items = configs.items.map(i => {
        if (i.function === 'OTHER') {
          return `${i.field}: 指定值: ${i.userDefined}`;
        } else {
          return `${i.field}: 填充策略: ${FillNullMapping[i.function]}`;
        }
      });
      return items.join('; ');
    }
    default:
      return 'UnTranslated';
  }
}

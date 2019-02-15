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
    case 'MergeTransformation':
      return '多列连接';
    default:
      return 'UnTranslated';
  }
}

export function transformationDescription(type, configs) {
  let sep = '\xa0\xa0\xa0\xa0';
  switch (type) {
    case 'SelectTransformation':
      return configs.fields.join(',');
    case 'RenameTransformation':
      if (configs.columns === undefined) {
        return 'UnTranslated';
      } else {
        return configs.columns.map(c => `${c.column} -> ${c.name}`).join(',  ');
      }
    case 'Rename1Transformation':
      if (configs === undefined) {
        return 'UnTranslated';
      } else {
        let cols = configs.columns.join(','),
          prefix = configs.prefix,
          suffix = configs.suffix;

        return `列: ${cols}${sep}添加前缀: ${prefix}${sep}后缀: ${suffix}`;
      }
    case 'Rename3Transformation':
      if (configs === undefined) {
        return 'UnTranslated';
      } else {
        let cols = configs.columns.join(','),
          on = configs.on,
          by = configs.by;

        return `列: ${cols}${sep}替换: ${on}${sep}为: ${by}`;
      }
    case 'MergeTransformation':
      if (configs === undefined) {
        return 'UnTranslated';
      } else {
        let cols = configs.columns.join(','),
          by = configs.by,
          as = configs.as || '[自动]';

        return `连接列: ${cols}${sep}连接符: ${by}${sep}新列名: ${as}`;
      }
    default:
      return 'UnTranslated';
  }
}

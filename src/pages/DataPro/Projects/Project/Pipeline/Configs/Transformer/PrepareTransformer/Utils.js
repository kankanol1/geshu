export function transformationTitle(type) {
  switch (type) {
    case 'SelectTransformation':
      return '列选择';
    case 'RenameTransformation':
      return '重命名';
    default:
      return 'UnTranslated';
  }
}

export function transformationDescription(type, configs) {
  switch (type) {
    case 'SelectTransformation':
      return configs.fields.join(',');
    case 'RenameTransformation':
      return 'Not translated';
    default:
      return 'UnTranslated';
  }
}

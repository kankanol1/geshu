export function transformationTitle(type) {
  switch (type) {
    case 'SelectTransformation':
      return '列选择';
    default:
      return 'UnTranslated';
  }
}

export function transformationDescription(type, configs) {
  switch (type) {
    case 'SelectTransformation':
      return configs.columns;
    default:
      return 'UnTranslated';
  }
}

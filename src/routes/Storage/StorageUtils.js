
const typeDetailsMap = {
  private: {
    title: '个人文件',
    icon: 'folder',
    description: '此分类下的所有文件只有个人可见',
    type: 'private',
  },
  public: {
    title: '公开文件',
    icon: 'folder',
    description: '此分类下的所有文件所有人均可见',
    type: 'public',
  },
  graph: {
    title: '图项目文件',
    icon: 'folder',
    description: '此分类下的文件仅有对应项目可见',
    type: 'graph',
  },
  pipeline: {
    title: '数据处理项目文件',
    icon: 'folder',
    description: '此分类下的文件仅有对应项目可见',
    type: 'pipeline',
  },
};

export function getDisplayDataForTypes(types, excludeList) {
  const display = [];
  // const { length } = types;
  for (const type of types) {
    if (!excludeList.includes(type)) {
      display.unshift(typeDetailsMap[`${type}`]);
    }
  }
  return display;
}

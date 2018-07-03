const categories = {
  start: {
    width: 60,
    height: 60,
    display: '主节点',
    shape: 'RoundedRectangle',
    stroke: '#C2185B',
    strokeWidth: 3,
    fill: '#dc4344',
    textPosition: 'inside',
    fontColor: 'white',
  },
  end: {
    width: 80,
    height: 80,
    display: '从节点',
    shape: 'EndPoint',
    stroke: 'white',
    strokeWidth: 3,
    fill: 'orange',
  },
  explored: {
    width: 60,
    height: 60,
    display: '已探索',
    shape: 'RoundedRectangle',
    stroke: 'blue',
    strokeWidth: 3,
    fill: 'blue',
    textPosition: 'inside',
    fontColor: '#ddd',
  },
};
export default categories;

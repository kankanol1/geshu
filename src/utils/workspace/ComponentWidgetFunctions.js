import store from '../../index';

export const getAllColumnsFromUpstream = (id) => {
  // select what we needed.
  const { schema, components } = store.getState().work_canvas;
  let upstreamId;
  let upstreamPoint;
  components.forEach(
    (c) => {
      if (c.id === id) {
        const { connectFrom } = c;
        if (connectFrom.length === 0) {
          throw new Error('请先连接');
        }
        upstreamId = connectFrom[0].component;
        upstreamPoint = connectFrom[0].from;
      }
    }
  );
  if (schema === undefined) {
    throw new Error('请先保存');
  }
  const allFields = schema[upstreamId][upstreamPoint];
  return allFields.map(item => item.name);
};

export default{
  getAllColumnsFromUpstream,
};
import { getFromRegistory } from '../../common/registry';

const getStore = () => getFromRegistory('store');

export const getAllColumnsFromUpstream = (id) => {
  // select what we needed.
  const { schema, canvas } = getStore().getState().workcanvas;
  let upstreamId;
  let upstreamPoint;
  canvas.components.forEach(
    (c) => {
      if (c.id === id) {
        const { connections: connectFrom } = c;
        if (connectFrom.length === 0) {
          throw new Error('请先连接');
        }
        upstreamId = connectFrom[0].component;
        upstreamPoint = connectFrom[0].from;
      }
    }
  );
  if (schema === undefined) {
    throw new Error('无相应schema信息');
  }
  const allFields = schema[upstreamId][upstreamPoint];
  return allFields.map(item => item.name);
};

export const getAllInputSchemaForComponent = (id) => {
  const { schema, canvas } = getStore().getState().workcanvas;
  if (schema === undefined) {
    throw new Error('无相应schema信息');
  }
  const inputs = [];
  canvas.components.forEach(
    (c) => {
      if (c.id === id) {
        const { connections: connectFrom } = c;
        if (connectFrom.length === 0) {
          throw new Error('请先连接');
        }
        connectFrom.forEach((cf) => {
          inputs.push({
            table: cf.to,
            schema: schema[cf.component][cf.from],
          });
        });
      }
    }
  );
  return inputs;
};

export default{
  getAllColumnsFromUpstream,
};

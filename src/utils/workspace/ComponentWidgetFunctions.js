import store from '../../index';

export const getAllColumnsFromUpstream = () => {
  // select what we needed.
  const { schema } = store.getState().work_canvas;
  if (schema === undefined) {
    throw new Error('无法展示上游schema,请先连接');
  }
  // console.log('fake', schema);
};

export default{
  getAllColumnsFromUpstream,
};

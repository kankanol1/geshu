import graphUtil from '../../utils/graph_utils';

export default {
  namespace: 'graph_schema_editor',
  state: {},
  reducers: {
    create(state, { palletContainer, graphContainer }) {
      return { diagram: graphUtil.init(palletContainer, graphContainer) };
    },
  },
};


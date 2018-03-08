import componentAPI from '../../services/componentAPI';

export default {
  namespace: 'work_component_list',

  state: {
    groups: [
      // component group.
      {
        name: '输入组件',
        key: 'source',
        components: [
          // component.
          {
            name: 'csv输入',
            type: 'source',
            code: 'csv-source',
            inputs: [
            ],
            outputs: [
              {
                id: 'o-1',
                label: 'o',
                hint: 'data output', // occurs when hover
                x: 1,
                y: 0.5,
                connects: ['datasource-input'],
              },
            ],
          },
        ],
      },
      {
        name: '数据转换组件',
        key: 'transform',
        components: [
          {
            name: '列转换',
            type: 'preprocessor',
            code: 'column-transform',
            inputs: [
              {
                id: 'i-1',
                label: 'i',
                hint: 'b', // occurs when hover
                x: 3,
                y: 0.5,
                connects: ['datasource-output'],
              },
            ],
            outputs: [
              {
                id: 'o-1',
                label: 'o',
                hint: 'b', // occurs when hover
                x: 1,
                y: 0.5,
                type: 'datasource-output',
              },
            ],
          },
        ],
      },
    ],
    // store all the data fetched from server.
    allGroups: [],
    activekeys: ['input-group', 'transform-group'],
  },

  reducers: {
    replaceComponentList(state, { data }) {
      const activekeys = data.map(
        (group) => { return group.key; }
      );
      return Object.assign({}, { ...state,
        ...{ groups: data, allGroups: data, activekeys } });
    },

    filterComponent(state, { payload }) {
      const { allGroups } = state;
      const { filter } = payload;
      if (filter && filter !== '') {
        const filteredGroup = allGroups.map(
          (group) => {
            return {
              ...group,
              components: group.components.filter(c => c.name.indexOf(filter) >= 0),
            };
          }
        );
        return Object.assign({}, { ...state,
          groups: filteredGroup.filter(g => g.components.length > 0) });
      } else {
        return Object.assign({}, { ...state, groups: allGroups });
      }
    },
  },

  effects: {
    *fetchComponentList({ payload }, { call, put }) {
      const data = yield call(componentAPI.fetchComponentList);
      yield put({ type: 'replaceComponentList', data });
    },
  },

  subscriptions: {
  },
};

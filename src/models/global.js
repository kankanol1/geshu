
export default {
  namespace: 'global',

  state: {
    collapsed: false,
    fullScreen: false,
  },

  effects: {
  },

  reducers: {
    changeFullScreen(state, { payload }) {
      return {
        ...state,
        fullScreen: payload,
      };
    },

    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
  },

  subscriptions: {
  },
};

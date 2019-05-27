export default {
  namespace: 'dataproLayoutParam',
  state: {
    sideMenu: 210,
  },
  reducers: {
    updateSideMenu(state, { payload }) {
      return { ...state, sideMenu: payload };
    },
  },
};

export default {
    namespace: 'left_side_menu',

    state: {collapsed: false},

    reducers: {
        collapse(state) {
            return Object.assign({}, state, 
                {collapsed: !state.collapsed})
        }
    }
}
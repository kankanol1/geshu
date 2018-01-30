import dva from 'dva';
import './index.less';
import initilizations from './initialize'

// 1. Initialize
const app = dva({
    initialState: initilizations
});

console.log(app._store)

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);
app.model(require('./models/menus/leftsidemenu').default);
app.model(require('./models/container_canvas').default);
app.model(require('./models/workspace/work_canvas').default);
app.model(require('./models/workspace/work_component_list').default);
app.model(require('./models/workspace/work_component_settings').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

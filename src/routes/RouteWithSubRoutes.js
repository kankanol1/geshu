import { Router, Route, Switch } from 'dva/router';

const RouteWithSubRoutes = (route) => (
    <Route path={route.path} render={props => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes}/>
    )}/>
)

export default RouteWithSubRoutes
/**
 * display when environment contains certain scope.
 * @param {} props
 */
import { Menu } from 'antd';

export default class ScopeMenuItem extends Menu.Item {
  render() {
    const { env, scope } = this.props;
    if (env !== undefined && (env.includes(scope) || env.includes('*'))) {
      return super.render();
    } else return null;
  }
}

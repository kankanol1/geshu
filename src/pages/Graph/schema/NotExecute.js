import React from 'react';
import { connect } from 'dva';
import { Button, Card } from 'antd';
import { routerRedux } from 'dva/router';

class NotExecute extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  go2SchemaDesigner = projectId => {
    const url = `/graph/schema/detail/${projectId}`;
    this.props.dispatch(routerRedux.push(url));
  };

  render() {
    const { id: projectId } = this.props.match.params;
    return (
      <Card>
        尚未设计schema，请点击
        <Button type="primary" onClick={this.go2SchemaDesigner.bind(this, projectId)}>
          设计器
        </Button>
        跳转到设计器模块。。。
      </Card>
    );
  }
}
export default connect(({ graph_mapping_editor }) => {
  return {
    ...graph_mapping_editor,
  };
})(NotExecute);

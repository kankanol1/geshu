import React from 'react';
import { connect } from 'dva';
import { Button, Card } from 'antd';
import { routerRedux } from 'dva/router';

class NotImportData extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  go2SchemaDesigner = projectId => {
    const url = `/graph/mapper/detail/${projectId}`;
    this.props.dispatch(routerRedux.push(url));
  };

  render() {
    const { id: projectId } = this.props.match.params;
    return (
      <Card>
        尚未数据导入，请点击
        <Button type="primary" onClick={this.go2SchemaDesigner.bind(this, projectId)}>
          数据导入
        </Button>
        跳转到数据导入模块
      </Card>
    );
  }
}
export default connect(({ graph_mapping_editor }) => {
  return {
    ...graph_mapping_editor,
  };
})(NotImportData);

import React from 'react';
import { Modal, Button, Col, Row, Select, Table } from 'antd';
import { connect } from 'dva';

@connect(({ datainspector, loading }) => ({
  datainspector,
  loading: loading.models.datainspector,
}))
export default class DataInspector extends React.Component {
  constructor(props) {
    super(props);
    const { outputs } = this.props.component;
    const defaultOut = outputs.length === 0 ? undefined : outputs[0].id;
    this.state = {
      output: defaultOut,
    };
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'datainspector/clearData',
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.dispatch({
      type: 'datainspector/inspectData',
      payload: {
        id: this.props.projectId,
        component: this.props.component.id,
        tag: this.state.output,
        limit: 100,
      },
    });
  }

  render() {
    const { loading } = this.props;
    const performCancel = () => {
      if (this.props.onClose) {
        this.props.onClose();
      }
    };
    const { outputs, name } = this.props.component;
    const { result } = this.props.datainspector;
    const { schema, data } = result;
    return (
      <Modal
        title={`数据预览:[${name}]`}
        visible={this.props.visible}
        closable
        destroyOnClose
        onCancel={performCancel}
        width={1000}
        footer={null}
      >
        {
        outputs.length === 0 ?
        (<span>该组件无输出节点，无法查看</span>)
        :
        (
          <Row>
            <Col span={4}>
              <span>查看输出点</span>
            </Col>
            <Col span={4}>
              <Select value={this.state.output} style={{ width: '100%' }} onChange={e => this.setState({ output: e })} >
                {
                outputs && outputs.map(i =>
                  <Select.Option key={i.id} value={i.id}>{i.id}</Select.Option>
                )
              }
              </Select>
            </Col>
            <Col span={2} />
            <Col span={14}>
              <Button type="primary" onClick={e => this.handleSubmit(e)}> 查看</Button>
            </Col>
          </Row>
        )
      }

        { schema || loading ?
          (
            <Table
              style={{ marginTop: '10px' }}
              columns={schema &&
              schema.map(i => ({ title: i.name, key: i.name, dataIndex: i.name }))}
              dataSource={data || []}
              scroll={{ x: schema && schema.length * 100, y: 400 }}
              pagination={false}
              loading={loading}
              size="small"
            />
            )
        : null}
      </Modal>
    );
  }
}

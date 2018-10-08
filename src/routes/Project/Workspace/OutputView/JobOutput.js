import React from 'react';
import { Tag, Icon, Row, Col, Card, Spin, List, Button, Popconfirm, message } from 'antd';
import moment from 'moment';
import { getJobDetails } from '../../../../services/jobsAPI';
import { removeCandidateModels } from '../../../../services/modelsAPI';
import { removePrivateDataset } from '../../../../services/datasetAPI';
import ModelDetailsDialog from '../../../Model/ModelDetailsDialog';

export default class JobOutput extends React.PureComponent {
  state={
    data: {},
    loading: true,
    dataLoading: false,
    modelLoading: false,
    modelMetrics: {
      visible: false,
      id: undefined,
    },
  }

  componentWillMount() {
    const { id } = this.props;
    this.setState({ loading: true });
    getJobDetails({ id }).then(response => response && this.setState({
      loading: false, data: response,
    }));
  }

  handleDataDelete = (id) => {
    this.setState({ dataLoading: true });
    removePrivateDataset({ ids: [id] }).then((response) => {
      if (response) {
        if (response.success) {
          message.info(response.message);
        } else {
          message.error(response.message);
        }
      }
    });
    getJobDetails({ id: this.props.id }).then((response) => {
      if (response) {
        this.setState({ dataLoading: false, data: response });
      }
    });
  }

  handleModelDelete = (id) => {
    this.setState({ modelLoading: true });
    removeCandidateModels({ ids: [id] }).then((response) => {
      if (response) {
        if (response.success) {
          message.info(response.message);
        } else {
          message.error(response.message);
        }
      }
    });
    getJobDetails({ id: this.props.id }).then(response => response && this.setState({
      modelLoading: false, data: response,
    }));
  }

  render() {
    const { loading, data, modelLoading, dataLoading } = this.state;
    if (loading) {
      return <Spin />;
    }
    const { dataList, modelList } = data;
    const { visible, id } = this.state.modelMetrics;
    return (
      <Row gutter={24}>
        <Col span={12}>
          <Card title="数据输出">
            <List
              dataSource={dataList}
              loading={dataLoading}
              itemLayout="horizontal"
              renderItem={
              item => (
                <List.Item actions={
                  [
                    <Popconfirm title="确认删除吗?" onConfirm={() => this.handleDataDelete(item.id)}>
                      <a>删除</a>
                    </Popconfirm>,
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        const { onDataClicked } = this.props;
                        if (onDataClicked) onDataClicked(item.id);
                      }}
                    >查看
                    </Button>]
                  }
                >
                  <List.Item.Meta
                    description={item.name}
                  />
                  <div>生成时间: {moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                </List.Item>
              )
            }
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="模型输出">
            <List
              dataSource={modelList}
              loading={modelLoading}
              itemLayout="horizontal"
              renderItem={
              item => (
                <List.Item actions={
                  [
                    <a onClick={() => {
                      this.setState({ modelMetrics: { visible: true, id: item.id } });
                    }}
                    >详细
                    </a>,
                    <Popconfirm title="确认删除吗?" onConfirm={() => this.handleModelDelete(item.id)}>
                      <a>删除</a>
                    </Popconfirm>,
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => {
                        const { onModelClicked } = this.props;
                        if (onModelClicked) onModelClicked(item.id);
                      }}
                    >测试
                    </Button>]
                  }
                >
                  <List.Item.Meta
                    description={item.name}
                  />
                  <div>生成时间: {moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                </List.Item>
              )
            }
            />

            <ModelDetailsDialog
              id={id}
              visible={visible}
              onCancel={() => {
                this.setState({ modelMetrics: { visible: false, id: undefined } });
              }}
            />
          </Card>
        </Col>
      </Row>
    );
  }
}

import React from 'react';
import { Button, Icon, Row, Col, Input, Tooltip } from 'antd';
import router from 'umi/router';
import { isObject } from 'util';
import styles from './EditTask.less';
import { validateTaskSource } from '@/services/dclient/taskAPI';
import ConfigurationTable from '@/components/XWidgets/UI/ConfigurationTable';

class EditTaskStepDataSourceCheck extends React.PureComponent {
  state = {
    loading: true,
    response: {},
  };

  componentDidMount() {
    const { id } = this.props;
    validateTaskSource({
      id,
    }).then(response => {
      if (response) {
        this.setState({ loading: false, response });
      } else {
        this.setState({ loading: false });
      }
    });
  }

  renderMapping = (item, index) => {
    // get key & values
    const expectedMap = {};
    const givenMap = {};
    item.expected.forEach(i => {
      expectedMap[i.name] = i;
    });
    item.given.forEach(i => {
      givenMap[i.name] = i;
    });
    return (
      <div key={index} className={styles.mappingWrapper}>
        <Row>
          <Col span={20} offset={2}>
            <div className={styles.describer}>输入模式: {item.name}</div>
            <div className={styles.description}>
              <span>{item.description}</span>
            </div>
            <div className={styles.describerPadding} />
          </Col>
        </Row>
        <Row>
          <Col span={20} offset={2}>
            <ConfigurationTable
              data={item.mapping}
              columns={[
                {
                  name: 'expected',
                  title: '模板列',
                  span: 10,
                  render: (v, it, onChange) => (
                    <Input value={`${v}(${expectedMap[v].type})`} disabled />
                  ),
                },
                {
                  name: 'given',
                  title: '给定列',
                  span: 10,
                  render: (v, it, onChange) => (
                    <Input value={v ? `${v}(${givenMap[v].type})` : '(未提供)'} disabled />
                  ),
                },
                {
                  name: 'compatible',
                  title: '兼容性',
                  span: 4,
                  render: (v, it, onChange) => {
                    let content;
                    switch (v) {
                      case 'ERROR':
                        content = (
                          <Tooltip title="和模板列不匹配">
                            <Icon className={styles.error} type="exclamation-circle" />
                          </Tooltip>
                        );
                        break;
                      case 'WARN':
                        content = (
                          <Tooltip title="和模板列不完全匹配，可自动转换">
                            <Icon className={styles.warn} type="close-circle" />
                          </Tooltip>
                        );
                        break;
                      case 'OK':
                      default:
                        content = (
                          <Tooltip title="和模板列完全兼容">
                            <Icon className={styles.success} type="check-circle" />
                          </Tooltip>
                        );
                    }
                    return <div className={styles.middleWrapper}>{content}</div>;
                  },
                },
              ]}
            />
          </Col>
        </Row>
      </div>
    );
  };

  renderError() {
    const { response } = this.state;
    const { message, data } = response;
    return (
      <React.Fragment>
        <div className={styles.middleWrapper}>
          <Icon type="close" style={{ fontSize: '16px', color: 'red' }} /> {message}
        </div>
        {data.map((i, index) => this.renderMapping(i, index))}
      </React.Fragment>
    );
  }

  render() {
    const { mode, id, pane } = this.props;
    const { loading, response } = this.state;
    return (
      <div>
        {loading && (
          <div className={styles.middleWrapper}>
            <Icon type="loading" style={{ fontSize: '16px' }} /> 验证中...
          </div>
        )}
        {!loading &&
          response.success && (
            <div className={styles.middleWrapper}>
              <Icon type="check" style={{ fontSize: '16px', color: 'green' }} /> 核对完毕
            </div>
          )}
        {!loading && !response.success && this.renderError()}
        <div className={styles.bottomBtns}>
          <Button
            type="primary"
            className={styles.leftBtn}
            onClick={() => router.push(`/tasks/t/${mode}/${id}/${pane - 1}`)}
          >
            &lt;上一步
          </Button>
          <Button
            type="primary"
            className={styles.rightBtn}
            disabled={loading || !response.success}
            onClick={() => router.push(`/tasks/t/${mode}/${id}/${pane + 1}`)}
          >
            下一步 &gt;
          </Button>
        </div>
      </div>
    );
  }
}

export default EditTaskStepDataSourceCheck;

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Avatar, Button, Icon, List, Form, Row, Col, Input, DatePicker } from 'antd';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CardTable from '@/components/CardTable';
import XTagList from '@/components/XTagList';

import { generateColorFor } from '../../../utils/utils';
import styles from './ProjectList.less';

const { RangePicker } = DatePicker;

const defaultParams = {
  pageSize: 12,
  currentPage: 1,
};

@connect(({ dataproProjects, loading }) => ({
  dataproProjects,
  loading: loading.models.dataproProjects,
}))
@Form.create()
class ProjectList extends PureComponent {
  state = {
    queryParams: defaultParams,
  };

  componentDidMount() {
    this.performQuery();
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({ queryParams: defaultParams }, this.performQuery);
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const updatedAt =
        fieldsValue.updatedAt && fieldsValue.updatedAt.map(m => m.format('YYYYMMDD')).join();

      const createdAt =
        fieldsValue.createdAt && fieldsValue.createdAt.map(m => m.format('YYYYMMDD')).join();

      const values = {
        ...fieldsValue,
        // labels: labels && labels.join(),
        updatedAt,
        createdAt,
      };
      this.setState({ queryParams: values }, this.performQuery);
    });
  };

  handleTableChange(pagination) {
    const newParams = {
      ...this.state.queryParams,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState({ queryParams: newParams }, this.performQuery);
  }

  performQuery() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataproProjects/fetchAllProjects',
      payload: this.state.queryParams,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <Form.Item label="编号">
              {getFieldDecorator('id')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="创建时间">
              {getFieldDecorator('createdAt')(
                <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
              )}
            </Form.Item>
          </Col>
          <Col md={4} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      dataproProjects: { data },
      loading,
    } = this.props;

    const content = (
      <div className={`${styles.pageHeaderContent} ${styles.tableListForm}`}>
        {this.renderSimpleForm()}
      </div>
    );

    return (
      <PageHeaderWrapper title="项目列表" content={content}>
        <CardTable
          loading={loading}
          data={data}
          onChange={pagination => this.handleTableChange(pagination)}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card
                hoverable
                className={styles.card}
                actions={[<a>编辑</a>, <Link to={`/projects/p/show/${item.id}`}>打开</Link>]}
              >
                <Card.Meta
                  avatar={
                    <Avatar
                      className={styles.cardAvatar}
                      style={{
                        backgroundColor: generateColorFor(item.name),
                        verticalAlign: 'middle',
                      }}
                      size="large"
                    >
                      {item.name.toUpperCase().charAt(0)}
                    </Avatar>
                  }
                  title={<a>{item.name}</a>}
                  description={
                    <Ellipsis className={styles.item} lines={3}>
                      {item.description}
                    </Ellipsis>
                  }
                />
                <XTagList tags={item.labels.map(i => ({ color: generateColorFor(i), name: i }))} />
              </Card>
            </List.Item>
          )}
        />
      </PageHeaderWrapper>
    );
  }
}

export default ProjectList;

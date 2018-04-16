import React from 'react';
// import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Modal, Card, Icon, Button, Row, Col, Spin, Table } from 'antd';
import { buildTagSelect } from '../../utils/uiUtils';
import styles from './WorkspaceIndex.less';

const FormItem = Form.Item;
// const { TextArea } = Input;


/** the open form. */

const OpenProjectForm = Form.create()((props) => {
  const { modalOpenVisible, form, handleSearch, handleOpenModalVisible, searchLoading } = props;
  const { labels, openList, dispatch, pagination, handleStandardTableChange } = props;
  const { Column } = Table;
  const loading = searchLoading || false;

  const okHandle = (e) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSearch(fieldsValue);
    });
  };

  const changePage = (pageNum) => {
    handleStandardTableChange(pageNum);
  };

  return (
    <Modal
      title="打开项目"
      width={850}
      visible={modalOpenVisible}
      onOk={e => okHandle(e)}
      onCancel={() => { handleOpenModalVisible(); }}
      footer={null}
    >
      <Form onSubmit={okHandle} layout="inline">
        <Row gutter={{ md: 9, lg: 24, xl: 48 }}>
          <Col md={9} sm={27}>
            <FormItem
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 16 }}
              layout="inline"
              label="项目名称"
              style={{ display: 'flex' }}
            >
              {form.getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={9} sm={27}>
            <FormItem
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 16 }}
              layout="inline"
              label="标签"
              style={{ display: 'flex' }}
            >
              {form.getFieldDecorator('labels')(
                buildTagSelect(labels, true)
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={18}>
            <span>
              <Button type="primary" htmlType="submit" onClick={okHandle}>查询</Button>
              {/* <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>重置</Button> */}
            </span>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={openList}
        pagination={pagination}
        loading={loading}
        showHeader={false}
        onChange={changePage}
        style={{ marginTop: 20 }}
        onRow={(record) => {
          return {
            onClick: () => { dispatch(routerRedux.push(`/project/workspace/editor/${record.id}`)); },
            onMouseEnter: () => { console.log(record.description); },
          };
        }}
      >
        <Column
          dataIndex="name"
          key="name"
        />
        <Column
          className="columslabels"
          dataIndex="labels"
          key="labels"
          align="right"
          style={{ textAlign: 'right' }}
          render={(text, record) => (
            record.labels.map((item, index) => {
            return <span key={item} className={styles.label} >{item}</span>;
            })
          )}
        />
      </Table>
    </Modal>
  );
});

export default OpenProjectForm;

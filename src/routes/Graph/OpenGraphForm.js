import React from 'react';
import { routerRedux } from 'dva/router';
import { Form, Input, Modal, Button, Row, Col, Table, Tag } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

const OpenProjectForm = Form.create()((props) => {
  const { modalOpenVisible, form, handleSearch, handleOpenModalVisible, searchLoading , type } = props;
  const { openList, dispatch, pagination, handleStandardTableChange } = props;
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
          <Col md={6} sm={18}>
            <span>
              <Button type="primary" htmlType="submit" onClick={okHandle}>查询</Button>
            </span>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={openList}
        pagination={pagination}
        loading={loading}
        onChange={changePage}
        style={{ marginTop: 20 }}
        onRow={(record) => {
          return {
            onClick: () => { dispatch(routerRedux.push(`/graph/detail/${type}/${record.id}`)); },
          };
        }}
      >
        <Column
          title="名称"
          dataIndex="name"
          key="name"
        />
        <Column
          title="状态"
          className="status"
          dataIndex="status"
          key="status"
          render={text => <Tag color="blue">{text}</Tag>}
        />
        <Column
          title="最近更新"
          className="updatedAt"
          dataIndex="updatedAt"
          key="updatedAt"
          render={val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>}
        />
      </Table>
    </Modal>
  );
});

export default OpenProjectForm;

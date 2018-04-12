import React from 'react';
// import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Input, Modal, Card, Icon, Button, Row, Col, Spin } from 'antd';
import moment from 'moment';
import { buildTagSelect } from '../../utils/uiUtils';
import styles from './WorkspaceIndex.less';

const FormItem = Form.Item;
// const { TextArea } = Input;


/** the open form. */

const OpenProjectForm = Form.create()((props) => {
  const { modalOpenVisible, form, handleSearch, handleOpenModalVisible, searchLoading } = props;
  const { labels, openList } = props;
  const loading = searchLoading || false;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleSearch(fieldsValue);
    });
  };
  return (
    <Modal
      title="打开项目"
      width={850}
      visible={modalOpenVisible}
      onOk={okHandle}
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
      {
        loading ? <div className={styles.loadings}> <Spin /> </div> :
        (
          openList.length === 0 ? <div className={styles.hasNoData}><Icon className={styles.hasNoDataIcon} type="frown" />暂无数据....</div> :
          (
            <Card title="" className={styles.firstCard} style={{ marginTop: 20 }}>
              {
                openList.map(item =>
                  (
                    <p key={item.id} className={styles.project}>
                      <Link to={`/project/workspace/editor/${item.id}`} className={styles.clickableItem} title={item.description}>
                        <span className={styles.projectName} ><Icon type="file" /> {item.name}</span>
                        <span className={styles.labels} >
                          {
                            item.labels.map((laber, index) => (
                              <span className={styles.label} key={index}>{laber}</span>
                              )
                            )
                          }
                        </span>
                      </Link>
                    </p>
                  )
                )
              }
            </Card>
          )
        )
      }
    </Modal>
  );
});

export default OpenProjectForm;

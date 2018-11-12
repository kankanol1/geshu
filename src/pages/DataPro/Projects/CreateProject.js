import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Form, Input, Button, message } from 'antd';
import { Link } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import XLoading from '@/components/XLoading';

import { buildTagSelect } from '../../../utils/uiUtils';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ dataproProjects, loading }) => ({
  project: dataproProjects,
  loadingLabels: loading.effects['dataproProjects/fetchLabels'],
  submitting: loading.effects['dataproProjects/create'],
}))
@Form.create()
class CreateProject extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataproProjects/fetchLabels',
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form, dispatch, project } = this.props;
    const { labels } = project;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const newLabels =
        fieldsValue.labels &&
        fieldsValue.labels.map(l => {
          const intL = parseInt(l, 10);
          if (!isNaN(intL)) {
            return labels[intL];
          }
          return l;
        });
      dispatch({
        type: 'dataproProjects/createProject',
        payload: {
          ...fieldsValue,
          labels: newLabels && newLabels.join(),
        },
        callback: response => {
          if (response.success) {
            message.info(response.message);
            router.push(`/projects/p/show/${response.id}`);
          } else {
            message.error(response.message);
          }
        },
      });
    });
  }

  render() {
    const { form, loadingLabels, submitting, project } = this.props;
    const { labels } = project;
    return (
      <PageHeaderWrapper title="新建项目">
        <Card>
          {loadingLabels ? (
            <XLoading />
          ) : (
            <React.Fragment>
              <Link to="/projects/list">
                <Button> &lt;&nbsp; 返回</Button>
              </Link>
              <Form onSubmit={e => this.handleSubmit(e)}>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
                  {form.getFieldDecorator('name', {
                    rules: [{ required: true, message: '请填写项目名称' }],
                  })(<Input placeholder="请输入" disabled={submitting} />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
                  {form.getFieldDecorator('description', {
                    rules: [{ required: true, message: '请填写项目描述' }],
                  })(<TextArea placeholder="请输入" rows={3} disabled={submitting} />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="标签">
                  {form.getFieldDecorator('labels', {})(buildTagSelect(labels, true, submitting))}
                </FormItem>
                <div style={{ textAlign: 'center' }}>
                  <Button type="primary" loading={submitting} htmlType="submit">
                    创建
                  </Button>
                </div>
              </Form>
            </React.Fragment>
          )}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CreateProject;

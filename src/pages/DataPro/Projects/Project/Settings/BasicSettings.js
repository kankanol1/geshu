import React from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button, message } from 'antd';

import { buildTagSelect } from '@/utils/uiUtils';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ dataproProjects, dataproProject, loading }) => ({
  projects: dataproProjects,
  project: dataproProject.project,
  loading: loading.models.dataproProject,
}))
@Form.create()
class BasicSettings extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataproProjects/fetchLabels',
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { form, dispatch, projects, id } = this.props;
    const { labels } = projects;
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
        type: 'dataproProject/updateProject',
        payload: {
          ...fieldsValue,
          id,
          labels: newLabels && newLabels.join(),
        },
      });
    });
  }

  render() {
    const { loading, form, projects, project } = this.props;
    const { labels } = projects;
    const itemProps = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
        <FormItem {...itemProps} label="名称">
          {form.getFieldDecorator('name', {
            initialValue: project.name,
            rules: [{ required: true, message: '请填写项目名称' }],
          })(<Input placeholder="请输入" disabled={loading} />)}
        </FormItem>
        <FormItem {...itemProps} label="描述">
          {form.getFieldDecorator('description', {
            initialValue: project.description,
            // rules: [{ required: true, message: '请填写项目描述' }],
          })(<TextArea placeholder="请输入" rows={3} disabled={loading} />)}
        </FormItem>
        <FormItem {...itemProps} label="标签">
          {form.getFieldDecorator('labels', {
            initialValue: project.labels,
          })(buildTagSelect(labels, true, loading))}
        </FormItem>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" loading={loading} htmlType="submit">
            修改
          </Button>
        </div>
      </Form>
    );
  }
}

export default BasicSettings;

import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Form, Input, Button, Radio, message } from 'antd';
import Link from 'umi/link';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import XLoading from '@/components/XLoading';
import SelectTemplate from './SelectTemplate';
import { queryTemplateInfo } from '@/services/datapro/templatesAPI';
import { buildTagSelect } from '../../../utils/uiUtils';

const FormItem = Form.Item;
const { TextArea } = Input;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(({ dataproProjects, loading }) => ({
  project: dataproProjects,
  loadingLabels: loading.effects['dataproProjects/fetchLabels'],
  submitting: loading.effects['dataproProjects/createProject'],
}))
@Form.create()
class CreateProject extends React.PureComponent {
  state = {
    type: 'blank',
    loading: true,
    template: undefined,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'dataproProjects/fetchLabels',
    });
    const { template } = match.params;
    const templateId = parseInt(template, 10);
    if (!isNaN(templateId)) {
      // fetch template info.
      queryTemplateInfo({
        id: templateId,
      }).then(response => {
        this.setState({ loading: false, template: response, type: 'template' });
      });
    } else {
      this.setState({ loading: false });
    }
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
      const { template, ...rest } = fieldsValue;
      const { id: templateId } = template || {};
      dispatch({
        type: 'dataproProjects/createProject',
        payload: {
          ...rest,
          template: templateId,
          labels: newLabels && newLabels.join(),
        },
        callback: response => {
          if (response && response.success) {
            message.info(response.message);
            router.push(`/projects/p/show/${response.id}`);
          } else {
            message.error((response && response.message) || 'error');
          }
        },
      });
    });
  }

  render() {
    const { form, loadingLabels, submitting, project } = this.props;
    const { loading, template } = this.state;
    const { labels } = project;
    return (
      <PageHeaderWrapper
        title="新建项目"
        breadcrumbList={[
          {
            name: '首页',
            key: 'index',
            href: `/`,
          },
          {
            name: '数据流程',
            key: 'projects',
            href: `/projects`,
          },
          {
            key: 'create',
            name: '新建',
          },
        ]}
      >
        <Card>
          {loadingLabels || loading ? (
            <XLoading />
          ) : (
            <React.Fragment>
              <Link to="/projects/list">
                <Button> &lt;&nbsp; 返回</Button>
              </Link>
              <Form onSubmit={e => this.handleSubmit(e)}>
                <div style={{ textAlign: 'center', marginBottom: '5px' }}>
                  <RadioGroup
                    onChange={v => this.setState({ type: v.target.value })}
                    value={this.state.type}
                  >
                    <RadioButton value="blank">新建空白项目</RadioButton>
                    <RadioButton value="template">从模版创建</RadioButton>
                  </RadioGroup>
                </div>
                {this.state.type === 'template' && (
                  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="模版">
                    {form.getFieldDecorator('template', {
                      rules: [{ required: true, message: '请选择模版' }],
                      initialValue: template,
                    })(<SelectTemplate disabled={submitting} />)}
                  </FormItem>
                )}
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

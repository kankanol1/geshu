import React from 'react';
import { connect } from 'dva';
import { Layout, Form, Col, Icon, Button, Tabs, Alert, Input, Select } from 'antd';

const FormItem = Form.Item;
const SearchForm = Form.create()(
  (props) => {
    const { getFieldDecorator, getFieldsError } = props.form;

    // Only show error after a field is touched.
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem
          label="属性名称"
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入属性名称!' }],
          })(
            <Input placeholder="属性名称" />
          )}
        </FormItem>
        <FormItem
          label="属性值"
        >
          {getFieldDecorator('value', {
            rules: [{ required: true, message: '请输入属性值!' }],
          })(
            <Input placeholder="属性值" />
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            onClick={() => {
                props.form.validateFields((err, values) => {
                    if (err) {
                      return;
                    }
                    props.onSave(values);
                  });
            }}
          >
            <Icon type="search" />
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }
);

class GraphExplore extends React.PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'graph_explore/initialize',
      payload: {
        container: 'container',
        id: this.props.match.params.id,
        dblClick: (currentObject) => {
          this.props.dispatch({
            type: 'graph_explore/exploreGraph',
            payload: currentObject,
          });
        },
      },
    });
  }
  render() {
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light">
        <div
          style={{
            width: '100%',
            background: 'white',
            padding: '20px',
          }}
        >
          <SearchForm onSave={(values) => {
            this.props.dispatch({
                type: 'graph_explore/searchGraph',
                payload: { ...values },
            });
            }}
          />
        </div>
        <div
          id="container"
          style={{
            height: `${window.screen.availHeight - 340}px`,
            width: '100%',
            background: 'white',
            marginTop: '10px',
          }}
        />
      </Layout>
    );
  }
}
export default connect(({ graph_explore }) => {
  return {
    ...graph_explore,
  };
})(GraphExplore);

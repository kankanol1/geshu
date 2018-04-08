import React from 'react';
import { connect } from 'dva';
import { Layout, Form, Icon, Button, Input, Select, InputNumber, Divider } from 'antd';

const FormItem = Form.Item;
const SearchForm = Form.create()(
  (props) => {
    const { getFieldDecorator } = props.form;
    let renderAttrs = {
      node: [],
      link: [],
    };
    const label = props.form.getFieldValue('label');
    if (label) {
      renderAttrs.node = props.type2Label2Attrs.node[label] || [];
      renderAttrs.link = props.type2Label2Attrs.link[label] || [];
    } else { renderAttrs = props.type2Attrs; }
    return (
      <Form layout="inline">
        <FormItem
          label="元素类型"
        >
          {getFieldDecorator('label', {
            rules: [{ message: '请输入元素类型!' }],
          })(
            <Select
              allowClear
              showSearch
              placeholder="元素类型"
              style={{ width: 120 }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Select.OptGroup label="节点">
                {

                  props.type2Labels.node.map(value =>
                    <Select.Option value={value} key={`label-${value}`}>{value}</Select.Option>
                 )
                 }
              </Select.OptGroup>
              <Select.OptGroup label="关系">
                {
                  props.type2Labels.link.map(value =>
                    <Select.Option value={value} key={`label-${value}`}>{value}</Select.Option>
                 )
                 }
              </Select.OptGroup>
            </Select>)}
        </FormItem>
        <FormItem
          label="属性名称"
        >
          {getFieldDecorator('name', {
            rules: [{
              required: props.form.getFieldValue('value'),
              message: '请输入属性名称!',
            }],
          })(
            <Select
              allowClear
              showSearch
              placeholder="属性名称"
              style={{ width: 120 }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Select.OptGroup label="节点属性">
                {
                  renderAttrs.node.map(value =>
                    <Select.Option value={value} key={`name-${value}`}>{value}</Select.Option>
                 )
                 }
              </Select.OptGroup>
              <Select.OptGroup label="关系属性">
                {
                  renderAttrs.link.map(value =>
                    <Select.Option value={value} key={`name-${value}`}>{value}</Select.Option>
                 )
                 }
              </Select.OptGroup>
            </Select>)}
        </FormItem>
        <FormItem
          label="属性值"
        >
          {getFieldDecorator('value', {
            rules: [{
               required: props.form.getFieldValue('name'),
               message: '请输入属性值!',
              }],
          })(
            <Input placeholder="属性值" />
          )}
        </FormItem>
        <FormItem
          label="最大元素数量"
        >
          {getFieldDecorator('limit', {
            initialValue: 5,
          })(
            <InputNumber min={1} max={20} />
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
          <div
            style={{
              fontSize: '17px',
              fontWeight: 'bold',
              marginBottom: '-20px',
              marginLeft: '10px',
           }}
          >
            当前项目：{this.props.name}
          </div>
          <Divider />
          <SearchForm
            onSave={(values) => {
            this.props.dispatch({
                type: 'graph_explore/searchGraph',
                payload: { ...values },
            });
            }}
            type2Labels={this.props.type2Labels}
            type2Label2Attrs={this.props.type2Label2Attrs}
            type2Attrs={this.props.type2Attrs}
          />
        </div>
        <div
          id="container"
          style={{
            height: `${window.screen.availHeight - 298}px`,
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

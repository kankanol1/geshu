import React from 'react';
import { Modal, Button, Input, Spin, Icon, Row, Col, List, Tabs, Table } from 'antd';
import styles from './DatabaseSelectorWidget.less';

const TabPane = Tabs.TabPane;// eslint-disable-line

export default class FileSelectorWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: { ...props.formData },
      modalVisible: false,
      selected: undefined,
      listGroup: {},
      listGroups: [{ key: '', name: '' }],
      schemaList: [],
      loading: false,
    };
  }
  componentWillReceiveProps(props) {
    this.setState({
      formData: props.formData,
    });
  }
  columns = [
    {
      title: '字段名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
    },
  ]
  requestList() {
    // set loading.
    this.setState({ loading: true });
    const url = this.props.uiSchema['ui:options'];
    fetch(url).then(results => results.json())
      .then((result) => {
        const listGroups = [];
        for (const key in result) {
          if (key === 'publicList') {
            listGroups.push({ key, name: '公共数据库' });
          } else if (key === 'privateList') {
            listGroups.push({ key, name: '私有数据库' });
          }
        }
        this.setState({
          listGroup: result,
          listGroups,
          loading: false,
        });
      });
  }

  openSelectModal() {
    this.setState({ modalVisible: true });
    this.requestList();
    // this.requestList(this.state.path);
  }

  handleItemClick(e, item) {
    this.setState({ selected: item.name, schemaList: item.schema });
  }

  handleOk() {
    // update on change.
    this.setState({
      formData: {
        value: this.state.selected,
      },
      modalVisible: false,
    }, () => this.props.onChange(this.state.formData));
  }

  render() {
    const { schema, required } = this.props;
    const { selected, listGroups, listGroup, schemaList } = this.state;
    const lastSelected = this.state.formData.value;
    return (
      <Row>
        <Col span={6}><legend>{schema.description} {required ? ' *' : null}</legend></Col>
        <Col span={6}> <Button type="primary" onClick={() => this.openSelectModal()}>选择</Button> </Col>
        <Col span={12}>
          <Input value={(lastSelected === undefined) ? '未指定' : lastSelected} disabled />
        </Col>
        <Modal
          title="选择数据库"
          width={850}
          visible={this.state.modalVisible}
          onOk={() => this.handleOk()}
          onCancel={() => { this.setState({ modalVisible: false }); }}
          className={styles.fileSelector}
        >
          {
            this.state.loading ? <div className={styles.loadingContainer}><Spin /></div> :
            (
              <Tabs
                defaultActiveKey={listGroups[0].key}
                tabPosition="left"
                tabBarStyle={{ width: 110 }}
                onChange={this.handleTableClick}
              >
                {
                  (
                    listGroups.map((item) => {
                      const tableItem =
                        (
                          <TabPane tab={item.name} key={item.key}>
                            <Row>
                              <Col span={!schemaList.length ? null : 12}>
                                <List
                                  size="small"
                                  bordered
                                  dataSource={listGroup[item.key]}
                                  className={styles.list}
                                  header="数据库列表"
                                  renderItem={items => (
                                    <List.Item
                                      onClick={(e) => { this.handleItemClick(e, items); }}
                                      className={
                                        items.name === selected ? styles.selectedItem
                                        : null
                                      }
                                    >
                                      <a className={styles.dataNamme}><Icon type="file" /> {items.name}</a>
                                    </List.Item>
                                  )}
                                />
                              </Col>
                              {
                                !schemaList.length ? null :
                                (
                                  <Col span={12}>
                                    <Table
                                      dataSource={schemaList}
                                      columns={this.columns}
                                      pagination={false}
                                    />
                                  </Col>
                                )
                              }
                            </Row>
                          </TabPane>
                        );
                      return tableItem;
                    })
                  )
                }
              </Tabs>
            )
          }
        </Modal>
      </Row>
    );
  }
}

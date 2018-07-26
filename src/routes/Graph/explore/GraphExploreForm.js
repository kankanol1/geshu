import React, { Component } from 'react';
import { connect } from 'dva';
import { Input, Icon, Tabs, Row, Col, Button, Select, Popconfirm, Radio, InputNumber } from 'antd';
import styles from './GraphExploreForm.css';

const TabPane = Tabs.TabPane;// eslint-disable-line
const RadioGroup = Radio.Group;

@connect(({ graph_explore }) => ({
  ...graph_explore,
}))
export default class GraphExploreForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchNodeList: [{
        type: '',
        attr: '',
        attrData: '',
        renderAttrs: this.props.type2Attrs,
        selectIndex: '',
        attrDataMin: '',
        attrDataMax: '',
      }],
      searchLinkList: [{
        type: '',
        attr: '',
        attrData: '',
        renderAttrs: this.props.type2Attrs,
        selectIndex: '',
        attrDataMin: '',
        attrDataMax: '',
      }],
      searchRouteList: {
        beginRouteType: '',
        beginRouteAttr: '',
        beginRouteData: '',
        beginAttrs: [],
        endRouteType: '',
        endRouteAttr: '',
        endRouteData: '',
        endAttrs: [],
        routeNum: 3,
        routeRange: 1,
      },
      limit: 5,
    };
    this.changeRoute = this.changeRoute.bind(this);
  }
  addAttr = (type) => {
    // console.log(type, 'type')
    if (type === 'node') {
      const searchListNodeNow = this.state.searchNodeList;
      const renderAttrs = this.props.type2Attrs;
      searchListNodeNow.unshift({ type: '', attr: '', attrData: '', renderAttrs, selectIndex: '', attrDataMin: '', attrDataMax: '' });
      this.setState({
        searchNodeList: [...searchListNodeNow],
      });
    } else {
      const searchListLinkNow = this.state.searchLinkList;
      const renderAttrs = this.props.type2Attrs;
      searchListLinkNow.unshift({ type: '', attr: '', attrData: '', renderAttrs, selectIndex: '', attrDataMin: '', attrDataMax: '' });
      this.setState({
        searchLinkList: [...searchListLinkNow],
      });
    }
  }
  removeAttr = (index, type) => {
    if (type === 'node') {
      const searchListNodeNow = this.state.searchNodeList;
      searchListNodeNow.splice(index, 1);
      this.setState({
        searchNodeList: [].concat(searchListNodeNow),
      });
    } else {
      const searchListLinkNow = this.state.searchLinkList;
      searchListLinkNow.splice(index, 1);
      this.setState({
        searchLinkList: [].concat(searchListLinkNow),
      });
    }
  }
  updateAttr(index, key, value, type) {
    if (type === 'node') {
      const searchListNodeNow = this.state.searchNodeList;
      searchListNodeNow[index][key] = value;
      if (key === 'type') {
        searchListNodeNow[index].renderAttrs.node = this.props.type2Label2Attrs.node[value] || [];// eslint-disable-line
        searchListNodeNow[index].renderAttrs.nodeType = this.props.type2Label2Attrs.nodeType[value] || [];// eslint-disable-line
      } else if (key === 'attr') {
        searchListNodeNow[index].renderAttrs.node.map((item, indexs) => {
          if (item === value) {
            searchListNodeNow[index].selectIndex = indexs;
          }
          return searchListNodeNow;
        });
        // searchListNow[index].selectIndex = indexs;
      }
      this.setState({
        searchNodeList: [...searchListNodeNow],
      });
    } else {
      const searchListLinkNow = this.state.searchLinkList;
      searchListLinkNow[index][key] = value;
      if (key === 'type') {
        searchListLinkNow[index].renderAttrs.linkType = this.props.type2Label2Attrs.linkType[value] || [];// eslint-disable-line
        searchListLinkNow[index].renderAttrs.link = this.props.type2Label2Attrs.link[value] || [];// eslint-disable-line
      } else if (key === 'attr') {
        searchListLinkNow[index].renderAttrs.link.map((item, indexs) => {
          if (item === value) {
            searchListLinkNow[index].selectIndex = indexs;
          }
          return searchListLinkNow;
        });
        // searchListNow[index].selectIndex = indexs;
      }
      this.setState({
        searchLinkList: [...searchListLinkNow],
      });
    }
  }
  updateRoute(key, value, type) {
    const routeList = this.state.searchRouteList;
    routeList[key] = value;
    if (type === 'type-start') {
      routeList.beginAttrs = this.props.type2Label2Attrs.node[value] || [];
    } else if (type === 'type-end') {
      routeList.endAttrs = this.props.type2Label2Attrs.node[value] || [];
    }

    this.setState({
      searchRouteList: { ...routeList },
    });
  }
  changeRoute() {
    const routeList = this.state.searchRouteList;
    const middle = routeList.beginRoute;
    routeList.beginRoute = routeList.endRoute;
    routeList.endRoute = middle;
    this.setState({
      searchRouteList: { ...routeList },
    });
  }
  searchData = (type) => {
    let searchValue = [];
    if (type === 'node') {
      searchValue = this.state.searchNodeList;
    } else {
      searchValue = this.state.searchLinkList;
    }
    // console.log(searchValue, 'searchValue');
    // console.log(this.state.limit, 'limit');
    this.props.dispatch({
      type: 'graph_explore/searchGraph',
      payload: {
        searchValue,
        limit: this.state.limit,
        type,
      },
    });
  }
  searchRouteData = () => {
    const searchValue = this.state.searchRouteList;
    this.props.dispatch({
      type: 'graph_explore/searchRouteGraph',
      payload: {
        searchValue,
      },
    });
  }
  render() {
    return (
      <div className={styles.tabsBox} >
        <Tabs defaultActiveKey="1" type="card" tabPosition="top" >
          <TabPane tab="单点探索" key="1" style={{ background: '#fff' }} >
            <Tabs defaultActiveKey="1" size="small" style={{ padding: 10, paddingTop: 0 }} tabBarStyle={{ marginBottom: 0, paddingLeft: 75 }} >
              <TabPane tab="节点" key="1" style={{ height: '100%', overflow: 'hidden' }}>
                <a style={{ textAlign: 'right', display: 'block', width: '20%', height: 30, lineHeight: '30px', float: 'right', marginTop: 5 }} onClick={this.addAttr.bind({}, 'node')}><Icon type="plus-circle" />添加</a>
                {
                  this.state.searchNodeList.map((item, index) => {
                    return (
                      <div className={styles.typeBox} key={index} >
                        {
                          item.type || item.attr || item.attrData ?
                          (
                            <Popconfirm
                              title="确认删除吗?"
                              onConfirm={this.removeAttr.bind({}, index, 'node')}
                            >
                              <a style={{ textAlign: 'center', display: 'block', width: '10%', height: 25, lineHeight: '25px', float: 'right' }}><Icon type="close" /></a>
                            </Popconfirm>
                          ) : (
                            <a style={{ textAlign: 'center', display: 'block', width: '10%', height: 25, lineHeight: '25px', float: 'right' }} onClick={this.removeAttr.bind({}, index, 'node')}><Icon type="close" /></a>
                          )
                        }
                        <Row style={{ width: '100%', float: 'left' }} >
                          <Col span={7} style={{ marginRight: 10 }}>类型</Col>
                          <Col span={15}>
                            <Select
                              style={{ width: 111 }}
                              value={item.type}
                              onChange={(value) => {
                                this.updateAttr(index, 'type', value, 'node');
                              }}
                            >
                              {
                                this.props.type2Labels.node.map(value =>
                                  <Select.Option value={value} key={`label-${value}`}>{value}</Select.Option>
                                )
                              }
                            </Select>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 10, width: '100%', float: 'left' }}>
                          <Col span={7} style={{ marginRight: 10 }}>属性</Col>
                          <Col span={15}>
                            {/* <Input value={item.attr}
                                onChange={(event) => {
                                this.updateAttr(index, 'attr', event.target.value);
                              }}
                            /> */}
                            <Select
                              style={{ width: 111 }}
                              value={item.attr}
                              onChange={(value) => {
                              this.updateAttr(index, 'attr', value, 'node');
                            }}
                            >
                              {
                                this.state.searchNodeList[index].renderAttrs.node.map(value =>
                                  <Select.Option value={value} key={`name-${value}`}>{value}</Select.Option>
                                )
                              }
                            </Select>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 10, width: '100%', float: 'left' }}>
                          <Col span={7} style={{ marginRight: 10 }}>属性值</Col>
                          <Col span={15}>
                            {
                              this.state.searchNodeList[index].renderAttrs.nodeType[this.state.searchNodeList[index].selectIndex] !== 'String' ?
                              (
                                <div>
                                  <Input
                                    className={styles.attrTypeRange}
                                    value={item.attrDataMin}
                                    onChange={(event) => {
                                      this.updateAttr(index, 'attrDataMin', event.target.value, 'node');
                                    }}
                                  />
                                  <span className={styles.attrTypeSpan}>到</span>
                                  <Input
                                    className={styles.attrTypeRange}
                                    value={item.attrDataMax}
                                    onChange={(event) => {
                                      this.updateAttr(index, 'attrDataMax', event.target.value, 'node');
                                    }}
                                  />
                                </div>
                              ) : (
                                <Input
                                  value={item.attrData}
                                  onChange={(event) => {
                                    this.updateAttr(index, 'attrData', event.target.value, 'node');
                                  }}
                                />
                              )
                            }
                          </Col>
                        </Row>
                      </div>
                    );
                  })
                }
                <Row style={{ marginTop: 10, float: 'left', width: '100%' }} >
                  <Col span={7} style={{ marginLeft: 10, marginTop: 3 }}>最大值</Col>
                  <Col span={15}>
                    <Input
                      value={this.state.limit}
                      onChange={(event) => {
                        this.setState({
                          limit: event.target.value,
                        });
                      }}
                    />
                  </Col>
                </Row>
                <Button type="primary" icon="search" style={{ width: '100%', marginTop: 10, marginBottom: 30, float: 'left' }} onClick={this.searchData.bind({}, 'node')}>搜索</Button>
              </TabPane>
              <TabPane tab="关系" key="2" style={{ height: '100%', overflowY: 'hidden' }}>
                <a style={{ textAlign: 'right', display: 'block', width: '20%', height: 30, lineHeight: '30px', float: 'right', marginTop: 5 }} onClick={this.addAttr.bind({}, 'link')}><Icon type="plus-circle" />添加</a>
                {
                  this.state.searchLinkList.map((item, index) => {
                    return (
                      <div className={styles.typeBox} key={index} >
                        {
                          item.type || item.attr || item.attrData ?
                          (
                            <Popconfirm
                              title="确认删除吗?"
                              onConfirm={this.removeAttr.bind({}, index, 'link')}
                            >
                              <a style={{ textAlign: 'center', display: 'block', width: '10%', height: 25, lineHeight: '25px', float: 'right' }}><Icon type="close" /></a>
                            </Popconfirm>
                          ) : (
                            <a style={{ textAlign: 'center', display: 'block', width: '10%', height: 25, lineHeight: '25px', float: 'right' }} onClick={this.removeAttr.bind({}, index, 'link')}><Icon type="close" /></a>
                          )
                        }
                        <Row style={{ width: '100%', float: 'left' }} >
                          <Col span={7} style={{ marginRight: 10 }}>类型</Col>
                          <Col span={15}>
                            <Select
                              style={{ width: 111 }}
                              value={item.type}
                              onChange={(value) => {
                                this.updateAttr(index, 'type', value, 'link');
                              }}
                            >
                              {
                                this.props.type2Labels.link.map(value =>
                                  <Select.Option value={value} key={`label-${value}`}>{value}</Select.Option>
                                )
                              }
                            </Select>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 10, width: '100%', float: 'left' }}>
                          <Col span={7} style={{ marginRight: 10 }}>属性</Col>
                          <Col span={15}>
                            <Select
                              style={{ width: 111 }}
                              value={item.attr}
                              onChange={(value) => {
                              this.updateAttr(index, 'attr', value, 'link');
                            }}
                            >
                              {
                                this.state.searchLinkList[index].renderAttrs.link.map(value =>
                                  <Select.Option value={value} key={`name-${value}`}>{value}</Select.Option>
                                )
                              }
                            </Select>
                          </Col>
                        </Row>
                        <Row style={{ marginTop: 10, width: '100%', float: 'left' }}>
                          <Col span={7} style={{ marginRight: 10 }}>属性值</Col>
                          <Col span={15}>
                            {
                              this.state.searchLinkList[index].renderAttrs.linkType[this.state.searchLinkList[index].selectIndex] !== 'String' ?
                              (
                                <div>
                                  <Input
                                    className={styles.attrTypeRange}
                                    value={item.attrDataMin}
                                    onChange={(event) => {
                                      this.updateAttr(index, 'attrDataMin', event.target.value, 'link');
                                    }}
                                  />
                                  <span className={styles.attrTypeSpan}>到</span>
                                  <Input
                                    className={styles.attrTypeRange}
                                    value={item.attrDataMax}
                                    onChange={(event) => {
                                      this.updateAttr(index, 'attrDataMax', event.target.value, 'link');
                                    }}
                                  />
                                </div>
                              ) : (
                                <Input
                                  value={item.attrData}
                                  onChange={(event) => {
                                    this.updateAttr(index, 'attrData', event.target.value, 'link');
                                  }}
                                />
                              )
                            }
                          </Col>
                        </Row>
                      </div>
                    );
                  })
                }
                <Row style={{ marginTop: 10, float: 'left', width: '100%' }} >
                  <Col span={7} style={{ marginLeft: 10, marginTop: 3 }}>最大值</Col>
                  <Col span={15}>
                    <Input
                      value={this.state.limit}
                      onChange={(event) => {
                        this.setState({
                          limit: event.target.value,
                        });
                      }}
                    />
                  </Col>
                </Row>
                <Button type="primary" icon="search" style={{ width: '100%', marginTop: 10, marginBottom: 30, float: 'left' }} onClick={this.searchData.bind({}, 'link')}>搜索</Button>
              </TabPane>
            </Tabs>
          </TabPane>
          <TabPane tab="路径搜索" key="2" >
            <div style={{ width: '100%', height: '100%', background: '#fff', overflow: 'hidden', padding: 10, position: 'relative' }}>
              <div className={styles.typeBox}>
                <Row style={{ width: '100%', float: 'left', marginLeft: 10, marginTop: 10 }} >
                  <Col span={6} style={{ marginRight: 10 }}>起点类型：</Col>
                  <Col span={16}>
                    <Select
                      style={{ width: '80%' }}
                      onChange={(value) => {
                        this.updateRoute('beginRouteType', value, 'type-start');
                      }}
                    >
                      {
                        this.props.type2Labels.node.map(value =>
                          <Select.Option value={value} key={`label-${value}`}>{value}</Select.Option>
                        )
                      }
                    </Select>
                  </Col>
                </Row>
                <Row style={{ width: '100%', float: 'left', marginLeft: 10, marginTop: 10 }} >
                  <Col span={6} style={{ marginRight: 10 }}>起点属性：</Col>
                  <Col span={16}>
                    <Select
                      style={{ width: '80%' }}
                      onChange={(value) => {
                        this.updateRoute('beginRouteAttr', value, 'node');
                      }}
                    >
                      {
                        this.state.searchRouteList.beginAttrs.map(value =>
                          <Select.Option value={value} key={`name-${value}`}>{value}</Select.Option>
                        )
                      }
                    </Select>
                  </Col>
                </Row>
                <Row style={{ width: '100%', float: 'left', marginLeft: 10, marginTop: 10 }} >
                  <Col span={6} style={{ marginRight: 10 }}>起点值：</Col>
                  <Col span={16}>
                    <Input
                      style={{ width: '80%' }}
                      value={this.state.searchRouteList.beginRouteData}
                      onChange={(event) => {
                        this.updateRoute('beginRouteData', event.target.value, 'data');
                      }}
                    />
                  </Col>
                </Row>
              </div>
              <div className={styles.typeBox}>
                <Row style={{ width: '100%', float: 'left', marginLeft: 10, marginTop: 10 }} >
                  <Col span={6} style={{ marginRight: 10 }}>终点类型：</Col>
                  <Col span={16}>
                    <Select
                      style={{ width: '80%' }}
                      onChange={(value) => {
                        this.updateRoute('endRouteType', value, 'type-end');
                      }}
                    >
                      {
                        this.props.type2Labels.node.map(value =>
                          <Select.Option value={value} key={`label-${value}`}>{value}</Select.Option>
                        )
                      }
                    </Select>
                  </Col>
                </Row>
                <Row style={{ width: '100%', float: 'left', marginLeft: 10, marginTop: 10 }} >
                  <Col span={6} style={{ marginRight: 10 }}>终点属性：</Col>
                  <Col span={16}>
                    <Select
                      style={{ width: '80%' }}
                      onChange={(value) => {
                        this.updateRoute('endRouteAttr', value, 'node');
                      }}
                    >
                      {
                        this.state.searchRouteList.endAttrs.map(value =>
                          <Select.Option value={value} key={`name-${value}`}>{value}</Select.Option>
                        )
                      }
                    </Select>
                  </Col>
                </Row>
                <Row style={{ width: '100%', float: 'left', marginLeft: 10, marginTop: 10 }} >
                  <Col span={6} style={{ marginRight: 10 }}>终点值：</Col>
                  <Col span={16}>
                    <Input
                      style={{ width: '80%' }}
                      value={this.state.searchRouteList.endRouteData}
                      onChange={(event) => {
                        this.updateRoute('endRouteData', event.target.value, 'data');
                      }}
                    />
                  </Col>
                </Row>
              </div>
              <Row style={{ width: '100%', float: 'left', marginTop: 10, marginLeft: 10 }} >
                <Col span={3} style={{ marginRight: 10 }}>跳数</Col>
                <Col span={15}>
                  <InputNumber
                    min={2}
                    max={5}
                    value={this.state.searchRouteList.routeNum}
                    onChange={(value) => {
                      this.updateRoute('routeNum', value);
                    }}
                  />
                </Col>
              </Row>
              <RadioGroup
                style={{ marginLeft: 60, marginTop: 10 }}
                value={this.state.searchRouteList.routeRange}
                onChange={(event) => {
                 this.updateRoute('routeRange', event.target.value);
                }}
              >
                <Radio className={styles.radioStyle} value={1}>最短路径</Radio>
                <Radio className={styles.radioStyle} value={2}>所有最短路径</Radio>
                <Radio className={styles.radioStyle} value={3}>所有路径</Radio>
              </RadioGroup>
              <Button type="primary" icon="search" style={{ width: '100%', marginTop: 10, marginBottom: 20, float: 'left' }} onClick={this.searchRouteData.bind({}, 'link')}>搜索</Button>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Icon, Spin, Tooltip, Alert, Tabs, Modal } from 'antd';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/sql/sql';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/addon/display/placeholder';
import styles from './index.less';
import VisualizationModal from './VisualizationModal';

const { TabPane } = Tabs;
const ButtonGroup = Button.Group;

export default class SqlQueryTable extends Component {
  static defaultProps = {
    sql: undefined,
    queryResult: undefined,
    loading: undefined,
  }

  constructor(props) {
    super(props);
    this.state = {
      query: props.sql === undefined ? '' : props.sql,
      pageNum: 0,
      pageSize: 20,
      showVisualizationModal: true,
      panes: [],
      activePane: 'default',
      count: 0,
      lastQuerySql: undefined,
    };
  }

  componentWillReceiveProps(props) {
    if (props.sql !== undefined) {
      this.setState({ query: props.sql });
    }
  }

  fetchData(state, instance) {
    this.setState({ pageSize: state.pageSize, pageNum: state.page }, () => this.performQuery());
  }

  performQuery() {
    const { onQuery } = this.props;
    if (onQuery !== undefined && this.state.query !== '') {
      onQuery(
        this.state.query,
        this.state.pageNum,
        this.state.pageSize
      );
      this.setState({ lastQuerySql: this.state.query });
    }
  }

  newChartTab(chartInfo) {
    const key = `chart-${this.state.count}`;
    this.setState({
      panes: [...this.state.panes, { ...chartInfo, key }],
      count: this.state.count + 1,
      activePane: key,
    });
  }

  renderVisualizationModal = () => {
    return (
      <Modal
        title="请选择可视化类型"
        visible={this.state.showVisualizationModal}
        footer={null}
        onCancel={() => this.setState({ showVisualizationModal: false })}
      >
        <VisualizationModal
          onSelected={(obj) => {
             this.newChartTab(obj);
             this.setState({ showVisualizationModal: false });
          }}
          sql={this.state.lastQuerySql}
        />
      </Modal>
    );
  }

  render() {
    const { queryResult, loading } = this.props;

    let displayTable = null;
    if (queryResult !== undefined && queryResult.success) {
      const { data, pagination } = queryResult;
      const columns = queryResult.meta.map((m) => {
        return { Header: m.label, accessor: m.label };
      });
      const pages = Math.ceil(pagination.total / pagination.pagesize);
      displayTable = (
        <ReactTable
          manual
          loading={loading}
          data={data}
          columns={columns}
          defaultPageSize={this.state.pageSize}
          className="-striped -highlight"
          pages={pages}
          onFetchData={(state, instance) => this.fetchData(state, instance)}
        />
      );
    }
    return (
      <React.Fragment>
        <Card>
          <CodeMirror
            value={this.state.query}
            options={{
              lineNumbers: true,
              mode: 'text/x-hive',
              theme: 'solarized',
              placeholder: '输入查询sql',
            }}
            onBeforeChange={(editor, data, value) => {
              this.setState({ query: value });
            }}
            className={styles.codemirror}
          />
          <div className={styles.buttonContainer}>
            <Button
              type="primary"
              className={styles.button}
              onClick={() => { this.setState({ pageNum: 0, activePane: 'default' }, () => this.performQuery()); }}
            >
              <Icon type="play-circle" /> 查询
            </Button>
            <Button
              type="danger"
              className={styles.button}
              onClick={() => this.setState({ query: '' })}
              disabled={this.state.query === undefined || this.state.query === ''}
            >清空
            </Button>
          </div>
        </Card>
        <Card>
          <Tabs
            type="editable-card"
            activeKey={this.state.activePane}
            onChange={ak => this.setState({ activePane: ak })}
            onEdit={(k, action) => {
              if (action === 'remove') {
                this.setState({ panes: this.state.panes.filter(p => p.key !== k) });
              }
            }}
          >
            <TabPane tab="查询结果" key="default" closable={false}>
              {
                queryResult === undefined ?
                (loading ? <Spin /> : null)
                : (
                  <React.Fragment>
                    {
                      queryResult.success ? (
                        <React.Fragment>
                          <ButtonGroup className={styles.buttonForTable}>
                            <Button
                              onClick={() =>
                                this.setState({ showVisualizationModal: true })}
                            ><Icon type="area-chart" />可视化
                            </Button>
                            <Button><Icon type="download" />.csv</Button>
                          </ButtonGroup>
                          {displayTable}
                        </React.Fragment>
                      ) :
                        <Alert message={queryResult.message} type="error" showIcon className={styles.alert} />
                    }
                  </React.Fragment>
                )
              }
            </TabPane>
            {this.state.panes.map((chart, i) => {
              return (
                <TabPane key={chart.key} tab={chart.name} closable>
                  {chart.render}
                </TabPane>
              );
            })}
          </Tabs>
        </Card>
        {
          // this.renderVisualizationModal()
          }
      </React.Fragment>
    );
  }
}

SqlQueryTable.propTypes = {
  queryResult: PropTypes.object,
  loading: PropTypes.bool,
  onQuery: PropTypes.func.isRequired,
  sql: PropTypes.string,
};

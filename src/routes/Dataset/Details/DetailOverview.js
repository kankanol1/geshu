
import React, { PureComponent, Fragment } from 'react';
import { Spin, Card } from 'antd';
import PropTypes from 'prop-types';
import { Chart, Geom, Axis, Tooltip, Label } from 'bizcharts';
import { queryPrivateDatasetStatistics, queryDatasetStatistics } from '../../../services/datasetAPI';

export default class DetailOverview extends PureComponent {
  static defaultProps = {
    type: 'normal',
  }

  state={
    heatmap: {
      // data, cols.
    },
    dataLoading: true,
    loadingMessage: undefined,
    loading: true,
  }

  componentWillMount() {
    this.setState({ loading: true });
    setTimeout(() => this.fetchIfStillLoading(), 100);
  }

  fetchIfStillLoading = () => {
    const queryAPI = this.props.type === 'private' ? queryPrivateDatasetStatistics : queryDatasetStatistics;
    queryAPI({ id: this.props.datasetId }).then(
      (response) => {
        if (response) {
          const { data, loading, message } = response;
          if (loading) {
            this.setState({
              heatmap: { },
              loading: false,
              dataLoading: loading,
              loadingMessage: message,
            });
            // start timeout.
            setTimeout(() => this.fetchIfStillLoading(), 1000);
          } else {
            const { heatMap } = data;
            const { columns, values } = heatMap;
            const converted = [];
            for (let i = 0; i < values.length; i++) {
              for (let j = 0; j < values[0].length; j++) {
                converted.push({
                  c1: i,
                  c2: j,
                  value: parseFloat(values[i][j]),
                });
              }
            }
            const cols = {
              c1: {
                type: 'cat',
                values: columns,
              },
              c2: {
                type: 'cat',
                values: columns,
              },
            };
            this.setState({
              heatmap: {
                data: converted,
                cols,
              },
              loading: false,
              dataLoading: loading,
              loadingMessage: message,
            });
          }
        }
      },
    );
  }

  renderHeatmap = () => {
    const { heatmap, loading, dataLoading, loadingMessage } = this.state;
    const { data, cols } = heatmap;
    if (loading) {
      return <Spin />;
    }
    if (dataLoading) {
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}><Spin /></div>
          <span>{loadingMessage}</span>
        </div>
      );
    }
    return (
      <Chart
        height={600}
        data={data}
        scale={cols}
        style={{ overflow: 'auto' }}
        padding={[20, 80, 40, 85]}
        width={1000}
        // forceFit
      >
        <Axis
          name="c1"
          label={{
            textStyle: {
              fontSize: '11',
              rotate: '0',
            },
            autoRotate: false,
          }}
          grid={{
            align: 'center',
            lineStyle: {
              lineWidth: 1,
              lineDash: null,
              stroke: '#f0f0f0',
            },
            showFirstLine: true,
          }}
        />
        <Axis
          name="c2"
          label={{
            textStyle: {
              fontSize: '11',
            },
          }}
          grid={{
            align: 'center',
            lineStyle: {
              lineWidth: 1,
              lineDash: null,
              stroke: '#f0f0f0',
            },
          }}
        />
        <Tooltip />
        <Geom
          type="polygon"
          position="c1*c2"
          tooltip={['c1*c2', (c1, c2, value) => {
            return {
              // 自定义 tooltip 上显示的 title 显示内容等。
              title: cols.c1.values[c1],
              name: cols.c2.values[c2],
              value: data.filter(i => i.c1 === c1 && i.c2 === c2)[0].value,
            };
          }]}
          color={['value', '#BAE7FF-#1890FF-#0050B3']}
          style={{
            stroke: '#fff',
            lineWidth: 1,
          }}
        >
          {/* <Label
            content="value"
            offset={-2}
            textStyle={{
                fill: '#fff',
                fontWeight: 'bold',
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)',
              }}
          /> */}
        </Geom>
      </Chart>
    );
  }

  render() {
    return (
      <div>
        {/* <Row>
          <Col span={12}> */}
        <Card title="列相关性表格">
          {this.renderHeatmap()}
        </Card>
        {/* </Col>
        </Row> */}
      </div>
    );
  }
}

DetailOverview.propTypes = {
  datasetId: PropTypes.string.isRequired,
  type: PropTypes.string,
};

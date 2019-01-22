import React, { PureComponent, Fragment } from 'react';
import { Spin, Card, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { Chart, Geom, Axis, Tooltip, Label } from 'bizcharts';
import { queryDatasetStatistics } from '@/services/datapro/datasetAPI';
import styles from './DetailOverview.less';

const keyTranslate = {
  min: '最小值',
  max: '最大值',
  mean: '平均值',
  stdev: '标准差',
};

export default class DetailOverview extends PureComponent {
  state = {
    heatmap: {
      // data, cols.
    },
    statistics: [],
    dataLoading: true,
    loadingMessage: undefined,
    loading: true,
  };

  componentWillMount() {
    this.setState({ loading: true });
    setTimeout(() => this.fetchIfStillLoading(), 100);
  }

  formatHeatMapData = data => {
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
    });
  };

  formatStatisticsData = data => {
    const { columns, histograms, statistics } = data;
    const columnsData = [];
    columns.forEach(item => {
      const key = item.name;
      const histogramsData = [];
      const statisticsData = { ...statistics[key] } || {};
      histograms[key].forEach(item1 => {
        const newItem = { ...item1 };
        if (item.type === 'string') {
          const persent = Math.floor((newItem.count * 100) / histograms[key][0].count);
          newItem.v = `${persent}%`;
        }
        histogramsData.push(newItem);
      });

      const columnItem = {
        ...item,
        histogramsData,
        statisticsData,
      };
      columnsData.push(columnItem);
    });
    this.setState({
      statistics: columnsData,
    });
  };

  clearData = () => {
    this.setState({
      heatmap: {},
      statistics: [],
    });
  };

  fetchIfStillLoading = () => {
    const queryAPI = queryDatasetStatistics;
    queryAPI({ id: this.props.datasetId }).then(response => {
      if (response) {
        const { data, loading, message } = response;
        if (loading) {
          this.clearData();
          this.setState({
            loading: false,
            dataLoading: loading,
            loadingMessage: message,
          });
          // start timeout.
          setTimeout(() => this.fetchIfStillLoading(), 1000);
        } else {
          this.formatHeatMapData(data);
          this.formatStatisticsData(data);
          this.setState({
            loading: false,
            dataLoading: loading,
            loadingMessage: message,
          });
        }
      }
    });
  };

  renderNumberChart = (statistics, data) => {
    return (
      <div>
        <Chart
          height={220}
          padding={[20, 20, 60, 50]}
          data={data}
          scale={{
            range: { alias: '范围' },
            count: { alias: '总数' },
          }}
          forceFit
        >
          <Axis name="range" title />
          <Axis name="count" title />
          <Tooltip />
          <Geom type="interval" position="range*count" />
        </Chart>
        <div className={styles.statisticsProcessBox}>
          <Row>
            {Object.keys(statistics)
              .filter(k => Object.keys(keyTranslate).includes(k))
              .map(key => (
                <Col key={key} style={{ marginBottom: '2px' }}>
                  <div className={styles.statisticsProcessItem}>
                    <div className={styles.statisticsProcessLabel}>{keyTranslate[key]}</div>
                    <div className={styles.statisticsProcessCount}>
                      <span className={styles.fontGrey}>
                        {parseFloat(statistics[key]).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Col>
              ))}
          </Row>
        </div>
      </div>
    );
  };

  renderStringChart = data => {
    return (
      <Row>
        {data.map((item, i) => (
          <Col key={i} style={{ marginBottom: '2px' }}>
            <div className={styles.stringChartBox}>
              <div className={styles.stringChartProcessBox}>
                <div className={styles.stringChartTitle}>{item.range}</div>
                <div className={styles.stringChartProcess} style={{ width: `${item.v}` }} />
              </div>
              <div className={styles.stringChartLabel}>{item.count}</div>
            </div>
          </Col>
        ))}
      </Row>
    );
  };

  renderLoading = loadingMessage => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Spin />
      </div>
      <span>{loadingMessage}</span>
    </div>
  );

  renderStatistics = () => {
    const { statistics, loading, dataLoading, loadingMessage } = this.state;
    if (loading || dataLoading) {
      return this.renderLoading(loadingMessage || '加载中');
    }
    return (
      <Row>
        {statistics.map((item, i) => (
          <Col span={12} key={i}>
            <Card
              style={{ width: '100%', padding: '0' }}
              bodyStyle={{ padding: '20px' }}
              title={item.name}
            >
              {/* <div className={styles.statisticsTitle}>
                  {item.name}
                </div> */}
              <div className={styles.statisticsProcess}>
                <div
                  className={styles.statisticsProcessChart}
                  style={{
                    width: `${(
                      ((item.statisticsData.count - item.statisticsData.nullNum) /
                        item.statisticsData.count) *
                      100
                    ).toFixed(2)}%`,
                  }}
                />
              </div>
              <div className={styles.statisticsProcessBox}>
                <div className={styles.statisticsProcessItem}>
                  <div className={styles.statisticsProcessLabel}>总条数</div>
                  <div className={styles.statisticsProcessCount}>
                    <span className={styles.fontBlue}>{item.statisticsData.count}</span>
                  </div>
                </div>
                <div className={styles.statisticsProcessItem}>
                  <div className={styles.statisticsProcessLabel}>空值</div>
                  <div className={styles.statisticsProcessCount}>
                    <span className={styles.fontBlack}>{item.statisticsData.nullNum}</span>
                  </div>
                </div>
              </div>
              <div>
                {item.type === 'numeric'
                  ? this.renderNumberChart(item.statisticsData, item.histogramsData)
                  : this.renderStringChart(item.histogramsData)}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  renderHeatmap = () => {
    const { heatmap, loading, dataLoading, loadingMessage } = this.state;
    const { data, cols } = heatmap;
    if (loading || dataLoading) {
      return this.renderLoading(loadingMessage || '加载中');
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
          tooltip={[
            'c1*c2',
            (c1, c2, value) => {
              return {
                // 自定义 tooltip 上显示的 title 显示内容等。
                title: cols.c1.values[c1],
                name: cols.c2.values[c2],
                value: data.filter(i => i.c1 === c1 && i.c2 === c2)[0].value,
              };
            },
          ]}
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
  };

  render() {
    return (
      <div>
        <Row>
          <Col span={24}>
            <Card title="列统计">{this.renderStatistics()}</Card>
          </Col>
          <Col span={24}>
            <Card title="列相关性表格">{this.renderHeatmap()}</Card>
          </Col>
        </Row>
      </div>
    );
  }
}

DetailOverview.propTypes = {
  datasetId: PropTypes.string.isRequired,
};

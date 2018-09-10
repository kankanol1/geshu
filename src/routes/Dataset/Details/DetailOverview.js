
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Spin, Card } from 'antd';
import { Chart, Geom, Axis, Tooltip, Label } from 'bizcharts';

@connect(({ databasedetail, loading }) => ({
  databasedetail,
  loading: loading.models.databasedetail,
}))
export default class DetailOverview extends PureComponent {
  componentWillMount() {
    this.props.dispatch({
      type: 'databasedetail/fetchHeatmap',
    });
  }

  renderHeatmap = () => {
    const { databasedetail, loading } = this.props;
    const { data, cols } = databasedetail.heatmap;
    if (loading) {
      return <Spin />;
    }
    return (
      <Chart
        height={600}
        data={data}
        scale={cols}
        style={{ overflow: 'auto' }}
        padding={[20, 80, 40, 85]}
        width={1800}
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

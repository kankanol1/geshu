
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
        padding={[20, 80, 120, 85]}
        width={800}
        // forceFit
      >
        <Axis
          name="c1"
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

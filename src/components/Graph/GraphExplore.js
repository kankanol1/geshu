import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Layout, Alert } from 'antd';
import GojsRelationGraph from '../../../utils/GojsRelationGraph';
import GraphExploreSearchForm from './GraphExploreSearchForm';
import PullUpFrame from '../../../components/PullUpFrame';
import GraphOperation from './GraphOperation';
import styles from './GraphExplore.css';

class GraphExplore extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pullBoxRange: true,
    };
  }
  tagClick = (pullBoxRange) => {
    const { diagram } = GojsRelationGraph.getGraph(this.props.graphName);
    this.setState({
      pullBoxRange,
    });
    diagram.scale = Math.random();
    setTimeout(() => { diagram.zoomToFit(); }, 10);
  }
  render() {
    const graph = GojsRelationGraph.getGraph(this.props.graphName);
    const graphStatus = this.props.status && this.props.status.toUpperCase() !== 'DATA_UPLOADED';
    return (
      <Layout style={{ padding: '0', height: '100%' }} theme="light">
        {
         graphStatus ?
          (
            <Alert
              description={
                <span>
                项目尚未完成数据上传操作，暂不支持查询，详情至
                  <Link to="/jobs/list" >作业列表</Link>
                </span>
            }
              type="warning"
              showIcon
            />
          ) : (
            <PullUpFrame
              className={styles.PullUpFrame}
              tagClick={this.tagClick}
            >
              <div>
                <GraphExploreSearchForm
                  disable={graphStatus}
                  onSave={(values) => {
                    this.props.dispatch({
                        type: 'graph_explore/searchGraph',
                        payload: { ...values },
                    });
                  }}
                />
              </div>
            </PullUpFrame>
          )
        }

        <GraphOperation
          afterInit={() => {
            if (this.props.location.query && this.props.location.query.recordId) {
              this.props.dispatch({
                type: 'graph_explore/searchGraph',
                payload: {
                  recordId: this.props.location.query.recordId,
                },
              });
            }
          }}
          paramsId={this.props.match.params.id}
          operationLoading={this.props.loading}
          diagramHight={(this.state.pullBoxRange ? `${window.screen.availHeight - 298}px` : `${window.screen.availHeight - 200}px`)}
          graphObject={graph}
        />
      </Layout>
    );
  }
}
export default connect(({ graph_explore, loading }) => {
  return {
    ...graph_explore,
    loading: loading.models.graph_explore,

  };
})(GraphExplore);

import React from 'react';
import { connect } from 'dva';
import GraphExploreForm from './GraphExploreForm';
import styles from './GraphExplore.css';
import GojsRelationGraph from '../../../utils/GojsRelationGraph';


class GraphExplore extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      variableRange: true,
    };
    this.variableChange = this.variableChange.bind(this);
  }
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
  variableChange() {
    this.setState({
      variableRange: !this.state.variableRange,
    });
    const { diagram } = GojsRelationGraph.getGraph('graph_explore');
    diagram.scale = Math.random();
  }
  render() {
    return (
      <div style={{ padding: '0', height: '100%', overflow: 'hidden', position: 'relative' }} >
        <div
          style={{
            fontSize: '17px',
            fontWeight: 'bold',
            textAlign: 'center',
            width: '100%',
            height: 30,
            float: 'left',
          }}
        >
          当前项目：{this.props.name}
        </div>
        <div
          className={this.state.variableRange
            ? styles.searchBox :
            styles.searchBoxHide
          }
        >
          <GraphExploreForm
            type2Labels={this.props.type2Labels}
            type2Label2Attrs={this.props.type2Label2Attrs}
            type2Attrs={this.props.type2Attrs}
          />
        </div>
        <div
          className={this.state.variableRange
            ? styles.variableRangeBox :
            styles.variableRangeBoxHide
          }
        >
          <i
            className={this.state.variableRange
              ? styles.variableRange :
              styles.variableRangeHide
            }
            onClick={this.variableChange}
          />
        </div>
        <div
          id="container"
          style={{
            height: '100%',
            width: (this.state.variableRange ? '70%' : '95%'),
            background: 'white',
            float: 'left',
          }}
        />
      </div>
    );
  }
}
export default connect(({ graph_explore }) => {
  return {
    ...graph_explore,
  };
})(GraphExplore);

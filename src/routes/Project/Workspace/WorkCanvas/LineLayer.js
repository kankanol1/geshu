import React from 'react';
import { DraggableCore } from 'react-draggable';
import { calculateLineStr } from '../../../../utils/PositionCalculation';

class LineLayer extends React.PureComponent {
  handleLineClick(e, params) {
    this.props.dispatch({
      type: 'work_canvas/updateLineSelection',
      ...params,
    });
  }

  render() {
    return (
      <React.Fragment>
        {
          this.props.model.connectTo.map(
            (line, i) => {
              const from = this.props.positionDict[this.props.model.id][line.output];
              const to = this.props.positionDict[line.component][line.input];
              const lineStr = calculateLineStr(from.x, from.y, to.x, to.y);
              return (
                <React.Fragment key={i}>
                  <polyline
                    points={lineStr}
                    style={{ fill: 'none', stroke: '#391085', strokeWidth: 1 }}
                  />
                  <DraggableCore onStart={e => e.stopPropagation()}>
                    <polyline
                      points={lineStr}
                      style={{ fill: 'none', stroke: '#fff', strokeWidth: 20, opacity: 0 }}
                      onClick={(e) => {
                        this.handleLineClick(e, {
                          source: this.props.model.id,
                          target: line.component,
                          from: line.output,
                          to: line.input,
                        });
                      }
                      }
                    />
                  </DraggableCore>
                </React.Fragment>
              );
            }
          )
        }
      </React.Fragment>
    );
  }
}

export default LineLayer;

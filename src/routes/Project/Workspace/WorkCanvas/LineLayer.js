import React from 'react';
import { DraggableCore } from 'react-draggable';
import { calculateLineStr } from '../../../../utils/PositionCalculation';

class LineLayer extends React.PureComponent {
  handleLineClick(e, params) {
    e.preventDefault();
    this.props.dispatch({
      type: 'work_canvas/updateLineSelection',
      ...params,
    });
  }


  render() {
    const r = 10 + 6;
    return (
      <React.Fragment>
        {
          this.props.model.connectFrom.map(
            (line, i) => {
              const from = this.props.positionDict[line.component][line.from];
              const to = this.props.positionDict[this.props.model.id][line.to];
              const lineStr = calculateLineStr(from.x + r, from.y, to.x - r, to.y);
              return (
                <React.Fragment key={i}>
                  <svg
                    style={{ width: '100%', height: '100%', position: 'absolute', top: '0', left: '0' }}

                  >
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
                          source: line.component,
                          target: this.props.model.id,
                          from: line.from,
                          to: line.to,
                        });
                      }
                      }
                      />
                    </DraggableCore>
                  </svg>
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

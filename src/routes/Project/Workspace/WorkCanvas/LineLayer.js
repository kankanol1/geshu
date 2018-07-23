import React from 'react';
import { DraggableCore } from 'react-draggable';
import { calculateLineCurly } from '../../../../utils/PositionCalculation';
import SelectionChange from '../../../../obj/workspace/op/SelectionChange';

const r = 10 + 6;

class LineLayer extends React.Component {
  shouldComponentUpdate() {
    // need to know the connected components.
    return true;
    // if (!this.props.model) return true;
    // const result = !this.lastUpdated || this.lastUpdated < this.props.model.updated;
    // if (result) this.lastUpdated = this.props.model.updated;
    // return result;
  }

  handleLineClick(e, params) {
    e.preventDefault();
    const { canvas } = this.props;
    const newSelection = [{ type: 'line', ...params }];
    if (!canvas.isCurrentSelection(newSelection)) {
      canvas.apply(new SelectionChange(newSelection));
      // trigger update.
      this.props.onCanvasUpdated(canvas);
    }
  }

  render() {
    return (
      <svg
        style={{ width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', pointerEvents: 'none' }}
        onClick={e => true}
      >
        {
          this.props.model.connections.map(
            (line, i) => {
              const from = this.props.positionDict[line.component][line.from];
              const to = this.props.positionDict[this.props.model.id][line.to];
              const lineStr = calculateLineCurly(from.x + r, from.y, to.x - r, to.y);
              return (
                <React.Fragment key={i}>
                  {/* <polyline
                      points={lineStr}
                      style={{ fill: 'none', stroke: '#391085', strokeWidth: 1 }}
                    /> */}
                  <path d={lineStr} style={{ fill: 'none', stroke: '#391085', strokeWidth: 1 }} />
                  <DraggableCore onStart={e => e.stopPropagation()}>
                    <path
                      d={lineStr}
                      style={{ fill: 'none', stroke: '#fff', strokeWidth: 20, opacity: 0, pointerEvents: 'auto' }}
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
                </React.Fragment>
              );
            }
          )
        }
      </svg>
    );
  }
}

export default LineLayer;

import React from 'react';
import { DraggableCore } from 'react-draggable';
import { calculateLineStr, calculateLineCurly } from '../../../../utils/PositionCalculation';

const r = 10 + 6;

class LineLayer extends React.Component {
  constructor(props) {
    super(props);
    this.cache = undefined;
    this.projectId = undefined;
    this.offsetCache = undefined;
  }

  shouldComponentUpdate() {
    // calculate influenced components.
    const newCache = this.props.model.connectFrom.length;
    const newProjectId = this.props.projectId;
    if (newProjectId !== this.projectId) {
      this.projectId = newProjectId;
      return true;
    } else if (!this.cache) {
      this.cache = newCache;
      return true;
    } else if (this.cache !== newCache) {
      this.cache = newCache;
      return true;
    } else if (!this.offsetCache || this.offsetCache !== this.props.offset) {
      this.offsetCache = this.props.offset;
      return true;
    }
    const { selection, model } = this.props;
    let included = false;
    for (const s of selection) {
      if (s.type === 'component') {
        if (s.id === model.id) {
          included = true;
          break;
        } else if (model.connectFrom.filter(l => l.component === s.id).length > 0) {
          included = true;
          break;
        }
      }
    }
    this.cache = newCache;
    return included;
  }

  handleLineClick(e, params) {
    e.preventDefault();
    this.props.dispatch({
      type: 'work_canvas/updateLineSelection',
      ...params,
    });
  }

  render() {
    return (
      <svg
        style={{ width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', pointerEvents: 'none' }}
        onClick={e => true}
      >
        {
          this.props.model.connectFrom.map(
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

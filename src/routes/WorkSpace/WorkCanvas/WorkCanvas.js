import React from 'react';
import {connect} from 'dva';
import { DraggableCore } from 'react-draggable';
import key from 'keymaster';
import NodeLayer from './NodeLayer';
import PointLayer from './PointLayer';
import LineLayer from './LineLayer';
import SelectionLayer from './SelectionLayer';
import ContextMenu from './ContextMenu';

class WorkCanvas extends React.PureComponent {

    constructor(props) {
        super(props)
        this.handleDrag = this.handleDrag.bind(this)
        this.handleDragStop = this.handleDragStop.bind(this)
        this.handleDragStart = this.handleDragStart.bind(this)
    }

    componentWillMount() {
        this.props.dispatch({
            type: 'work_canvas/init',
        })
    }

    handleDrag(e, draggableData) {
        // update selection rect.
        this.props.dispatch({
                type: 'work_canvas/dragCanvas',
                startX: e.offsetX,
                startY: e.offsetY,
                currentX: draggableData.deltaX,
                currentY: draggableData.deltaY,
        })
    }

    handleDragStop() {
        this.props.dispatch({
                type: 'work_canvas/canvasDragStop'
        })
    }

    handleDragStart() {
        this.props.dispatch({
                type: 'work_canvas/modeChange',
                isMoveMode: key.isPressed('space')
        })
    }


    render() {

        // 1. generate position reference table for the rest calculation.
        const componentDict = this.props.cache.componentDict; // store: componentid: {x, y}
        const componentPointPosition = this.props.cache.pointDict; // store: componentid: {pointid: {x, y}}
        // avoid first render. we need to wait for the cache ready.
        if (Object.keys(componentDict).length === 0) return null;

        let contextMenuView = null;
        if (this.props.contextmenu.show) {
            const {x, y, component} = this.props.contextmenu;
            contextMenuView =  <ContextMenu top={y} left={x}/>
        }

        return  <div style={{width: '100%', height: 'calc(100% - 64px)'}}>
        <DraggableCore onDrag={this.handleDrag} onStop={this.handleDragStop} onStart={this.handleDragStart}>
            <svg style={{width: '100%', height: '100%'}} className="work-canvas">
                {
                    /*1. node layer*/
                    this.props.components.map(
                        (component, i) => {
                            return <NodeLayer key={i} model={component} dispatch={this.props.dispatch}/>
                        }
                    )
                }
                {
                    /*2. line layer*/
                    this.props.components.map(
                        (component, i) => {
                            return <LineLayer key={i} model={component} dispatch={this.props.dispatch}
                                    positionDict = {componentPointPosition}/>
                        }
                    )
                }
                {
                    /*3. point layer*/
                    this.props.components.map(
                        (component, i) => {
                            return  <PointLayer key={i} model={component} dispatch={this.props.dispatch} 
                                    draggingTarget={this.props.draggingTarget} positionDict={componentPointPosition}/>
                                
                        }
                    )
                }
                {
                    /*4. selection layer*/
                    <SelectionLayer {...this.props} positionDict={componentPointPosition} componentDict = {componentDict}/>
                }
            </svg>
            </DraggableCore>
            {
                contextMenuView
            }
        </div>
    }

}


export default connect( ({work_canvas}) => work_canvas) (WorkCanvas);
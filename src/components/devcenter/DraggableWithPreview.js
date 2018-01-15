import React from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'dva';
import Draggable, {DraggableCore} from 'react-draggable';

class DraggableWithPreview extends React.Component {

    constructor(props) {
        super(props);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.state = {
            draggingView: undefined,
            dragging:{
                x: 0,
                y: 0
            }
        }
    }

    handleDrag(e, draggableData) {
        console.log(e, draggableData)
        this.setState({draggingView: true, 
            dragging:{
                x: draggableData.x,
                y: draggableData.y
            }});
    }

    handleStop(e, draggableData) {
        this.setState({
            draggingView: undefined,
            dragging:{
                x: 0,
                y: 0
            }
        })
        console.log(ReactDOM.findDOMNode(this.props.dragTarget));
    }

    render() {
        let child = React.Children.only(this.props.children)
        let preview = null
        if (this.state.draggingView !== undefined) {
            let translate = `translate(${this.state.dragging.x}px,${this.state.dragging.y}px)`;;
            console.log("",{style: {...child.props.style, ...{transform: translate} }});
            // preview = React.cloneElement(child, {style: {...child.props.style, ...{transform: translate} }})
            preview = React.cloneElement(child, {style: {...child.props.style, ...{position:'absolute', 
            left:this.state.dragging.x+'px', top: this.state.dragging.y+'px'} }})
        }
        return (
            <React.Fragment>
                <DraggableCore onDrag={this.handleDrag} onStop={this.handleStop}>
                    {child}    
                </DraggableCore>
                {preview}
            </React.Fragment>)
    }
}

export default DraggableWithPreview;
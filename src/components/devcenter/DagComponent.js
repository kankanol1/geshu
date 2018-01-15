import React from 'react'
import { DraggableCore } from 'react-draggable';

const styles = {
    fill:'#722ed1', stroke:'#22075e', strokeWidth:1, opacity:1, cursor: 'move'
}

class DagComponent extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            model: {
                name: 'input node',
                type: 'source',
                output: 1,
                input: 0,
            },
            x: 100,
            y: 300,
            width: 100,
            height: 40,
            rx: 10,
            ry: 10,
            connect: {
                desX: 100,
                desY: 300,
            }
        }
        this.handleDrag = this.handleDrag.bind(this)
        this.handleDragStop = this.handleDragStop.bind(this)
    }

    handleDragStop(e, draggableData) {
        this.setState({
            connect: {
                desX: this.state.x,
                desY: this.state.y
            }
        })
    }

    handleDrag(e, draggableData){
        console.log(e)
        console.log(draggableData)
        switch (draggableData.node.tagName){
            case "circle":
            console.log("circle")
            this.setState({
                connect: {
                    desX: this.state.connect.desX + draggableData.deltaX,
                    desY: this.state.connect.desY + draggableData.deltaY
                }
            })
            break;
            case "rect":
            console.log("rect")
            this.setState({
                x: this.state.x + draggableData.deltaX,
                y: this.state.y + draggableData.deltaY,
                connect: {
                    desX: this.state.x + draggableData.deltaX,
                    desY: this.state.y + draggableData.deltaY
                }
            })
            break;
            default:
            console.log("unknown type")
        }
    }

    calculateLineStr(srcX, srcY, desX, desY){
        const stepMax = 10;
        let str = null;
        str= `${srcX}, ${srcY} ${desX}, ${desY}`;
        
        console.log(str);
        return str;
    }

    render(){
        const {x, y, width, height, rx, ry} = this.state;
        const {output, input} = this.state.model;
        const {desX, desY} = this.state.connect;

        let line = null;
        if (desX !== x && desY !== y) {
            line = 
            <polyline points={this.calculateLineStr(x, y + height/2, desX, desY + height/2)}
  style={{fill:'none',stroke:'#391085',strokeWidth:1}} />
        }

        return <React.Fragment>
            <DraggableCore onDrag={this.handleDrag}>
                <rect x={x} y={y} rx={rx} ry={ry} width={width} height={height}
                    style={{...styles}} />
            </DraggableCore>
            <DraggableCore onDrag={this.handleDrag} onStop={this.handleDragStop}>
                <circle cx={x} cy={y + height/2} r="4" stroke="#22075e" strokeWidth="1" fill="#b37feb" />
            </DraggableCore>
            {line}
            </React.Fragment>
    }

}

export default DagComponent;
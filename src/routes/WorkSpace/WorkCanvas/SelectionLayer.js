import React from 'react';
import {calculateLineStr} from '../../../utils/PositionCalculation'

const selectionStyles = {
    fill:'#fff', stroke:'#22075e', strokeWidth:1, opacity:1, cursor: 'move'
}

const maskStyles = {
        fill:'#000', stroke:'#22075e', strokeWidth:1, opacity:0.3,
}


/**
 * this class renders selections and real-time changes. on the topest leve.
 */
class SelectionLayer extends React.PureComponent {


    render() {
        const {dragging, draggingComponent, draggingSource, draggingTarget} = this.props

        let draggingView = null;

        if (dragging) {
            draggingView = <polyline points={calculateLineStr( draggingSource.x, 
                draggingSource.y, draggingTarget.x, draggingTarget.y)}
                style={{fill:'none',stroke:'#391085',strokeWidth:1}} />
        }

        let selectionView = null;
        if (this.props.mode === 'select') {
            // find selection.
            selectionView =  this.props.selection.map(
                (select, i) => {
                    if (select.type === 'component') {
                        const{x, y, width, height} = this.props.componentDict[select.id];
                        // render selection.
                        const size = 4;
                        return  <React.Fragment key={i}>
                                <rect x={x-size} y={y-size} width={size *2} height={size*2} 
                                    style={{...selectionStyles}}/>
                                <rect x={x+width-size} y={y-size} width={size *2} height={size*2} 
                                    style={{...selectionStyles}}/>
                                <rect x={x-size} y={y+height-size} width={size *2} height={size*2} 
                                style={{...selectionStyles}}/>
                                <rect x={x+width-size} y={y+height-size} width={size *2} height={size*2} 
                                style={{...selectionStyles}}/>
                            </React.Fragment>
                    }  else if (select.type === 'line') {
                        const size = 6;
                        const from_point = this.props.positionDict[select.source][select.from];
                        const to_point = this.props.positionDict[select.target][select.to];
                        return <React.Fragment key = {i}>
                        <rect x={from_point.x-size} y={from_point.y-size} width={size *2} height={size*2} 
                            style={{...selectionStyles}}/>
                            
                        <rect x={to_point.x-size} y={to_point.y-size} width={size *2} height={size*2} 
                            style={{...selectionStyles}}/>
                    </React.Fragment>
                    }
                }
            )
        }
        
        // dragging rect.
        let draggingRectView = null;
        const { startX, startY, stopX, stopY} = this.props.runtime;
        if (this.props.runtime.dragging) {
            draggingRectView = <rect x={startX < stopX ? startX : stopX} y = {startY < stopY? startY: stopY} 
                                width={Math.abs(stopX - startX)} height={Math.abs(stopY - startY)} style={{...maskStyles}}/>
        }

        return <React.Fragment>
            {selectionView}
            {draggingView}
            {draggingRectView}
            </React.Fragment>
    }

}

export default SelectionLayer;
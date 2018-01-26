const calculatePointCenter = (x, y, width, height, xIndex, yIndex) => {
    let p_x = 0, p_y = 0;
    switch (xIndex) {
        case 0:
            /*top*/
            p_x = x + yIndex * width
            p_y = y
            break
        case 1: 
            /*right*/
            p_x = x + width
            p_y = y +height * yIndex
            break;
        case 2:
            /**bottom */
            p_x = x + height * yIndex
            p_y = y
            break;
        case 3:
            /**left */
            p_x = x
            p_y = y + height * yIndex
            break;
        default:
            break;
    }
    return {p_x, p_y}
}


const calculateLineStrDirectly = (srcX, srcY, desX, desY) => {
    return `${srcX}, ${srcY} ${desX}, ${desY}`;
}

const calculateLineStrStraightly = (srcX, srcY, desX, desY) => {
    let str = `${srcX}, ${srcY}`;
    //suppose src from the right side of the box[].
    // des from the left side of the box[].

    // 1. move x.
    let currentX = srcX, currentY = srcY;
    if (desX > srcX) {
        currentX += (desX - srcX) / 2;
        str += ` ${currentX},${currentY} `;
        //2. move y.
        currentY = desY;
        str += ` ${currentX},${currentY} `;
        //3. finally
    } else {
        // add more angle.
        currentX += 30;
        str += ` ${currentX},${currentY} `;
        //2. move y.
        currentY = (srcY + desY) / 2;
        str += ` ${currentX},${currentY} `;
        //3. add to desX -30
        currentX = desX - 30;
        str += ` ${currentX},${currentY} `;
        //4. move y.
        currentY = desY;
        str += ` ${currentX},${currentY} `;
        //5. finally.->
    }
    str +=  ` ${desX}, ${desY}`;
    console.log('str,',str);
    return str;
}

const calculateLineStr = (srcX, srcY, desX, desY) => {
    // return calculateLineStrDirectly(srcX, srcY, desX, desY);
    return calculateLineStrStraightly(srcX, srcY, desX, desY);
}

const updateCache = (state) => {
    const componentDict = {} // store: componentid: {x, y}
        const componentPointPosition = {} // store: componentid: {pointid: {x, y}}
    state.components.forEach(
        (component) => {
            componentDict[component.id] = {x: component.x, y: component.y, 
                height: component.height, width: component.width};
            let pointDict = {}
            const {x, y, width, height} = component;
            component.points.forEach(
                (point) => {
                    const {p_x, p_y} = calculatePointCenter(x, y, width, height, point.x, point.y)
                    pointDict[point.id] = {x: p_x, y: p_y};
                }
            )
            componentPointPosition[component.id] = pointDict
            
        }
    )
    let a = Object.assign({}, {...state, ...{cache: 
        {componentDict: componentDict,  
        pointDict: componentPointPosition}}}
    )
    console.log('init-r:', a.cache)
    return a;
}

export {calculatePointCenter, calculateLineStr, updateCache}
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

export {calculatePointCenter}
const calculatePointCenter = (x, y, width, height, xIndex, yIndex) => {
  let px = 0;
  let py = 0;
  switch (xIndex) {
    case 0:
      // top
      px = x + (yIndex * width);
      py = y;
      break;
    case 1:
      // right
      px = x + width;
      py = y + (height * yIndex);
      break;
    case 2:
      // bottom
      px = x + (height * yIndex);
      py = y;
      break;
    case 3:
      // left
      px = x;
      py = y + (height * yIndex);
      break;
    default:
      break;
  }
  return { px, py };
};

const calculateLineStrDirectly = (srcX, srcY, desX, desY) => {
  return `${srcX}, ${srcY} ${desX}, ${desY}`;
};

const calculateLineStrStraightly = (srcX, srcY, desX, desY) => {
  let str = `${srcX}, ${srcY}`;
  // suppose src from the right side of the box[].
  // des from the left side of the box[].

  // 1. move x.
  let currentX = srcX;
  let currentY = srcY;
  if (desX > srcX) {
    currentX += (desX - srcX) / 2;
    str += ` ${currentX},${currentY} `;
    // 2. move y.
    currentY = desY;
    str += ` ${currentX},${currentY} `;
    // 3. finally
  } else {
    // add more angle.
    currentX += 30;
    str += ` ${currentX},${currentY} `;
    // 2. move y.
    currentY = (srcY + desY) / 2;
    str += ` ${currentX},${currentY} `;
    // 3. add to desX -30
    currentX = desX - 30;
    str += ` ${currentX},${currentY} `;
    // 4. move y.
    currentY = desY;
    str += ` ${currentX},${currentY} `;
    // 5. finally.->
  }
  str += ` ${desX}, ${desY}`;
  return str;
};

const calculateLineStr = (srcX, srcY, desX, desY) => {
  return calculateLineStrDirectly(srcX, srcY, desX, desY);
  // return calculateLineStrStraightly(srcX, srcY, desX, desY);
};

const calculatePointPositionDict = (component) => {
  const pointDict = {};
  const { x, y, width, height } = component;
  const calculatePoint = (point) => {
    const { px, py } = calculatePointCenter(x, y, width, height, point.x, point.y);
    pointDict[point.id] = { x: px, y: py };
  };
  component.inputs.forEach(
    (point) => { calculatePoint(point); }
  );
  component.outputs.forEach(
    (point) => { calculatePoint(point); }
  );
  return pointDict;
};

const updateCache = (state) => {
  const componentDict = {}; // store: componentid: {x, y}
  const componentPointPosition = {}; // store: componentid: {pointid: {x, y}}
  const { offset } = state;
  state.components.forEach(
    (component) => {
      const calculatedPosition = {
        x: component.x + offset.x,
        y: component.y + offset.y,
        height: component.height,
        width: component.width,
      };
      componentDict[component.id] = calculatedPosition;
      componentPointPosition[component.id] =
        calculatePointPositionDict({ ...component, ...calculatedPosition });
    }
  );
  return Object.assign({}, { ...state,
    ...{ cache:
      { componentDict,
        pointDict: componentPointPosition,
      },
    } });
};

const fillDefaultSize = (component) => {
  return Object.assign({}, { ...component,
    ...{
      x: 10,
      y: 0,
      width: 120,
      height: 120,
    } });
};

export {
  calculatePointCenter,
  calculateLineStr,
  updateCache,
  calculatePointPositionDict,
  fillDefaultSize,
};

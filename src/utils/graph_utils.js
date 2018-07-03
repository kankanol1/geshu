import iconSvg from './gojs/icons';

const { go } = window;

const $ = go.GraphObject.make;
const util = {
  shapes: [
    { text: '', figure: 'Ellipse', color: '#ffffff', stroke: '#000000' },
    { text: '', figure: 'Rectangle', color: '#ffffff', stroke: '#000000' },
    // { text: '', figure: 'Diamond', color: '#ffffff', stroke: '#000000' },
    // { text: '', figure: 'Triangle', color: '#ffffff', stroke: '#000000' },
  ],
};

/**
 *
 * @param palletContainer
 * @param graphContainer
 */
util.init = (palletContainer, graphContainer) => {
  const myDiagram =
    $(go.Diagram, graphContainer,
      {
        initialContentAlignment: go.Spot.Center,
        allowDrop: true,
        allowClipboard: false,
        allowCopy: false,
        allowUndo: false,
      });

  myDiagram.nodeTemplate =
    $(go.Node, 'Auto',
      new go.Binding('location', 'loc',
        (loc) => {
          return loc;
        })
        .makeTwoWay((loc) => {
          return loc;
        }),
      {
        locationSpot: go.Spot.Center,
        resizable: true,
      },
      $(go.Shape, 'RoundedRectangle',
        {
          name: 'theShapeName',
          fill: 'white',
          minSize: new go.Size(50, 50),
          portId: '',
          cursor: 'pointer',
          fromLinkable: true,
          fromLinkableSelfNode: true,
          fromLinkableDuplicates: true,
          toLinkable: true,
          toLinkableSelfNode: true,
          toLinkableDuplicates: true,
        },
        new go.Binding('figure', 'figure'),
        new go.Binding('stroke', 'stroke'),
        new go.Binding('fill', 'color')),
      $(go.TextBlock,
        {
          font: 'bold 14px sans-serif',
          stroke: '#333',
          margin: 6,
          editable: true,
        },
        new go.Binding('text', 'text').makeTwoWay(),
        new go.Binding('stroke', 'stroke'))

    );
  myDiagram.linkTemplate =
    $(go.Link,
      {
        routing: go.Link.Normal,
        curve: go.Link.Bezier,
        // curve: go.Link.JumpOver,
        reshapable: true,
        relinkableFrom: true,
        relinkableTo: true,
        // resegmentable: true,
      },
      new go.Binding('curviness', 'curviness').makeTwoWay(),
      $(go.Shape, { strokeWidth: 1.5 }),
      $(go.Shape, { toArrow: 'standard', stroke: null }),
      $(go.Panel, 'Auto',
        $(go.Shape,
          {
            fill: $(go.Brush, 'Radial',
              { 0: 'rgb(255, 255, 255)', 0.3: 'rgb(255, 255, 255)', 1: 'rgba(255, 255, 255, 0)' }),
            stroke: null,
          }),
        $(go.TextBlock, 'link type',
          {
            textAlign: 'center',
            font: '10pt helvetica, arial, sans-serif',
            stroke: 'black',
            margin: 4,
            editable: true,
          },
          new go.Binding('text', 'text').makeTwoWay())
      )
    );
  $(go.Palette, palletContainer, // must name or refer to the DIV HTML element
    {
      scrollsPageOnFocus: false,
      nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
      model: new go.GraphLinksModel(util.shapes),
    });
  return myDiagram;
};

const buildMappingData = (graphJson) => {
  const { nodeDataArray, linkDataArray } = JSON.parse(graphJson);
  const modalData = [[...nodeDataArray], []];
  const key2Node = {};
  for (const i in nodeDataArray) {
    if (nodeDataArray[i].key) { key2Node[nodeDataArray[i].key] = nodeDataArray[i]; }
  }
  for (const i in linkDataArray) {
    if (key2Node[linkDataArray[i].from] && key2Node[linkDataArray[i].to]) {
      modalData[0].push({
        ...linkDataArray[i],
        key: `temp${i}`,
        stroke: '#ffffff',
        margin: 0,
        originType: 'link',
      });
      modalData[1].push({
        from: linkDataArray[i].from,
        to: `temp${i}`,
        category: 'readOnly',
      });
      modalData[1].push({
        from: `temp${i}`,
        to: linkDataArray[i].to,
        category: 'readOnly',
      });
    }
  }
  return modalData;
};

const geoFunc = (geoname) => {
  let geo = iconSvg[geoname];
  if (geo === undefined) geo = 'heart'; // use this for an unknown icon name
  geo = go.Geometry.parse(geo, true); // fill each geometry
  return geo;
};

util.initMappingDiagram = (graphContainer, graphJson, needTransfer) => {
  const layout = $(go.ForceDirectedLayout, { randomNumberGenerator: null });
  const myDiagram =
  $(go.Diagram, graphContainer,
    {
      initialContentAlignment: go.Spot.Center,
      allowDrop: true,
      allowClipboard: false,
      allowCopy: false,
      allowUndo: false,
      layout,
    });
  myDiagram.nodeTemplate =
    $(go.Node, 'Auto',
      { deletable: false },
      $(go.Shape, 'RoundedRectangle',
        {
          name: 'theShapeName',
          fill: 'white',
          portId: '',
          cursor: 'pointer',
          fromLinkable: false,
          fromLinkableSelfNode: false,
          fromLinkableDuplicates: false,
          toLinkable: true,
          toLinkableSelfNode: true,
          toLinkableDuplicates: true,
        },
        new go.Binding('figure', 'figure'),
        new go.Binding('stroke', 'stroke'),
        new go.Binding('fill', 'color')),
      $(go.TextBlock,
        {
          font: 'bold 14px sans-serif',
          stroke: '#333',
          margin: 6,
          editable: false,
        },
        new go.Binding('text', 'text').makeTwoWay(),
        new go.Binding('margin', 'margin').makeTwoWay(),
      )
    );
  myDiagram.nodeTemplateMap.add('file',
    $(go.Node, 'Spot',
      { deletable: true },
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, 'Circle',
        {
          name: 'theShapeName',
          fill: '#1890ff',
          stroke: null,
          width: 60,
          height: 60,
          portId: '',
          cursor: 'pointer',
          fromLinkable: true,
        },
      ),
      $(go.Shape,
        { margin: 3, fill: 'white', strokeWidth: 0 },
        new go.Binding('geometry', 'geo', geoFunc)),
      $(go.TextBlock,
        {
          font: '10pt Verdana, sans-serif',
          alignment: go.Spot.TopCenter,
          alignmentFocus: go.Spot.BottomCenter,
          editable: false,
        },
        new go.Binding('text')
      )
    )
  );
  myDiagram.linkTemplate =
    $(go.Link,
      {
        toShortLength: 8,
        curve: go.Link.Bezier,
      },
      $(go.Shape,
        { stroke: 'grey', strokeWidth: 2 }),
      $(go.Shape,
        {
          fill: 'grey',
          stroke: null,
          toArrow: 'Standard',
          scale: 2.5,
        })
    );
  myDiagram.linkTemplateMap.add('readOnly',
    $(go.Link,
      {
        deletable: false,
        routing: go.Link.Normal,
        curve: go.Link.Bezier,
        reshapable: true,
        relinkableFrom: true,
        relinkableTo: true,
      },
      new go.Binding('curviness', 'curviness').makeTwoWay(),
      $(go.Shape, { strokeWidth: 1.5 }),
      $(go.Shape, { toArrow: 'standard', stroke: null }),
    ));
  myDiagram.model = needTransfer ?
    new go.GraphLinksModel(...buildMappingData(graphJson)) :
    go.Model.fromJson(graphJson);
  return myDiagram;
};
util.addFileNode = (diagram, fileData) => {
  diagram.startTransaction('addFileNode');
  for (const i in fileData) {
    if (!diagram.model.findNodeDataForKey(fileData[i].id)) {
      diagram.model.addNodeData(
        {
          ...fileData[i],
          category: 'file',
          geo: 'file',
          text: fileData[i].name,
          key: fileData[i].id,
        });
    }
  }
  diagram.commitTransaction('addFileNode');
  diagram.zoomToFit();
};

util.toJson = (diagram) => {
  return diagram.model.toJson();
};
util.fromJson = (diagram, json) => {
  // eslint-disable-next-line
  diagram.model = go.Model.fromJson(json);
};
util.isNode = (graphObject) => {
  return graphObject instanceof go.Node;
};
util.isLink = (graphObject) => {
  return graphObject instanceof go.Link;
};
util.getNodeProps = (diagram, key) => {
  const propsArr = [];
  if (!key) {
    for (const i in diagram.model.nodeDataArray) {
      if (diagram.model.nodeDataArray[i].attrList) {
        for (const j in diagram.model.nodeDataArray[i].attrList) {
          if (diagram.model.nodeDataArray[i].attrList[j].name
          && propsArr.indexOf(diagram.model.nodeDataArray[i].attrList[j].name) < 0) {
            propsArr.push(diagram.model.nodeDataArray[i].attrList[j].name);
          }
        }
      }
    }
  } else {
    const node = diagram.findNodeForKey(key);
    if (node.data && node.data.attrList) {
      for (const i in node.data.attrList) {
        if (propsArr.indexOf(node.data.attrList[i].name) < 0) {
          propsArr.push(node.data.attrList[i].name);
        }
      }
    }
  }
  return propsArr;
};
util.getLinkProps = (diagram) => {
  const propsArr = [];
  for (const i in diagram.model.linkDataArray) {
    if (diagram.model.linkDataArray[i].attrList) {
      for (const j in diagram.model.linkDataArray[i].attrList) {
        if (diagram.model.linkDataArray[i].attrList[j].name
          && propsArr.indexOf(diagram.model.linkDataArray[i].attrList[j].name) < 0) {
          propsArr.push(diagram.model.linkDataArray[i].attrList[j].name);
        }
      }
    }
  }
  return propsArr;
};
util.removeDataOfCategory = (diagram, type, category) => {
  const data2Remove = [];
  const dataArr = diagram.model[`${type}DataArray`];
  for (const i in dataArr) {
    if (dataArr[i].category === category) {
      data2Remove.push(dataArr[i]);
    }
  }
  if (type === 'node') { diagram.model.removeNodeDataCollection(data2Remove); } else { diagram.model.removeLinkDataCollection(data2Remove); }
};
util.allNodes = (diagram) => {
  return diagram.model.nodeDataArray;
};
util.allLinks = (diagram) => {
  return diagram.model.linkDataArray;
};
util.clear = (diagram) => {
  diagram.clear();
};

const name2Diagram = {};
util.registerDiagram = (name, diagram) => {
  name2Diagram[name] = diagram;
};
util.getDiagram = (name) => {
  return name2Diagram[name];
};

export default util;

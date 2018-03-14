import go from './go';

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
        new go.Binding('text', 'text').makeTwoWay())
    );

  myDiagram.linkTemplate =
    $(go.Link,
      {
        routing: go.Link.AvoidsNodes,
        // curve: go.Link.Bezier,
        curve: go.Link.JumpOver,
        reshapable: true,
        relinkableFrom: true,
        relinkableTo: true,
        resegmentable: true,
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

  $(go.Palette, palletContainer,
    {
      scrollsPageOnFocus: false,
      nodeTemplateMap: myDiagram.nodeTemplateMap,
      model: new go.GraphLinksModel(util.shapes),
    });
  return myDiagram;
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
util.getNodeProps = (diagram) => {
  const propsArr = [];
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
export default util;
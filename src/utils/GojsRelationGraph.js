
const { go } = window;
const $ = go.GraphObject.make;

class GojsRelationGraph {
  constructor() {
    this.options = {};
    this.pallet = ['#c12e34', '#e6b600', '#0098d9', '#2b821d', '#005eaa', '#339ca8'];
    this.label2Color = {};
    this.labelCount = 0;
  }
    create=(options) => {
      this.options = { ...options };
      const layout = $(go.ForceDirectedLayout, { randomNumberGenerator: null });
      const toolTipTemplate =
      $(go.Adornment, 'Auto',
        $(go.Shape, 'RoundedRectangle',
          {
            name: 'SHAPE',
            fill: $(go.Brush, 'Linear', { 0: 'rgb(125, 125, 125)', 0.5: 'rgb(86, 86, 86)', 1: 'rgb(86, 86, 86)' }),
            stroke: 'black',
            portId: '',
            fromLinkable: true,
            toLinkable: true,
            cursor: 'pointer',
          }),
        $(go.TextBlock,
          {
            font: '9pt sans-serif',
            stroke: 'white',
          },
          new go.Binding('text', '', (d) => {
            const text = [
              `ID: ${d.id}`,
              `Label: ${d.label}`,
            ];

            for (const name in d.properties) {
              if (Array.isArray(d.properties[name])) {
                const propStr = [];
                d.properties[name].forEach((value) => {
                  propStr.push(value.value);
                });
                text.push(`${name}: ${propStr.join(',')}`);
              } else {
                text.push(`${name}: ${d.properties[name].value}`);
              }
            }
            return text.join('\n');
          })),

      );
      const myDiagram =
        $(go.Diagram, options.container,
          {
            initialContentAlignment: go.Spot.Center,
            layout,
            'toolManager.hoverDelay': 100,
          });
      myDiagram.nodeTemplate =
        $(go.Node, 'Auto',
          {
            deletable: false,
            toolTip: toolTipTemplate,
          },
          $(go.Shape, 'Circle',
            {
              fill: 'white',
              minSize: new go.Size(15, 15),
              portId: '',
              cursor: 'pointer',
              fromLinkable: false,
              fromLinkableSelfNode: false,
              fromLinkableDuplicates: false,
              toLinkable: false,
              toLinkableSelfNode: false,
              toLinkableDuplicates: false,
            },
            new go.Binding('fill', 'fill')),
          $(go.TextBlock,
            {
              font: 'bold 14px sans-serif',
              stroke: '#333',
              margin: 6,
              editable: false,
            },
            new go.Binding('text', 'text').makeTwoWay())
        );
      myDiagram.linkTemplate =
        $(go.Link,
          {
            toolTip: toolTipTemplate,
            routing: go.Link.Normal,
            curve: go.Link.Bezier,
            // curve: go.Link.JumpOver,
            reshapable: true,
            relinkableFrom: false,
            relinkableTo: false,
            deletable: false,
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
            $(go.TextBlock,
              {
                textAlign: 'center',
                font: '10pt helvetica, arial, sans-serif',
                stroke: 'black',
                margin: 4,
                editable: false,
              },
              new go.Binding('text', 'text').makeTwoWay())
          )
        );
      myDiagram.addDiagramListener('ObjectDoubleClicked', () => {
        if (myDiagram.selection.count === 1) {
          const currentObject = myDiagram.selection.first();
          if (currentObject instanceof go.Node) {
            if (this.options.dblClick) { this.options.dblClick(currentObject); }
          }
        }
      });
      myDiagram.model.linkKeyProperty = 'key';
      this.diagram = myDiagram;
    };
    mergeData= (data) => {
      const { diagram, label2Color, pallet } = this;
      diagram.startTransaction('mergeData');
      data[0].forEach((node) => {
        if (!label2Color[node.label]) {
          label2Color[node.label] = pallet[this.labelCount];
          this.labelCount++;
        }
        if (!diagram.model.findNodeDataForKey(node.id)) {
          diagram.model.addNodeData(
            {
              ...node,
              text: node.properties.name ? node.properties.name[0].value : '',
              key: node.id,
              fill: label2Color[node.label],
            });
        }
      });
      data[1].forEach((link) => {
        if (!diagram.model.findLinkDataForKey(link.id)) {
          diagram.model.addLinkData(
            {
              ...link,
              text: link.label,
              key: link.id,
              from: link.outV,
              to: link.inV,
            });
        }
      });
      diagram.commitTransaction('mergeData');
      diagram.zoomToFit();
    };
    clear=() => {
      this.diagram.clear();
    }
}
const name2Graph = {};
GojsRelationGraph.register = (name, graph) => {
  name2Graph[name] = graph;
};
GojsRelationGraph.getGraph = (name) => {
  return name2Graph[name];
};
export default GojsRelationGraph;

import './gojs/go';

const { go } = window;
const $ = go.GraphObject.make;
export default class GojsRelationGraph {
  constructor() {
    this.options = {};
    this.pallet = ['#c12e34', '#e6b600', '#0098d9', '#2b821d', '#005eaa', '#339ca8'];
    this.label2Color = {};
    this.labelCount = 0;
  }
    create=({ container }) => {
      const layout = $(go.ForceDirectedLayout, { randomNumberGenerator: null });
      const toolTipTemplate =
      $(go.Adornment, 'Auto',
        $(go.Shape, { fill: '#F2F2F2' }),
        $(go.TextBlock, { margin: 4 },
          new go.Binding('text', '', ((d) => {
            return `id: ${d.key}
                    label: ${d.label}
                    `;
          })))
      );
      const myDiagram =
        $(go.Diagram, container,
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
      this.diagram = myDiagram;
    };
    mergeData= (data) => {
      const { diagram, label2Color, pallet } = this;
      const data2Add = [[], []];
      data[0].forEach((node) => {
        if (!label2Color[node.label]) {
          label2Color[node.label] = pallet[this.labelCount];
          this.labelCount++;
        }
        if (!diagram.model.findNodeDataForKey(node.id)) {
          data2Add[0].push({
            ...node,
            text: node.properties.name ? node.properties.name[0].value : '',
            key: node.id,
            fill: label2Color[node.label],
          });
        }
      });
      data[1].forEach((link) => {
        if (!diagram.model.findLinkDataForKey(link.id)) {
          data2Add[1].push({
            ...link,
            text: link.label,
            key: link.id,
            from: link.outV,
            to: link.inV,
          });
        }
      });
      console.log(data2Add);
      diagram.model = new go.GraphLinksModel(...data2Add);
    };
    clear=() => {
      this.diagram.clear();
    }
}

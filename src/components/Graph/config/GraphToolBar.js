import React from 'react';
import { Icon } from 'antd';
import GraphUtils from '../../../../utils/graph_utils';

function operationsBeforeOnclick(graph, stopFlow, unHighlight, unGroupAll) {
  graph.applicationOperations(() => {
    if (stopFlow) { graph.stopFlow(); }
    if (unHighlight) { graph.unHighlightNeighbors(); }
    if (unGroupAll) { graph.unGroupAll(); }
  });
}
const toolbarConfig = [
  {
    name: 'customized',
    display: '定制工具',
    tools: [
      {
        name: 'personRels',
        display: '人员关系',
        icon: <Icon type="team" />,
        onclick: (dispatch, graph) => {
          operationsBeforeOnclick(graph, true, true, true);
          graph.doDrawGraph([(node) => {
            return node.type && node.type === 'Person';
          }], []);
          return defaultButtonStatus;
        },
      },
      {
        name: 'transactionRels',
        display: '交易关系',
        icon: <Icon type="bank" />,
        onclick: (dispatch, graph) => {
          operationsBeforeOnclick(graph, true, true, true);
          graph.doDrawGraph([(node) => {
            return node.type && node.type === 'Account';
          }], []);
          return defaultButtonStatus;
        },
      },
      {
        name: 'groupByPersonAccouts',
        display: '按账号持有者分组',
        icon: <Icon type="tags-o" />,
        onclick: (dispatch, graph) => {
          operationsBeforeOnclick(graph, true, true, true);
          graph.doGroupBy((id2Node) => {
            const name2Group = {};
            for (const nodeId in id2Node) {
              if (id2Node[nodeId].type === 'Account' && id2Node[nodeId].propertyList) {
                id2Node[nodeId].propertyList.forEach((property) => {
                  if (property.key === 'customer_name') {
                    if (!name2Group[property.value]) { name2Group[property.value] = []; }
                    name2Group[property.value].push(nodeId);
                  }
                });
              }
            }
            const groups = [];
            for (const name in name2Group) {
              if (name2Group[name].length > 0) {
                groups.push({
                  name: `${name}账号`,
                  nodeIds: name2Group[name],
                  expand: false,
                });
              }
            }
            return groups;
          });
          return defaultButtonStatus;
        },
      },
      {
        name: 'filter',
        display: '图上筛选',
        icon: <Icon type="filter" />,
        onclick: (dispatch, graph) => {
          dispatch({
            type: 'graph_operations/toggleFilterModal',
            payload: true,
          });
        },
      },
    ],
  },
  {
    name: 'flow',
    display: '流动',
    tools: [
      {
        name: 'doFlow',
        display: '关系流动',
        icon: <Icon type="retweet" />,
        onclick: (dispatch, graph) => {
          graph.doFlow();
          return { enable: ['stopFlow'], disable: ['doFlow'] };
        },
      },
      {
        name: 'stopFlow',
        display: '停止流动',
        defaultDisable: true,
        icon: <Icon type="pause" />,
        onclick: (dispatch, graph) => {
          graph.stopFlow();
          return { enable: ['doFlow'], disable: ['stopFlow'] };
        },
      },
    ],
  },
  {
    name: 'highlight',
    display: '高亮',
    tools: [
      {
        name: 'doHighlight',
        display: '高亮选中节点及相关关系',
        icon: <Icon type="star" />,
        onclick: (dispatch, graph) => {
          const { iterator } = graph.diagram.selection;
          const selectedNodeIds = [];
          iterator.each((item) => {
            if (GraphUtils.isNode(item)) { selectedNodeIds.push(item.data.key); }
          });
          graph.doHighlightNeighbors(selectedNodeIds);
          return { enable: ['unhighlight'], disable: ['doHighlight'] };
        },
      },
      {
        name: 'unhighlight',
        display: '取消高亮',
        defaultDisable: true,
        icon: <Icon type="star-o" />,
        onclick: (dispatch, graph) => {
          graph.unHighlightNeighbors();
          return { enable: ['doHighlight'], disable: ['unhighlight'] };
        },
      },
    ],
  },
  {
    name: 'layouts',
    display: '布局',
    tools: [
      {
        name: 'forceLayout',
        display: '树形布局',
        icon: <Icon type="share-alt" />,
        onclick: (dispatch, graph) => {
          graph.doTreeLayout();
        },
      },
      {
        name: 'treeLayout',
        display: '星形布局',
        icon: <Icon type="api" />,
        onclick: (dispatch, graph) => {
          graph.doForceLayout();
        },
      },
    ],
  },
  {
    name: 'operations',
    display: '操作',
    tools: [
      {
        name: 'setLabel',
        display: '设置元素名称',
        icon: <Icon type="hourglass" />,
        onclick: (dispatch, graph) => {
          dispatch({
            type: 'graph_operations/toggleSetTitleModal',
            payload: true,
          });
        },
      },
      {
        name: 'reset',
        display: '重置视图',
        icon: <Icon type="reload" />,
        onclick: (dispatch, graph) => {
          graph.doReset();
          return defaultButtonStatus;
        },
      },
      {
        name: 'undo',
        display: '撤销操作',
        icon: <Icon type="rollback" />,
        onclick: (dispatch, graph) => {
          graph.goBackward();
        },
      },
    ],
  },
  {
    name: 'grouper',
    display: '分组',
    tools: [
      {
        name: 'group',
        display: '将选中节点分为一组',
        icon: <Icon type="paper-clip" />,
        onclick: (dispatch, graph) => {
          const { iterator } =
          graph.diagram.selection;
          const selectedNodeIds = [];
          let group;
          let isSubGroup = true;
          while (iterator.next()) {
            const item = iterator.value;
            if (GraphUtils.isNode(item) && !GraphUtils.isGroup(item)) {
              selectedNodeIds.push(item.data.key);
              if (group && item.data.group && item.data.group !== group) {
                isSubGroup = false;
              }
               group = item.data.group;//eslint-disable-line
            }
          }
          if (selectedNodeIds.length > 0) {
            graph.doAddGroup(selectedNodeIds, undefined, '', true);
          }
        },
      },
      {
        name: 'ungroup',
        display: '删除选中分组',
        icon: <Icon type="disconnect" />,
        onclick: (dispatch, graph) => {
          graph.doUnGroup();
        },
      },
    ],
  },
];
const defaultButtonStatus = { enable: ['doFlow', 'doHighlight'], disable: ['stopFlow', 'unHighlight'] };
export default toolbarConfig;

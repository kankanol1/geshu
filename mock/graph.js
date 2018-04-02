import moment from 'moment';
import { getUrlParams } from './utils';


export function recentGraph(req, res) {
  const result = [];
  for (let i = 0; i < 10; i++) {
    result.push({
      name: `图数据库 ${i}`,
      key: i,
      id: i,
      createdAt: moment(`2018-01-0${Math.floor(i / 3) + 1}`, 'YYYY-MM-DD'),
      updatedAt: moment(`2018-02-0${Math.floor(i / 3) + 1}`, 'YYYY-MM-DD'),
    });
  }
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function saveGraph(req, res) {
  const result = {
    success: true,
    message: '保存成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getGraph(req, res) {
  const result = {
    success: true,
    data: {
      frontendJson: '{ "class": "go.GraphLinksModel",  "nodeDataArray": [ {"text":"node1", "figure":"Ellipse", "color":"#ffffff", "stroke":"#000000", "key":-1, "loc":{"class":"go.Point", "x":-96.25, "y":-60}, "attrList":[ {"name":"attr1", "type":"String", "cardinality":"SINGLE"},{"name":"attr2", "type":"String", "cardinality":"SINGLE"} ]},{"text":"node2", "figure":"Rectangle", "color":"#ffffff", "stroke":"#000000", "key":-2, "loc":{"class":"go.Point", "x":109.75, "y":-8.999999999999993}, "attrList":[ {"name":"attr5", "type":"String", "cardinality":"SINGLE"} ]},{"text":"node3", "figure":"Rectangle", "color":"#ffffff", "stroke":"#000000", "key":-3, "loc":{"class":"go.Point", "x":-101.25, "y":88}, "attrList":[ {"name":"attr8", "type":"String", "cardinality":"SINGLE"} ]} ],  "linkDataArray": [ {"from":-1, "to":-2, "text":"testLink", "attrList":[ {"name":"attr3", "type":"String", "cardinality":"SINGLE"},{"name":"attr4", "type":"String", "cardinality":"SINGLE"} ]},{"from":-1, "to":-3, "text":"testLink2", "attrList":[ {"name":"attr6", "type":"String", "cardinality":"SINGLE"},{"name":"attr7", "type":"String", "cardinality":"SINGLE"} ]},{"from":-3, "to":-2, "text":"testLink3", "attrList":[ {"name":"attr9", "type":"String", "cardinality":"SINGLE"} ]} ]}',
      indexJson: '[{"name":"attr1","type":"node","config":"unique","properties":["attr1"]},{"name":"attr4","type":"link","config":"mixed","properties":["attr4"]}]',
      frontendMappingJson: '{"class":"go.GraphLinksModel",      "nodeDataArray":[      {"text":"node1","figure":"Ellipse","color":"#ffffff","stroke":"#000000","key":-1,"loc":{"class":"go.Point","x":-96.25,"y":-60},"attrList":[{"name":"attr1","type":"String","cardinality":"SINGLE"},{"name":"attr2","type":"String","cardinality":"SINGLE"}]},      {"text":"node2","figure":"Rectangle","color":"#ffffff","stroke":"#000000","key":-2,"loc":{"class":"go.Point","x":109.75,"y":-8.999999999999993},"attrList":[{"name":"attr5","type":"String","cardinality":"SINGLE"}]},      {"text":"node3","figure":"Rectangle","color":"#ffffff","stroke":"#000000","key":-3,"loc":{"class":"go.Point","x":-101.25,"y":88},"attrList":[{"name":"attr8","type":"String","cardinality":"SINGLE"}]},      {"from":-1,"to":-2,"text":"testLink","attrList":[{"name":"attr3","type":"String","cardinality":"SINGLE"},{"name":"attr4","type":"String","cardinality":"SINGLE"}],"key":"temp0","stroke":"#ffffff","margin":0,"originType":"link"},      {"from":-1,"to":-3,"text":"testLink2","attrList":[{"name":"attr6","type":"String","cardinality":"SINGLE"},{"name":"attr7","type":"String","cardinality":"SINGLE"}],"key":"temp1","stroke":"#ffffff","margin":0,"originType":"link"},      {"from":-3,"to":-2,"text":"testLink3","attrList":[{"name":"attr9","type":"String","cardinality":"SINGLE"}],"key":"temp2","stroke":"#ffffff","margin":0,"originType":"link"},      {"id":"file0","name":"file0.csv","key":"file0","category":"file","geo":"file","text":"file0.csv","loc":"23.01182501441015-44.34573232100241"}      ],      "linkDataArray":[      {"from":-1,"to":"temp0","category":"readOnly"},      {"from":"temp0","to":-2,"category":"readOnly"},      {"from":-1,"to":"temp1","category":"readOnly"},      {"from":"temp1","to":-3,"category":"readOnly"},      {"from":-3,"to":"temp2","category":"readOnly"},      {"from":"temp2","to":-2,"category":"readOnly"},      {"from":"file0","to":"temp1","start":{"nodeAttr":"attr1","column":"file0-column5"},"end":{"nodeAttr":"attr8","column":"file0-column3"},"mapping":{"file0-column2":"attr6","file0-column3":"attr7"}},      {"from":"file0","to":"temp2","start":{"nodeAttr":"attr8","column":"file0-column2"},"end":{"nodeAttr":"attr5","column":"file0-column2"},"mapping":{"file0-column0":"attr9","file0-column2":"attr9"}},      {"from":"file0","to":-3,"mapping":{"file0-column0":"attr8"}}      ]}',
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getDataSources(req, res) {
  const fileList = [];
  for (let i = 0; i < 10; i++) { fileList.push({ id: `file${i}`, name: `file${i}.csv` }); }
  const result = {
    success: true,
    data: fileList,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
export function getGremlinServerAddress(req, res) {
  const result = {
    success: true,
    data: {
      // host: '20.28.30.28',
      host: 'localhost',
      port: '8182',
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
export function getDataSourceColumns(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const params = getUrlParams(url);
  const columnList = [];
  for (let i = 0; i < 10; i++) { columnList.push(`${params.id}-column${i}`); }
  const result = {
    success: true,
    data: columnList,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
export default {
  recentGraph,
  saveGraph,
  getGraph,
  getDataSources,
  getDataSourceColumns,
};

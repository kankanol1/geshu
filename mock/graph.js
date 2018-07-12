/* eslint-disable */
import moment from 'moment';
import { getUrlParams } from './utils';


let graphList = [
  {
    id: 0,
    name: 'test',
    status: 'new',
    description: 'test',
    frontendJson: `{ "class": "go.GraphLinksModel",
                    "nodeDataArray": [ 
                  {"text":"person", "figure":"Ellipse", "color":"#ffffff", "stroke":"#000000", "key":-1, "loc":{"class":"go.Point", "x":-119.25, "y":-60}, "attrList":[ {"name":"name", "type":"String", "cardinality":"SINGLE"},{"name":"age", "type":"Integer", "cardinality":"SINGLE"} ]},
                  {"text":"software", "figure":"Rectangle", "color":"#ffffff", "stroke":"#000000", "key":-2, "loc":{"class":"go.Point", "x":131.75, "y":-74}, "attrList":[ {"name":"name", "type":"String", "cardinality":"SINGLE"},{"name":"lang", "type":"String", "cardinality":"SINGLE"} ]}
                  ],
                    "linkDataArray": [ 
                  {"from":-1, "to":-2, "text":"created", "attrList":[ {"name":"weight", "type":"Integer", "cardinality":"SINGLE"} ]},
                  {"from":-1, "to":-1, "text":"knows", "attrList":[ {"name":"weight", "type":"Integer", "cardinality":"SINGLE"} ]}
                  ]}`,
    indexJson: '[{"name":"name","type":"node","config":"unique","properties":["name"]},{"name":"lang","type":"node","config":"composite","properties":["lang"]},{"name":"weight","type":"link","config":"composite","properties":["weight"]}]',
    backendJson: '{"propertyKeys":[{"name":"name","dataType":"String","cardinality":"SINGLE"},{"name":"age","dataType":"Integer","cardinality":"SINGLE"},{"name":"lang","dataType":"String","cardinality":"SINGLE"},{"name":"weight","dataType":"Integer","cardinality":"SINGLE"}],"vertexLabels":[{"name":"person","partition":false,"useStatic":false},{"name":"software","partition":false,"useStatic":false}],"edgeLabels":[{"name":"created","multiplicity":"MULTI","unidirected":true,"signatures":[]},{"name":"knows","multiplicity":"MULTI","unidirected":true,"signatures":[]}],"vertexCentricIndexes":[],"vertexIndexes":[{"name":"name","propertyKeys":["name"],"composite":false,"unique":true,"mixedIndex":false,"indexOnly":""},{"name":"lang","propertyKeys":["lang"],"composite":true,"unique":false,"mixedIndex":false,"indexOnly":""}],"edgeIndexes":[{"name":"weight","propertyKeys":["weight"],"composite":true,"unique":false,"mixedIndex":false,"indexOnly":""}]}',
    // frontendMappingJson: `{ "class": "go.GraphLinksModel",
    //             "nodeDataArray": [
    //           {"text":"person", "figure":"Ellipse", "color":"#ffffff", "stroke":"#000000", "key":-1, "loc":{"class":"go.Point", "x":-119.25, "y":-60}, "attrList":[ {"name":"name", "type":"String", "cardinality":"SINGLE"},{"name":"age", "type":"Integer", "cardinality":"SINGLE"} ]},
    //           {"text":"software", "figure":"Rectangle", "color":"#ffffff", "stroke":"#000000", "key":-2, "loc":{"class":"go.Point", "x":131.75, "y":-74}, "attrList":[ {"name":"name", "type":"String", "cardinality":"SINGLE"},{"name":"lang", "type":"String", "cardinality":"SINGLE"} ]},
    //           {"from":-1, "to":-2, "text":"created", "attrList":[ {"name":"weight", "type":"Integer", "cardinality":"SINGLE"} ], "key":"temp0", "stroke":"#ffffff", "margin":0, "originType":"link"},
    //           {"from":-1, "to":-1, "text":"knows", "attrList":[ {"name":"weight", "type":"Integer", "cardinality":"SINGLE"} ], "key":"temp1", "stroke":"#ffffff", "margin":0, "originType":"link"},
    //           {"id":"file0", "name":"file0.csv", "key":"file0", "category":"file", "geo":"file", "text":"file0.csv", "loc":"-121.07613908082482 -27.607494633355195"},
    //           {"id":"file2", "name":"file2.csv", "key":"file2", "category":"file", "geo":"file", "text":"file2.csv", "loc":"96.84568373906346 -188.92675204681095"}
    //           ],
    //             "linkDataArray": [
    //           {"from":-1, "to":"temp0", "category":"readOnly"},
    //           {"from":"temp0", "to":-2, "category":"readOnly"},
    //           {"from":-1, "to":"temp1", "category":"readOnly"},
    //           {"from":"temp1", "to":-1, "category":"readOnly"},
    //           {"from":"file0", "to":-2, "mapping":{"file0-column0":"name", "file0-column1":"lang"}},
    //           {"from":"file0", "to":"temp0", "start":{"nodeAttr":"name", "column":"file0-column2"}, "end":{"column":"file0-column3", "nodeAttr":"name"}, "mapping":{"file0-column4":"weight"}},
    //           {"from":"file0", "to":-1},
    //           {"from":"file2", "to":-1, "mapping":{"file2-column0":"name", "file2-column1":"age"}},
    //           {"from":"file2", "to":"temp1", "start":{"nodeAttr":"name", "column":"file2-column2"}, "end":{"nodeAttr":"name", "column":"file2-column3"}, "mapping":{"file2-column4":"weight"}}
    //           ]}`,
    // backendMappingJson: '{"vertexMaps":[{"edge":"software","source":{"path":"file0.csv","header":true,"inferSchema":true,"schema":"","type":"CsvSourceAttribute"},"propertyMapping":{"name":"file0-column0","lang":"file0-column1"}},{"edge":"person","source":{"path":"file0.csv","header":true,"inferSchema":true,"schema":"","type":"CsvSourceAttribute"},"propertyMapping":{}},{"edge":"person","source":{"path":"file2.csv","header":true,"inferSchema":true,"schema":"","type":"CsvSourceAttribute"},"propertyMapping":{"name":"file2-column0","age":"file2-column1"}}],"edgeMaps":[{"edge":"created","source":{"path":"file0.csv","header":true,"inferSchema":true,"schema":"","type":"CsvSourceAttribute"},"propertyMapping":{"weight":"file0-column4"},"edgeLeft":{"edgeField":"name","vertex":"person","vertexField":"file0-column2"},"edgeRight":{"edgeField":"name","vertex":"software","vertexField":"file0-column2"}},{"edge":"knows","source":{"path":"file2.csv","header":true,"inferSchema":true,"schema":"","type":"CsvSourceAttribute"},"propertyMapping":{"weight":"file2-column4"},"edgeLeft":{"edgeField":"name","vertex":"person","vertexField":"file2-column2"},"edgeRight":{"edgeField":"name","vertex":"person","vertexField":"file2-column2"}}]}',
    createdAt: moment('2018-01-01', 'YYYY-MM-DD'),
    updatedAt: moment('2018-02-01', 'YYYY-MM-DD'),
  },
];
export function recentGraph(req, res) {
  if (res && res.json) {
    res.json({ success: true, data: graphList });
  } else {
    return graphList;
  }
}
export function deleteGraph(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { ids } = body;

  graphList = graphList.filter(item => !ids.includes(item.id));

  const result = {
    success: true,
    message: '删除成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
export function getGraphList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...graphList];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) >= 0);
  }

  if (params.updatedAt) {
    const updatedAt = params.updatedAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    dataSource = dataSource.filter((data) => {
      if (data.updatedAt >= updatedAt[0] && data.updatedAt <= updatedAt[1]) {
        return true;
      }
      return false;
    });
  }

  if (params.createdAt) {
    const createdAt = params.createdAt.split(',').map(t => moment(t, 'YYYYMMDD'));
    dataSource = dataSource.filter((data) => {
      if (data.createdAt >= createdAt[0] && data.createdAt <= createdAt[1]) {
        return true;
      }
      return false;
    });
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  let currentPage = 1;
  if (params.currentPage) {
    currentPage = params.currentPage; // eslint-disable-line
  }

  const startNum = (currentPage - 1) * pageSize;
  const returnDataSource = dataSource.slice(startNum, startNum + pageSize);

  const formatedDataSource = returnDataSource.map((item) => {
    return {
      ...item,
      createdAt: item.createdAt.format('YYYY-MM-DD HH:mm'),
      updatedAt: item.updatedAt.format('YYYY-MM-DD HH:mm'),
    };
  });

  const result = {
    list: formatedDataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function saveGraph(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const body = (b && b.body) || req.body;
  const { id } = body;
  graphList[id] = {
    ...graphList[id],
    ...body,
  };
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

export function getGraph(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url; // eslint-disable-line
  }
  const params = getUrlParams(url);
  const { id } = params;
  const result = {
    success: true,
    data: { ...graphList[id * 1] },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function createGraph(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { name, description, redirect } = body;

  const i = graphList.length;
  graphList.push({
    name,
    id: i,
    key: i,
    description,
    createdAt: moment(`2018-01-0${Math.floor(i / 2) + 1}`, 'YYYY-MM-DD'),
    updatedAt: moment(`2018-02-0${Math.floor(i / 2) + 1}`, 'YYYY-MM-DD'),
    status: 'new',
  });

  const result = {
    success: true,
    message: redirect ? i : '添加成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
export function saveAsQuery(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { name, query } = body;
  queries.push({
    id: i,
    name,
    query,
  });
  i++;
  const result = {
    success: true,
    message: '添加成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
export function saveQuery(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { query, id } = body;
  queries = queries.filter((item) => {
    if (item.id === id) {
      item.query = query; // eslint-disable-line
      return item;
    } else {
      return item;
    }
  });
  const result = {
    success: true,
    message: '添加成功',
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
let i = 3;
let queries = [
  {
    id: 0,
    createdAt: moment('2018-01-01', 'YYYY-MM-DD'),
    name: 'queryAll',
    query: `nodes=g.V().limit(5)
    edges = g.V()
            .limit(5)
            .aggregate('node')
            .outE()
            .as('edge')
            .inV()
            .where(within('node'))
            .select('edge')
    [nodes.toList(),edges.toList()]`,

  },
  {
    id: 1,
    name: 'exploreNode',
    createdAt: moment('2018-01-01', 'YYYY-MM-DD'),
    query: `nodes =g.V(1).as("node").both().as("node")
    .select(all,"node").inject(g.V(1)).unfold()
    edges = g.V(1).bothE()
    [nodes.toList(),edges.toList()]`,
  },
  {
    id: 2,
    name: 'searchNodeBy',
    createdAt: moment('2018-01-01', 'YYYY-MM-DD'),
    query: `nodes=g.V().has('name','vadas')
    edges = g.V().
      has('name','vadas').
      aggregate('node')
      .outE().as('edge')
      .inV()
      .where(within('node'))
      .select('edge')
    [nodes.toList(),edges.toList()]`,
  },
];
for (; i < 20; i++) {
  queries.push({
    id: i,
    name: `query${i}`,
    query: 'g.V()',
    createdAt: moment('2018-01-01', 'YYYY-MM-DD'),
  });
}
export function getQueryList(req, res, u) {
  const result = {
    success: true,
    data: [
      ...queries,
    ],
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function updateQuery(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }
  const body = (b && b.body) || req.body;
  const { id, name, query } = body;

  queries[id].name = name;
  queries[id].query = query;
  const result = {
    success: true,
    message: '修改成功',
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function deleteQuery(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { ids } = body;

  queries = queries.filter(item => !ids.includes(item.id));

  const result = {
    success: true,
    message: '删除成功',
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
  const { file } = getUrlParams(url);
  let columnList = [];
  switch (file) {
    case '/projectx/person.csv':
      columnList = ['id', 'name', 'age'];
      break;
    case '/projectx/software.csv':
      columnList = ['id', 'name', 'lang'];
      break;
    case '/projectx/knows.csv':
      columnList = ['id', 'weight', 'start', 'end'];
      break;
    case '/projectx/created.csv':
      columnList = ['id', 'weight', 'start', 'end'];
      break;
    default:
      for (let j = 0; j < 10; j++) { columnList.push(`${file}-column${j}`); }
  }
  const result = columnList;
  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function executeGraph(req, res) {
  const result = {
    success: true,
    message: '任务添加成功',
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
  getQueryList,
  saveQuery,
  saveAsQuery,
  updateQuery,
  deleteQuery,
  executeGraph,
  createGraph,
  getGraphList,
};

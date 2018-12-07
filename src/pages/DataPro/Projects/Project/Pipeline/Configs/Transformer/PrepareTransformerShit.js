import React from 'react';
import { connect } from 'dva';
import { Input, Row, Col, Button, Icon } from 'antd';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import styles from './PrepareTransformer.less';

const columns = [
  'id',
  'survived',
  'pClass',
  'name',
  'sex',
  'age',
  'sibSp',
  'parCh',
  'ticket',
  'fare',
  'cabin',
  'embarked',
];
const columnNames = [
  '编号',
  '是否存活',
  '船舱等级',
  '姓名',
  '性别',
  '年龄',
  '兄弟姐妹数目',
  '父母孩子数目',
  '票号',
  '票价',
  '船仓',
  '上传地点',
];
const types = [
  'int',
  'int',
  'int',
  'string',
  'string',
  'int',
  'int',
  'int',
  'string',
  'double',
  'string',
  'string',
];
const secondTypes = [
  '唯一标识',
  '布尔值',
  '枚举',
  '姓名',
  '性别',
  '年龄',
  '枚举',
  '枚举',
  '?',
  '?',
  '?',
  '枚举',
];

const rawData = `1,0,3,"Braund, Mr. Owen Harris",male,22,1,0,A/5 21171,7.25,,S
2,1,1,"Cumings, Mrs. John Bradley (Florence Briggs Thayer)",female,38,1,0,PC 17599,71.2833,C85,C
3,1,3,"Heikkinen, Miss. Laina",female,26,0,0,STON/O2. 3101282,7.925,,S
4,1,1,"Futrelle, Mrs. Jacques Heath (Lily May Peel)",female,35,1,0,113803,53.1,C123,S
5,0,3,"Allen, Mr. William Henry",male,35,0,0,373450,8.05,,S
6,0,3,"Moran, Mr. James",male,,0,0,330877,8.4583,,Q
7,0,1,"McCarthy, Mr. Timothy J",male,54,0,0,17463,51.8625,E46,S
8,0,3,"Palsson, Master. Gosta Leonard",male,2,3,1,349909,21.075,,S
9,1,3,"Johnson, Mrs. Oscar W (Elisabeth Vilhelmina Berg)",female,27,0,2,347742,11.1333,,S
10,1,2,"Nasser, Mrs. Nicholas (Adele Achem)",female,14,1,0,237736,30.0708,,C
11,1,3,"Sandstrom, Miss. Marguerite Rut",female,4,1,1,PP 9549,16.7,G6,S
12,1,1,"Bonnell, Miss. Elizabeth",female,58,0,0,113783,26.55,C103,S
13,0,3,"Saundercock, Mr. William Henry",male,20,0,0,A/5. 2151,8.05,,S
14,0,3,"Andersson, Mr. Anders Johan",male,39,1,5,347082,31.275,,S
15,0,3,"Vestrom, Miss. Hulda Amanda Adolfina",female,14,0,0,350406,7.8542,,S
16,1,2,"Hewlett, Mrs. (Mary D Kingcome) ",female,55,0,0,248706,16,,S
17,0,3,"Rice, Master. Eugene",male,2,4,1,382652,29.125,,Q
18,1,2,"Williams, Mr. Charles Eugene",male,,0,0,244373,13,,S
19,0,3,"Vander Planke, Mrs. Julius (Emelia Maria Vandemoortele)",female,31,1,0,345763,18,,S
20,1,3,"Masselmani, Mrs. Fatima",female,,0,0,2649,7.225,,C`;

function CSVtoArray(text) {
  const re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
  // Return NULL if input string is not well formed CSV string.
  if (!re_valid.test(text)) return null;
  const a = []; // Initialize array to receive values.
  text.replace(
    re_value, // "Walk" the string using replace with callback.
    (m0, m1, m2, m3) => {
      // Remove backslash from \' in single quoted values.
      if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
      // Remove backslash from \" in double quoted values.
      else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
      else if (m3 !== undefined) a.push(m3);
      return ''; // Return empty string.
    }
  );
  // Handle special case of empty last value.
  if (/,\s*$/.test(text)) a.push('');
  return a;
}

const lines = rawData.split('\n');
const converted = [];
for (const l of lines) {
  const arr = CSVtoArray(l);
  const obj = {};
  for (let i = 0; i < columns.length; i++) {
    let value = arr[i];
    if (arr[i] === 'male') {
      value = '男性';
    } else if (arr[i] === 'female') {
      value = '女性';
    }
    obj[columns[i]] = value;
  }
  converted.push(obj);
}

const history = [
  {
    id: 2,
    name: 'mapping',
    params: {
      column: 'name',
      mapping: {
        male: '男性',
        female: '女性',
      },
    },
  },
  {
    id: 1,
    name: 'select',
    params: {
      columns: columnNames,
    },
  },
];

const names = {
  select: '列选择',
  mapping: '值映射',
};

@connect(({ demo1 }) => ({ demo1 }))
class PrepareTransformer extends React.Component {
  state = {
    field: undefined,
    value: undefined,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'demo1/fetchData',
      payload: {
        ...this.state,
      },
    });
  }

  // handleClick(e) {
  //   e.preventDefault();
  //   console.log('e', e.clientX, e.clientY);
  // }

  describeHistory = item => {
    if (item.name === 'select') {
      return `${item.params.columns}`;
    } else if (item.name === 'mapping') {
      return `姓名： male => 男性, female => 女性`;
    }
  };

  renderTable = () => {
    const { table, tableName } = this.props.demo1;
    const nc = [];
    if (table) {
      for (let i = 0; i < columns.length; i++) {
        const v = columns[i];
        nc.push({
          id: v,
          Header: props => (
            <div onClick={e => this.handleClick(e)}>
              <span style={{ color: 'black', display: 'block', fontWeight: '500' }}>
                {' '}
                {columnNames[i]}
              </span>
              <span style={{ display: 'block', fontSize: '12px' }}> {types[i]}</span>
              <span style={{ display: 'block', fontSize: '12px', color: '#1abc9c' }}>
                {' '}
                {secondTypes[i]}
              </span>
            </div>
          ),
          accessor: v,
          sortable: false,
        });
      }
    }
    const eleStyle = {
      margin: '4px',
    };
    return (
      <React.Fragment>
        <div style={{ padding: '5px' }}>
          <Button style={eleStyle}>列重命名</Button>
          <Button style={eleStyle}>值映射</Button>
          <Button style={eleStyle}>合并列</Button>
          <Button style={eleStyle}>修改列类型</Button>
          <Button style={eleStyle}>增加列</Button>
          <Button style={eleStyle}>列拆分</Button>
          <Button style={eleStyle}>列选择</Button>
          <Button style={eleStyle}>条件处理</Button>
          <Button style={eleStyle}>格式化</Button>
          <Button style={eleStyle}>数据提取</Button>
          <Button style={eleStyle}>数学公式</Button>
        </div>
        <ReactTable data={converted} columns={nc} />
      </React.Fragment>
    );
  };

  renderHistory = () => {
    return (
      <React.Fragment>
        <div className={styles.historyTitle}>历史操作</div>
        <div className={styles.historyList}>
          {history.map(i => (
            <div className={styles.historyItem}>
              <div className={styles.operations}>
                <Icon type="delete" style={{ color: 'red' }} />
                <Icon type="edit" />
              </div>
              <div className={styles.title}>{names[i.name]}</div>
              <span className={styles.description}>{this.describeHistory(i)}</span>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  };

  renderContext = () => {
    return (
      <div className={styles.menuWrapper}>
        <div className={styles.menuItem}>重命名</div>
        <div className={styles.menuItem}>值映射</div>
        <div className={styles.menuItem}>修改类型</div>
        <div className={styles.menuItem}>拆分</div>
        <div className={styles.menuItem}>数据提取</div>
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col span={6}>{this.renderHistory()}</Col>
          <Col span={18}>{this.renderTable()}</Col>
        </Row>
        {this.renderContext()}
      </React.Fragment>
    );
  }
}

export default PrepareTransformer;

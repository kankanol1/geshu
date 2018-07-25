import React from 'react';
import { Row, Col, Button, Input, Modal, Radio, Card, Tag } from 'antd';
import { Controlled as CodeMirror } from 'react-codemirror2';
import codemirror from 'codemirror';
import 'codemirror/mode/sql/sql';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import styles from './ExpressionEditor.less';
import { validateBooleanExpression } from './ExpressionUtils';

export default class ExpressionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: props.formData,
      modalVisible: false,
      mode: 'advance',
      sql: props.formData.value,
      editorError: undefined,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      formData: props.formData,
      sql: props.formData.value,
    });
  }

  handleOk = () => {
    // validate sql.
    const { success, message } = validateBooleanExpression(this.state.sql);
    // validation end.
    if (success) {
      // success logic.
      this.setState({ editorError: undefined,
        modalVisible: false,
        formData: {
          value: this.state.sql,
        } }, () => this.props.onChange(this.state.formData));
    } else {
      this.setState({ editorError: message });
    }
  }

  handleEditorCursorActivity = (editor, table) => {
    if (this.lastOpIsDelete || editor.getDoc().getValue().length === 0) {
      this.lastOpIsDelete = false;
      return;
    }
    const cursor = editor.getDoc().getCursor();
    const token = editor.getTokenAt(cursor);
    let tipList = [];
    let startPos = 0;
    if (token.string.startsWith('.')) {
      // get table.
      const tableName = editor.getTokenAt(codemirror.Pos(cursor.line, token.start)).string;
      if (tableName.charAt(0) === '.') {
        // error.
        tipList = [];
      } else {
        // search
        startPos = token.start + 1;
        tipList = table[tableName].filter(v => v.startsWith(token.string.substring(1)));
      }
    } else if (token.type !== 'keyword') {
      // search for name directly.
      // token.
      startPos = token.start;
      Object.entries(table).forEach(([k, v]) => {
        if (k.startsWith(token.string)) {
          tipList.push(k);
        }
        // no need to give field tips.
        // v.forEach((n) => {
        //   if (n.startsWith(token.string)) {
        //     tipList.push(n);
        //   }
        // });
      });
    }
    if (tipList && tipList.length > 0) {
      const options = {
        completeSingle: false,
        hint() {
          return {
            from: codemirror.Pos(cursor.line, startPos),
            to: codemirror.Pos(cursor.line, cursor.ch),
            list: tipList,
          };
        },
      };
      editor.showHint(options);
    }
  }

  renderSimpleForm = () => {
    return <div> form </div>;
  }

  renderAdvanceInput() {
    const { uiSchema: { 'ui:options': { getTableSchema } } } = this.props;
    const tableInfo = getTableSchema && getTableSchema();
    const table = {};
    tableInfo.forEach((i) => {
      table[i.table] = i.schema.map(v => v.name);
    });
    return (
      <div>
        <CodeMirror
          value={this.state.sql}
          onCursorActivity={editor => this.handleEditorCursorActivity(editor, table)}
          options={{
            lineNumbers: true,
            mode: 'text/x-sql',
            theme: 'solarized',
            placeholder: '输入查询sql',
          }}
          onBeforeChange={(editor, data, value) => {
            if (value && this.state.sql && value.length < this.state.sql.length) {
              this.lastOpIsDelete = true;
            }
          this.setState({ sql: value });
        }}
          className={styles.codemirror}
        />
      </div>
    );
  }

  renderTableSchema() {
    const { uiSchema: { 'ui:options': { getTableSchema } } } = this.props;
    if (!getTableSchema) {
      return <div>无提示信息</div>;
    }
    return (
      <div>
        {getTableSchema().map(i => (
          <div key={i.table}>
            <Card className={styles.tableTitle} title={`输入节点[${i.table}]属性列表`}>
              <div className={styles.schemaWrapper}>
                {i.schema.map(s => (
                  <Tag key={s.name}>
                    {s.name}
                    ({s.type.substring(1, s.type.length - 1)})
                  </Tag>
              ))}
              </div>
            </Card>

          </div>
        ))}
      </div>
    );
  }

  renderModal() {
    return (
      <Modal
        title="编辑表达式"
        visible={this.state.modalVisible}
        onOk={() => this.handleOk()}
        onCancel={() => { this.setState({ modalVisible: false }); }}
        className={styles.expressionModal}
        width={980}
        maskClosable={false}
      >
        <div className={styles.modalContent}>
          <div className={styles.modeWrapper}>
            <div className={styles.errorTip}>
              <span>{this.state.editorError}</span>
            </div>
            {/* <Radio.Group
              onChange={v => this.setState({ mode: v.target.value })}
              value={this.state.mode}
              style={{ float: 'right' }}
            >
              <Radio.Button value="simple">简单模式</Radio.Button>
              <Radio.Button value="advance">高级模式</Radio.Button>
            </Radio.Group> */}
          </div>
          <Row style={{ clear: 'both' }}>
            <Col span={16}> {this.state.mode === 'simple' ?
            this.renderSimpleForm() :
            this.renderAdvanceInput()}
            </Col>
            <Col span={8}> {this.renderTableSchema()} </Col>
          </Row>
        </div>
      </Modal>
    );
  }
  render() {
    const { schema, required, uiSchema } = this.props;
    const { getTableSchema } = uiSchema['ui:options'];
    if (!getTableSchema) {
      return <div style={{ color: 'red' }}> 未定义获取Schema函数 </div>;
    }
    return (
      <Row>
        <Col span={6}><legend>{schema.description} {required ? ' *' : null}</legend></Col>
        <Col span={6}> <Button type="primary" onClick={() => this.setState({ modalVisible: true })}>编辑</Button> </Col>
        <Col span={12}>
          <Input value={this.state.formData.value ? this.state.formData.value : '未编辑'} disabled />
        </Col>
        {this.renderModal()}
      </Row>
    );
  }
}

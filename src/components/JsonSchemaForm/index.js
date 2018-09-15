/** generate form using json schema */

import React from 'react';
import JsonPath from 'jsonpath';
import styles from './index.less';
import Form from './RefinedForm';
import SampleWidget from './Widgets/SampleWidget';
import SwitchSchemaWidget from './Widgets/Schema/SwitchSchemaWidget';
import DefineSchemaWidget from './Widgets/Schema/DefineSchemaWidget';
import SelectWidget from './Widgets/SelectWidget';
import ObjectFieldTemplate from './Templates/ObjectFieldTemplate';
import AnyValueWidget from './Widgets/AnyValueWidget';
import DatabaseSelectorWidget from './Widgets/DB/DatabaseSelectorWidget';
import FileSourceConfWidget from './Widgets/Composite/FileSourceConfWidget';
import InputColumnWidget from './Widgets/Column/InputColumnWidget';
import ValueTypePairWidget from './Widgets/Column/ValueTypePairWidget';
import NumberSliderWidget from './Widgets/NumberSliderWidget';
import NumberInputWidget from './Widgets/NumberInputWidget';
import CategorizedFileSelectorWidget from './Widgets/File/CategorizedFileSelectorWidget';
import ColumnMappingWidget from './Widgets/Column/ColumnMappingWidget';
import ColumnSelectCheckboxWidget from './Widgets/Column/ColumnSelectCheckboxWidget';
import ColumnSelectSelectorWidget from './Widgets/Column/ColumnSelectSelectorWidget';
import ColumnMappingItemWidget from './Widgets/Column/ColumnMappingItemWidget';
import TunnableIntWidget from './Widgets/Tunnable/TunnableIntWidget';
import CustomFieldTemplate from './Templates/CustomFieldTemplate';
import ArrayFieldTemplate from './Templates/ArrayFieldTemplate';
import ErrorListTemplate from './Templates/ErrorListTemplate';
import ExpressionEditor from './Widgets/ExprEditor/ExpressionEditor';
import ColumnAssemblerConfWidget from './Widgets/Composite/ColumnAssemblerConfWidget';
import ColumnTypePairTable from './Widgets/Column/ColumnTypePairTable';
import RandomSplitWidget from './Widgets/Composite/RandomSplitWidget';

const registeredWidgets = {
  SelectWidget,
};

const registeredFields = {
  sample: SampleWidget,
  switch_schema: SwitchSchemaWidget,
  define_schema: DefineSchemaWidget,
  file_selector: CategorizedFileSelectorWidget,
  any_value: AnyValueWidget,
  database_selector: DatabaseSelectorWidget,
  file_source_conf: FileSourceConfWidget,
  input_column: InputColumnWidget,
  value_type_pair: ValueTypePairWidget,
  number_slider: NumberSliderWidget,
  number_input: NumberInputWidget,
  column_mapping_array: ColumnMappingWidget,
  column_mapping: ColumnMappingItemWidget,
  column_selector_checkbox: ColumnSelectCheckboxWidget,
  column_selector_selector: ColumnSelectSelectorWidget,
  boolean_expression_editor: ExpressionEditor,
  column_assembler_conf: ColumnAssemblerConfWidget,
  column_type_pair_array: ColumnTypePairTable,
  random_split_widget: RandomSplitWidget,
  // tunnable widgets
  // tunable_int: TunableNumberWidget,
  tunable_int: TunnableIntWidget,
};

const replaceLastPathTo = (pathSelector, lastPath) => {
  const pathArr = pathSelector.split('.');
  pathArr[pathArr.length - 1] = lastPath;
  return pathArr.join('..');
};


export default class JsonSchemaForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.transformErrors = this.transformErrors.bind(this);
  }

  transformErrors(errors) {
    const schema = this.props.jsonSchema;
    const transformedErrors = errors.map((e) => {
      if (e.name === 'required') {
        const title = JsonPath.query(schema, `$${replaceLastPathTo(e.property, 'title')}`);
        const description = JsonPath.query(schema, `$${replaceLastPathTo(e.property, 'description')}`);
        return { ...e, stack: `"${description.length === 0 ? title[0] : description[0]}" 为必填项`, message: '必填' };
      } else return e;
    });
    return transformedErrors;
    // return errors;
  }

  render() {
    return (
      <Form
        {...this.props}
        ref={(form) => { this.form = form; }}
        schema={this.props.jsonSchema}
        FieldTemplate={CustomFieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        ArrayFieldTemplate={ArrayFieldTemplate}
        className={styles.settingsForm}
        fields={{ ...registeredFields, ...this.props.fields }}
        widgets={{ ...registeredWidgets, ...this.props.widgets }}
        transformErrors={this.transformErrors}
        // html5 validation will prevent from submitting when there are required checkboxes.
        noHtml5Validate
        // disable error list display.
        showErrorList
        // no validation
        // noValidate
        ErrorList={ErrorListTemplate}
        safeRenderCompletion
      >
        {this.props.children}
      </Form>
    );
  }
}

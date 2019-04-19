import React from 'react';
import ColumnSelectCheckboxWidget from '@/components/JsonSchemaForm/Widgets/Column/ColumnSelectCheckboxWidget';

class CheckboxSelectColumnWidget extends React.Component {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      data: value,
    };
  }

  componentWillReceiveProps(props) {
    const { value } = props;
    this.setState({
      data: value,
    });
  }

  render() {
    const { data } = this.state;
    const { schema } = this.props;
    return (
      <ColumnSelectCheckboxWidget
        uiSchema={{
          'ui:options': {
            getField: () => {
              return schema;
            },
          },
        }}
        formData={{ value: data }}
        onChange={v => {
          this.setState({
            data: v.value,
          });
          this.props.onChange(v.value);
        }}
      />
    );
  }
}

export default CheckboxSelectColumnWidget;

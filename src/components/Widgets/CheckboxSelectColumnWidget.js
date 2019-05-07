import React from 'react';
import ColumnSelectCheckboxWidget from '@/components/Widgets/ColumnSelectCheckboxWidget';

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
        schema={schema}
        formData={data}
        onChange={v => {
          this.setState({
            data: v,
          });
          this.props.onChange(v);
        }}
      />
    );
  }
}

export default CheckboxSelectColumnWidget;

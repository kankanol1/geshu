import React from 'react';
import SimpleWidget from '@/components/JsonSchemaForm/Widgets/Schema/DefineSchemaWidget';

class DefineSchemaWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      data: value || [],
    };
  }

  componentWillReceiveProps(props) {
    const { value } = props;
    this.setState({
      data: value || [],
    });
  }

  render() {
    return (
      <SimpleWidget
        formData={this.state.data}
        mode="normal"
        onChange={v => {
          this.setState({ data: v });
          this.props.onChange(v);
        }}
      />
    );
  }
}

export default DefineSchemaWidget;

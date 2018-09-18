import React from 'react';
import ColumnScalingStrategyTable from '../Column/ColumnScalingStrategyTable';
import CompositeWidget from '../CompositWidget';

export default class ColumnAssemblerConfWidget extends CompositeWidget {
  render() {
    const { getField } = this.props.uiSchema['ui:options'];
    const extraUISchema = { 'ui:options': { getField } };
    return (
      <div >
        {this.renderSchema('inputs', {}, extraUISchema, ColumnScalingStrategyTable)}
        {this.renderSchema('output')}
      </div>
    );
  }
}

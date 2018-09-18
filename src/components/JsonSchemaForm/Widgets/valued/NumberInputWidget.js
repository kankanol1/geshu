import React from 'react';
import BaseNumberInputWidget from '../base/NumberInputWidget';

const NumberInputWidget = (props) => {
  const { formData, onChange } = props;
  return (
    <BaseNumberInputWidget
      {...props}
      formData={formData.value}
      onChange={v => onChange({ value: v })}
    />
  );
};

export default NumberInputWidget;

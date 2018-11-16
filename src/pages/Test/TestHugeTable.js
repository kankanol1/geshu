import React from 'react';
import HugeTable from '@/components/HugeTable';

const data = [];
for (let i = 0; i < 1000; i++) {
  let arr = '<tr>';
  for (let j = 0; j < 11; j++) {
    arr += `<td> Loc: ${i}, ${j}</td>`;
  }
  arr += '</tr>';
  data.push(arr);
}

export default class TestHugeTable extends React.Component {
  render() {
    return <HugeTable id="hi" data={data} />;
  }
}

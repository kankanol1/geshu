import React from 'react';
import ConfigurationTable from '../../UI/ConfigurationTable';

export default class ColumnRenameWidget extends React.Component {
  render() {
    return (
      <ConfigurationTable
        canAdd
        canDelete
        data={[{ k: 'k', v: 'v' }]}
        columns={[{
          name: 'k', title: 'Key', render: (v, item, changeFunc) => <div>{v}</div>, span: 10,
        }, {
          name: 'v', title: 'Value', render: (v, item, changeFunc) => <div>{v}</div>, span: 10,
        },
      ]}
        // onChange={v => console.log('v', v)}
      />
    );
  }
}

import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import XMarkdownEditor from '@/components/XMarkdownEditor';

@connect(({ dataproProject, loading }) => ({
  readme: dataproProject.readme,
  loading: loading.models.dataproProject,
}))
class MarkdownSettings extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mde: undefined,
    };
  }

  componentWillMount() {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'dataproProject/fetchProjectReadme',
      payload: { id },
    });
  }

  componentWillReceiveProps(props) {
    if (this.state.mde !== undefined) {
      this.state.mde.value(props.readme || '');
    }
  }

  render() {
    const { id } = this.props;
    return (
      <React.Fragment>
        <XMarkdownEditor
          styles={{ height: '500px' }}
          initValue={this.props.readme || ''}
          onLoad={mde => this.setState({ mde })}
        />
        <Button
          type="primary"
          onClick={e =>
            this.props.dispatch({
              type: 'dataproProject/updateProjectReadme',
              payload: {
                id,
                md: this.state.mde.value(),
              },
            })
          }
        >
          保存
        </Button>
      </React.Fragment>
    );
  }
}

export default MarkdownSettings;

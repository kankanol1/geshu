import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

@connect(
  ({ work_canvas, loading }) => ({
    work_canvas, loading,
  })
)
export default class WorkAreaBottomBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fullView: false,
    };
  }

  toggleState() {
    this.setState({ fullView: !this.state.fullView });
  }

  renderMessage = (message, k = null) => {
    return <div key={k}>{moment(message.time).format('HH:mm:ss.SSS')}: {message.message}</div>;
  }

  render() {
    const { tips: { show, messages } } = this.props.work_canvas;
    if (!show) return null;
    return (
      <div
        style={{ position: 'absolute', bottom: '0', width: '100%', cursor: 'pointer', paddingLeft: '20px' }}
        onClick={e => this.toggleState()}
      >
        {this.state.fullView ?
            messages.map((m, i) => this.renderMessage(m, i)) :
           this.renderMessage(messages[0], 0)}
      </div>
    );
  }
}

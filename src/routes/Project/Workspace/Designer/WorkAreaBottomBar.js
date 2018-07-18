import React from 'react';
import { connect } from 'dva';
import moment from 'moment';

@connect(
  ({ workcanvas, loading }) => ({
    tips: workcanvas.tips, loading,
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
    return message ? <div key={k}>{moment(message.time).format('HH:mm:ss.SSS')}: {message.message}</div> : null;
  }

  render() {
    const { show, messages } = this.props.tips;
    if (!show) return null;
    return (
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          width: '60%',
          cursor: 'pointer',
          paddingLeft: '20px',
          color: '#bfbfbf',
        }}
        onClick={e => this.toggleState()}
      >
        {this.state.fullView ?
            messages.map((m, i) => this.renderMessage(m, i)) :
           this.renderMessage(messages[0], 0)}
      </div>
    );
  }
}

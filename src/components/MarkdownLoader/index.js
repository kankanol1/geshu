import React from 'react';
import { Spin } from 'antd';
import ReactMarkdown from 'react-markdown';
import request from '@/utils/request';

import 'github-markdown-css'; // import markdown styles.
import './index.less';

export default class MarkdownLoader extends React.PureComponent {
  state = {
    loading: true,
    markdown: undefined,
  };

  componentDidMount() {
    this.setState({ loading: true });
    const { url, markdown } = this.props;
    if (url) {
      request(url, { isText: true }).then(result => {
        this.setState({ loading: false, markdown: result });
      });
    } else if (markdown) {
      this.setState({ loading: false, markdown });
    }
  }

  render() {
    const { loading, markdown } = this.state;
    return (
      <Spin spinning={loading}>
        <div className="markdown-body">
          <ReactMarkdown source={markdown} />
        </div>
      </Spin>
    );
  }
}

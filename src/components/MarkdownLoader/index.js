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

  renderLoading = () => {
    return <Spin />;
  };

  renderMarkdown() {
    const { markdown } = this.state;
    return (
      <div className="markdown-body">
        <ReactMarkdown source={markdown} />
      </div>
    );
  }

  render() {
    const { loading } = this.state;
    return loading ? this.renderLoading() : this.renderMarkdown();
  }
}

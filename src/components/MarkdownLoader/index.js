import React from 'react';
import { Spin } from 'antd';
import ReactMarkdown from 'react-markdown';
import request from '@/utils/request';

export default class MarkdownLoader extends React.Component {
  state = {
    loading: true,
    markdown: undefined,
  };

  componentDidMount() {
    this.setState({ loading: true });
    const { url } = this.props;
    request(url, { isText: true }).then(result => {
      this.setState({ loading: false, markdown: result });
    });
  }

  renderLoading = () => {
    return <Spin />;
  };

  renderMarkdown() {
    const { markdown } = this.state;
    return <ReactMarkdown source={markdown} />;
  }

  render() {
    const { loading } = this.state;
    return loading ? this.renderLoading() : this.renderMarkdown();
  }
}

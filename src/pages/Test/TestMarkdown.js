import React from 'react';
import MarkdownLoader from '@/components/MarkdownLoader';

export default class TestMarkdown extends React.PureComponent {
  render() {
    return <MarkdownLoader url="/doc/test.md" />;
  }
}

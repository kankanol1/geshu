import React from 'react';
import XMarkdownEditor from '@/components/XMarkdownEditor';

export default class TestMarkdownEditor extends React.PureComponent {
  render() {
    return <XMarkdownEditor styles={{ height: '500px' }} />;
  }
}

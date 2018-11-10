import React from 'react';
import SimpleMDE from 'gl-simplemde';

import 'simplemde/dist/simplemde.min.css';

export default class XMarkdownEditor extends React.PureComponent {
  mde = undefined;

  componentDidMount() {
    const mde = new SimpleMDE({
      element: document.getElementById('mde-area'),
      autofocus: true,
      autosave: {
        enabled: true,
        uniqueId: 'MyUniqueID',
        delay: 1000,
      },
      blockStyles: {
        bold: '__',
        italic: '_',
      },
      forceSync: true,
      hideIcons: ['guide', 'side-by-side', 'fullscreen'],
      indentWithTabs: false,
      initialValue: 'Hello world!',
      lineWrapping: false,
      parsingConfig: {
        allowAtxHeaderWithoutSpace: true,
        strikethrough: false,
        underscoresBreakWords: true,
      },
      placeholder: '',
      promptImage: () => {
        return prompt('input image url');
      },
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true,
      },
      shortcuts: {
        drawTable: 'Cmd-Alt-T',
      },
      showIcons: ['code', 'table'],
      spellChecker: false,
      styleSelectedText: false,
      tabSize: 4,
    });
    this.mde = mde;
  }

  componentWillUnmount() {
    delete this.mde;
  }

  render() {
    return (
      <textarea
        value="hi"
        id="mde-area"
        styles={this.props.styles}
        className={this.props.className}
      />
    );
  }
}

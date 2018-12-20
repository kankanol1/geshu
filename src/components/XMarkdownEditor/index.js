import React from 'react';
import SimpleMDE from 'gl-simplemde';

import 'gl-simplemde/dist/simplemde.min.css';

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
      hideIcons: ['guide', 'side-by-side', 'fullscreen', 'image'],
      indentWithTabs: false,
      initialValue: undefined,
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
    mde.value(this.props.initValue);
    const { onChange, onLoad } = this.props;
    mde.codemirror.on('change', () => onChange && onChange(mde.value()));
    if (onLoad) onLoad(mde);
  }

  componentWillReceiveProps(props) {
    const { value } = props;
    this.mde.value(value);
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

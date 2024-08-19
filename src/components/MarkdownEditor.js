// frontend/src/components/MarkdownEditor.js
import React, { useState } from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt();

const MarkdownEditor = ({ initialContent = '', onContentChange }) => {
  const [content, setContent] = useState(initialContent);

  const handleEditorChange = ({ text }) => {
    setContent(text);
    onContentChange(text);
  };

  return (
    <MdEditor
      value={content}
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleEditorChange}
    />
  );
};

export default MarkdownEditor;

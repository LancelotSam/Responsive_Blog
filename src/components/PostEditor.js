// frontend/src/components/PostEditor.js, markdown editing component
// frontend/src/components/PostEditor.js
import React, { useState } from 'react';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const PostEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [headerImage, setHeaderImage] = useState(null);
  const [imageURL, setImageURL] = useState('');

  const handleFileChange = (e) => {
    setHeaderImage(e.target.files[0]);
  };

  const handleEditorChange = ({ text }) => {
    setContent(text);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let uploadedImageUrl = '';
      if (headerImage) {
        const formData = new FormData();
        formData.append('headerImage', headerImage);

        const { data } = await axios.post('/api/posts/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        uploadedImageUrl = data.filePath;
      }

      const postData = {
        title,
        content,
        image: uploadedImageUrl,
      };

      await axios.post('/api/posts', postData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Optionally reset form or redirect user
      setTitle('');
      setContent('');
      setHeaderImage(null);
      setImageURL(uploadedImageUrl);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div>
          <label htmlFor="headerImage">Upload Header Image:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        {headerImage && (
          <div>
            <img src={URL.createObjectURL(headerImage)} alt="Header Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
          </div>
        )}
        <MarkdownEditor
          value={content}
          style={{ height: '500px' }}
          renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
          onChange={handleEditorChange}
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default PostEditor;

// frontend/src/pages/PostDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/comments/${id}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/comments', {
        content: commentContent,
        postId: id,
      });

      setComments([...comments, response.data]);
      setCommentContent('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="post-details">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <h3>Comments</h3>
      <ul>
        {comments.map(comment => (
          <li key={comment._id}>
            <p>{comment.content}</p>
            <p><small>By: {comment.author.username}</small></p>
          </li>
        ))}
      </ul>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Add a comment"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostDetails;

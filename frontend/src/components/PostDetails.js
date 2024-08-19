// frontend/src/components/PostDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import ReactMarkdown from 'react-markdown';

const PostDetails = ({ match }) => {
  const postId = match.params.id;
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Fetch post details
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}`);
        setPost(response.data);
	      // mark post as read
	await axios.post(`/api/users/read/${postId}`, {}, {
		headers: {
			Authorization: `Bearer ${localStorage.getItem( 'token')}`,
		},
	});
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      {post.image && (
        <img src={post.image} alt="Header" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
      )}
      <ReactMarkdown>{post.content}</ReactMarkdown>
      <CommentForm postId={postId} onCommentAdded={() => {/* Refresh comments */}} />
      <CommentList postId={postId} />
    </div>
  );
};

export default PostDetails;

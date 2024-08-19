// frontend/src/components/ReadPosts.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReadPosts = () => {
  const [readPosts, setReadPosts] = useState([]);

  useEffect(() => {
    const fetchReadPosts = async () => {
      try {
        const { data } = await axios.get('/api/user/read', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setReadPosts(data);
      } catch (error) {
        console.error('Failed to fetch read posts:', error);
      }
    };

    fetchReadPosts();
  }, []);

  return (
    <div>
      <h2>Your Read Posts</h2>
      <ul>
        {readPosts.map(post => (
          <li key={post._id}>
            <a href={`/post/${post._id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReadPosts;

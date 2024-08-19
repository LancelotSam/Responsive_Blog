// frontend/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [readPosts, setReadPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(data.user);
        setPosts(data.posts);
        setReadPosts(data.readPosts);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <h3>Your Posts</h3>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <h4>{post.title}</h4>
            <p>{post.content.substring(0, 100)}...</p>
            <a href={`/post/${post._id}`}>Read more</a>
          </li>
        ))}
      </ul>

      <h3>Posts You've Read</h3>
      <ul>
        {readPosts.map(post => (
          <li key={post._id}>
            <h4>{post.title}</h4>
            <p>{post.content.substring(0, 100)}...</p>
            <a href={`/post/${post._id}`}>Read more</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

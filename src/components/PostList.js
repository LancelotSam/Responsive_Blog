// frontend/src/components/PostList.js
import React, { useState, useEffect } from 'react';
import { fetchPosts } from '../services/postService';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts(page, 10, search);
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    loadPosts();
  }, [page, search]);

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search posts..."
      />
      <ul>
        {posts.map((post) => (
          <li key={post._id}>{post.title}</li>
        ))}
      </ul>
      <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
    </div>
  );
};

export default PostList;

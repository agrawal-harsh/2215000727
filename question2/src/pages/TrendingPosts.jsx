import React, { useState, useEffect } from 'react';
import { fetchTrendingPosts } from '../services/api';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const TrendingPosts = () => {
  const [postsData, setPostsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTrendingPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchTrendingPosts();
        setPostsData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load trending posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getTrendingPosts();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Trending Posts</h1>
        {postsData && <p className="text-sm text-gray-500">Processing time: {postsData.processingTime}</p>}
      </div>
      
      <div className="space-y-6">
        {postsData && postsData.posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;

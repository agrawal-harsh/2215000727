import React, { useState, useEffect } from 'react';
import { fetchLatestPosts } from '../services/api';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Feed = () => {
  const [postsData, setPostsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeed = async () => {
    try {
      setRefreshing(true);
      const data = await fetchLatestPosts();
      setPostsData(data);
      setError(null);
    } catch (err) {
      if (!postsData) {  // Only show error if we don't have existing data
        setError('Failed to load feed');
      }
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchFeed, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Latest Posts</h1>
        <div className="flex items-center space-x-2">
          {postsData && <p className="text-sm text-gray-500">Processing time: {postsData.processingTime}</p>}
          <button 
            onClick={fetchFeed}
            disabled={refreshing}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
      
      {loading && !postsData ? <Loading /> : null}
      {error && !postsData ? <ErrorMessage message={error} /> : null}
      
      <div className="space-y-6">
        {postsData && postsData.posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;

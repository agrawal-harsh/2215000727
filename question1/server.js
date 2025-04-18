const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const PORT = process.env.PORT || 3000;

// Cache setup with 5 minutes TTL
const cache = new NodeCache({ stdTTL: 300 });

// Base URL for the mock server
const BASE_URL = 'http://localhost:3001/evaluation-service';

// Helper function to fetch data with caching
async function fetchWithCache(url, cacheKey, ttl = 300) {
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for ${cacheKey}`);
    return cachedData;
  }
  
  try {
    console.log(`Fetching ${url}`);
    const response = await axios.get(url);
    const data = response.data;
    cache.set(cacheKey, data, ttl);
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    throw error;
  }
}

// Fetch all users
async function getAllUsers() {
  const data = await fetchWithCache(`${BASE_URL}/users`, 'all_users');
  return data.users;
}

// Fetch posts for a user
async function getUserPosts(userId) {
  const data = await fetchWithCache(`${BASE_URL}/users/${userId}/posts`, `user_posts_${userId}`);
  return data.posts || [];
}

// Fetch comments for a post
async function getPostComments(postId) {
  const data = await fetchWithCache(`${BASE_URL}/posts/${postId}/comments`, `post_comments_${postId}`, 120);
  return data.comments || [];
}

// 1. Top Users API
app.get('/users', async (req, res) => {
  try {
    const startTime = Date.now();
    const users = await getAllUsers();
    const userCommentCounts = {};
    
    // Initialize counts for all users
    for (const userId in users) {
      userCommentCounts[userId] = {
        id: userId,
        name: users[userId],
        commentedPostsCount: 0
      };
    }
    
    // Count posts with comments for each user
    for (const userId in users) {
      const posts = await getUserPosts(userId);
      
      for (const post of posts) {
        const comments = await getPostComments(post.id);
        if (comments.length > 0) {
          userCommentCounts[userId].commentedPostsCount++;
        }
      }
    }
    
    // Convert to array and sort by commentedPostsCount (descending)
    const sortedUsers = Object.values(userCommentCounts)
      .sort((a, b) => b.commentedPostsCount - a.commentedPostsCount)
      .slice(0, 5); // Get top 5
    
    const endTime = Date.now();
    res.json({
      topUsers: sortedUsers,
      processingTime: `${endTime - startTime} ms`
    });
  } catch (error) {
    console.error('Error in /users endpoint:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// 2. Top/Latest Posts API
app.get('/posts', async (req, res) => {
  try {
    const startTime = Date.now();
    const type = req.query.type;
    
    if (!type || (type !== 'latest' && type !== 'popular')) {
      return res.status(400).json({ error: 'Invalid or missing type parameter. Must be "latest" or "popular"' });
    }
    
    const users = await getAllUsers();
    const allPosts = [];
    
    // Gather all posts with their comment counts
    for (const userId in users) {
      const posts = await getUserPosts(userId);
      
      for (const post of posts) {
        const comments = await getPostComments(post.id);
        allPosts.push({
          id: post.id,
          userId: post.userid,
          userName: users[post.userid],
          content: post.content,
          commentCount: comments.length
        });
      }
    }
    
    let resultPosts;
    if (type === 'popular') {
      // Find maximum comment count
      const maxComments = Math.max(...allPosts.map(post => post.commentCount));
      // Return all posts with that maximum count
      resultPosts = allPosts.filter(post => post.commentCount === maxComments);
    } else { // type === 'latest'
      // Sort by post ID (assuming higher ID means newer post)
      resultPosts = allPosts
        .sort((a, b) => b.id - a.id)
        .slice(0, 5); // Get top 5
    }
    
    const endTime = Date.now();
    res.json({
      type,
      posts: resultPosts,
      processingTime: `${endTime - startTime} ms`
    });
  } catch (error) {
    console.error('Error in /posts endpoint:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Service is healthy');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const PORT = process.env.PORT || 3000;

const cache = new NodeCache({ stdTTL: 300 });

const BASE_URL = 'http://localhost:3001/evaluation-service';

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

async function getAllUsers() {
  const data = await fetchWithCache(`${BASE_URL}/users`, 'all_users');
  return data.users;
}
r
async function getUserPosts(userId) {
  const data = await fetchWithCache(`${BASE_URL}/users/${userId}/posts`, `user_posts_${userId}`);
  return data.posts || [];
}

async function getPostComments(postId) {
  const data = await fetchWithCache(`${BASE_URL}/posts/${postId}/comments`, `post_comments_${postId}`, 120);
  return data.comments || [];
}

app.get('/users', async (req, res) => {
  try {
    const startTime = Date.now();
    const users = await getAllUsers();
    const userCommentCounts = {};
    
    for (const userId in users) {
      userCommentCounts[userId] = {
        id: userId,
        name: users[userId],
        commentedPostsCount: 0
      };
    }
    
    for (const userId in users) {
      const posts = await getUserPosts(userId);
      
      for (const post of posts) {
        const comments = await getPostComments(post.id);
        if (comments.length > 0) {
          userCommentCounts[userId].commentedPostsCount++;
        }
      }
    }
    
    const sortedUsers = Object.values(userCommentCounts)
      .sort((a, b) => b.commentedPostsCount - a.commentedPostsCount)
      .slice(0, 5); 
    
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

app.get('/posts', async (req, res) => {
  try {
    const startTime = Date.now();
    const type = req.query.type;
    
    if (!type || (type !== 'latest' && type !== 'popular')) {
      return res.status(400).json({ error: 'Invalid or missing type parameter. Must be "latest" or "popular"' });
    }
    
    const users = await getAllUsers();
    const allPosts = [];
    
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
      const maxComments = Math.max(...allPosts.map(post => post.commentCount));
      resultPosts = allPosts.filter(post => post.commentCount === maxComments);
    } else { 
      resultPosts = allPosts
        .sort((a, b) => b.id - a.id)
        .slice(0, 5); 
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

app.get('/health', (req, res) => {
  res.status(200).send('Service is healthy');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
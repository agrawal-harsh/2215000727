const API_BASE_URL = 'http://localhost:3000';

export const fetchTopUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch top users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching top users:', error);
    throw error;
  }
};

export const fetchTrendingPosts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts?type=popular`);
    if (!response.ok) throw new Error('Failed to fetch trending posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    throw error;
  }
};

export const fetchLatestPosts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts?type=latest`);
    if (!response.ok) throw new Error('Failed to fetch latest posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    throw error;
  }
};

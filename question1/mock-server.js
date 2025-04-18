// mock-server.js
const express = require('express');
const app = express();
const PORT = 3001;

// Mock data
const users = {
  "users": {
    "1": "harsh",
    "2": "harshit",
    "3": "chaudhary",
    "4": "Asksay",
    "5": "Nainshi"
  }
};

const posts = {
  "1": [
    {"id": 101, "userid": 1, "content": "First post"},
    {"id": 102, "userid": 1, "content": "Second post"}
  ],
  "2": [
    {"id": 201, "userid": 2, "content": "Hello world"}
  ]
};

const comments = {
  "101": [
    {"id": 1001, "postid": 101, "content": "Great post!"},
    {"id": 1002, "postid": 101, "content": "I agree"}
  ],
  "102": [
    {"id": 1003, "postid": 102, "content": "Interesting"}
  ]
};

app.get('/evaluation-service/users', (req, res) => {
  res.json(users);
});

app.get('/evaluation-service/users/:userid/posts', (req, res) => {
  const userId = req.params.userid;
  res.json({ posts: posts[userId] || [] });
});

app.get('/evaluation-service/posts/:postid/comments', (req, res) => {
  const postId = req.params.postid;
  res.json({ comments: comments[postId] || [] });
});

app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
});
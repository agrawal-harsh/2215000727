import React, { useState, useEffect } from 'react';

const PostCard = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  
  const imageUrl = `https://i.pravatar.cc/150?img=${1 + Math.floor(Math.random() * 10)}'`;
  
  const avatarUrl = `https://i.pravatar.cc/150?img=${1 + Math.floor(Math.random() * 10)}'`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <img 
            className="h-10 w-10 rounded-full object-cover border border-gray-200" 
            src={avatarUrl}
            alt={`${post.userName}'s avatar`} 
          />
          <div>
            <h3 className="text-lg font-medium text-gray-900">{post.userName}</h3>
            <p className="text-sm text-gray-500">Post ID: {post.id}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-gray-800 text-lg">{post.content}</p>
        </div>
        
        <div className="mt-4">
          <img 
            className="w-full h-64 rounded-lg object-cover" 
            src={imageUrl}
            alt="Post content" 
          />
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
              </svg>
              <span>{Math.floor(Math.random() * 20)}</span>
            </button>
            <button 
              onClick={() => setExpanded(!expanded)}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
              <span>{post.commentCount}</span>
            </button>
          </div>
          
          <div>
            <button className="text-gray-600 hover:text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">Comments ({post.commentCount})</h4>
            <div className="space-y-3">
              {/* We would normally fetch comments here, but we'll show placeholders */}
              {Array.from({ length: post.commentCount }, (_, i) => (
                <div key={i} className="flex space-x-3">
                  <img 
                    className="h-8 w-8 rounded-full object-cover" 
                    src={avatarUrl}
                    alt="User avatar" 
                  />
                  <div className="bg-gray-100 rounded-lg p-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-gray-900">User {i + 1}</h5>
                      <span className="text-xs text-gray-500">{new Date().toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-800 mt-1">This is a comment on this post!</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
import React from 'react';

const UserCard = ({ user }) => {
  // Generate a random avatar using a placeholder service
  const avatarUrl = `/api/placeholder/150/150`;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-shrink-0">
          <img 
            className="h-24 w-24 rounded-full object-cover border-2 border-blue-500" 
            src={avatarUrl}
            alt={`${user.name}'s avatar`} 
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
          <div className="mt-2 flex flex-col space-y-2">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span className="text-gray-600">Posts with comments: {user.commentedPostsCount}</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Top Contributor
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

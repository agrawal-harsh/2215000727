import React, { useState, useEffect } from 'react';
import { fetchTopUsers } from '../services/api';
import UserCard from '../components/UserCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const TopUsers = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTopUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchTopUsers();
        setUserData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load top users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getTopUsers();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Top Users</h1>
        {userData && <p className="text-sm text-gray-500">Processing time: {userData.processingTime}</p>}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {userData && userData.topUsers.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default TopUsers;

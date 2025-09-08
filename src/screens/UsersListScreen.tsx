import React, { useEffect, useState } from 'react';
import api from '../services/api';

const UsersListScreen: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
  const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Usuarios</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.email} - {user.firstName} {user.lastName}</li>
        ))}
      </ul>
    </div>
  );
};

export default UsersListScreen;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
        setUsers(response.data.data);
      } catch (err) {
        setError('Failed to load users.');
      }
    };
    fetchUsers();
  }, [page, navigate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setSuccess('User deleted successfully!');
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://reqres.in/api/users/${editingUser.id}`, editingUser);
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
      setSuccess('User updated successfully!');
    } catch (err) {
      setError('Failed to update user.');
    }
  };

  return (
    <div>
      <h2>User List</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {editingUser ? (
        <form onSubmit={handleUpdate}>
          <input
            value={editingUser.first_name}
            onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
          />
          <input
            value={editingUser.last_name}
            onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
          />
          <input
            value={editingUser.email}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
          />
          <button type="submit">Save</button>
          <button onClick={() => setEditingUser(null)}>Cancel</button>
        </form>
      ) : (
        <div>
          {users.map((user) => (
            <div key={user.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <img src={user.avatar} alt={`${user.first_name} avatar`} />
              <p>{user.first_name} {user.last_name}</p>
              <button onClick={() => handleEdit(user)}>Edit</button>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span> Page {page} </span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
      <button onClick={() => {
        localStorage.removeItem('token');
        navigate('/');
      }}>Logout</button>
    </div>
  );
}

export default UserList;
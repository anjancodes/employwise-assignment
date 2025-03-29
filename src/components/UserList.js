import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserList() {
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [allUsers, setAllUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Check authentication and fetch users on page load or page change
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
        setTotalPages(response.data.total_pages);
      } catch (err) {
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (!isSearching) {
      fetchUsers();
    }
  }, [page, navigate, isSearching]);

  // Fetch all users across all pages for search functionality
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      let allUserData = [];
      // Reqres API typically has 2 pages, but we'll make it dynamic
      for (let i = 1; i <= totalPages; i++) {
        const response = await axios.get(`https://reqres.in/api/users?page=${i}`);
        allUserData = [...allUserData, ...response.data.data];
      }
      setAllUsers(allUserData);
      return allUserData;
    } catch (err) {
      setError('Failed to load all users for search.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccess('');
    }, 3000);
    return () => clearTimeout(timeout);
  }, [success]);

  // Handle search functionality
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    
    if (value.trim() === '') {
      // If search is cleared, go back to normal pagination
      setIsSearching(false);
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
      return;
    }
    
    setIsSearching(true);
    
    // If we don't have all users yet, fetch them
    let usersToFilter = allUsers;
    if (allUsers.length === 0) {
      usersToFilter = await fetchAllUsers();
    }
    
    const filtered = usersToFilter.filter((user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredUsers(filtered);
  };

  // Handle user deletion
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      
      // Update both the current page users and all users (if we have them)
      setUsers(users.filter((user) => user.id !== id));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
      
      if (allUsers.length > 0) {
        setAllUsers(allUsers.filter((user) => user.id !== id));
      }
      
      setSuccess('User deleted successfully!');
    } catch (err) {
      setError('Failed to delete user.');
    } finally {
      setLoading(false);
    }
  };

  // Set user for editing
  const handleEdit = (user) => {
    setEditingUser({ ...user });
  };

  // Handle user update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser.first_name || !editingUser.last_name || !editingUser.email.includes('@')) {
      setError('Please fill all fields with valid data.');
      return;
    }
    setLoading(true);
    try {
      await axios.put(`https://reqres.in/api/users/${editingUser.id}`, editingUser);
      
      // Update both the current page users and all users (if we have them)
      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setFilteredUsers(filteredUsers.map((u) => (u.id === editingUser.id ? editingUser : u)));
      
      if (allUsers.length > 0) {
        setAllUsers(allUsers.map((u) => (u.id === editingUser.id ? editingUser : u)));
      }
      
      setEditingUser(null);
      setSuccess('User updated successfully!');
    } catch (err) {
      setError('Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">User List</h2>
        
        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search users..."
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 shadow-sm"
          />
        </div>
        
        {/* Status Messages */}
        <div className="mb-4">
          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {error && <p className="text-red-500 text-center mb-2 p-2 bg-red-50 rounded-md">{error}</p>}
          {success && <p className="text-green-500 text-center mb-2 p-2 bg-green-50 rounded-md">{success}</p>}
        </div>

        {/* Edit Form */}
        {editingUser ? (
          <form onSubmit={handleUpdate} className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  value={editingUser.first_name}
                  onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  value={editingUser.last_name}
                  onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
                  required
                  type="email"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                disabled={loading}
                className={`py-2 px-4 rounded-md text-white w-full sm:w-auto ${
                  loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                } transition-colors`}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="py-2 px-4 rounded-md bg-gray-600 text-white hover:bg-gray-700 w-full sm:w-auto transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          // User Cards Grid
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="bg-white p-3 sm:p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center sm:space-x-4"
                >
                  {/* User Avatar */}
                  <img 
                    src={user.avatar} 
                    alt={`${user.first_name} avatar`} 
                    className="w-16 h-16 rounded-full mb-2 sm:mb-0" 
                  />
                  
                  {/* User Info */}
                  <div className="flex-1 text-center sm:text-left mb-2 sm:mb-0">
                    <p className="font-semibold">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="py-1 px-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                      aria-label={`Edit ${user.first_name}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="py-1 px-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      aria-label={`Delete ${user.first_name}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // No users found message
              <div className="col-span-full text-center p-4 bg-white rounded-lg shadow">
                <p className="text-gray-500">No users found.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {!isSearching && (
          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1 || loading}
              className={`py-2 px-4 rounded-md w-full sm:w-auto ${
                page === 1 || loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors`}
            >
              Previous
            </button>
            <span className="py-2 text-center">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={loading || page >= totalPages}
              className={`py-2 px-4 rounded-md w-full sm:w-auto ${
                loading || page >= totalPages ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors`}
            >
              Next
            </button>
          </div>
        )}
        
        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }}
          className="mt-6 w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserList;

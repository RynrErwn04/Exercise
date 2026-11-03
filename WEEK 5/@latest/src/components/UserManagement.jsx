import { useState, useEffect } from 'react';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    fetch: false,
    create: false,
    update: false,
    delete: false,
  });
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
  const [editingUser, setEditingUser] = useState(null);

  const API_BASE = 'https://jsonplaceholder.typicode.com';

  const apicall = async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  };

  const fetchUsers = async () => {
    setLoading((prev) => ({ ...prev, fetch: true }));
    setError(null);

    try {
      const userData = await apicall('/users');
      setUsers(userData);
    } catch (err) {
      setError(`Failed to fetch users: ${err.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  };

  const createUser = async (userData) => {
    setLoading((prev) => ({ ...prev, create: true }));
    setError(null);

    try {
      await apicall('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      const userWithId = { ...userData, id: Date.now() };
      setUsers((prev) => [...prev, userWithId]);
      setNewUser({ name: '', email: '', role: 'user' });

      return userWithId;
    } catch (err) {
      setError(`Failed to create user: ${err.message}`);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, create: false }));
    }
  };

  const updateUser = async (userId, userData) => {
    setLoading((prev) => ({ ...prev, update: true }));
    setError(null);

    try {
      // Fixed: Backticks used for template literal string
      const updatedUser = await apicall(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });

      // Fixed: Correct parentheses placement for map callback
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, ...userData } : user))
      );
      setEditingUser(null);

      return updatedUser;
    } catch (err) {
      setError(`Failed to update user: ${err.message}`);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    } // Fixed: Added missing closing brace
  };

  const deleteUser = async (userId) => {
    setLoading((prev) => ({ ...prev, delete: true }));
    setError(null);

    try {
      await apicall(`/users/${userId}`, { method: 'DELETE' });
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      setError(`Failed to delete user: ${err.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (!newUser.name || !newUser.email) {
      setError('Name and email are required');
      return;
    }

    try {
      await createUser(newUser);
    } catch (err) {
      // Error handled in createUser
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!editingUser.name || !editingUser.email) {
      setError('Name and email are required');
      return;
    }

    try {
      await updateUser(editingUser.id, editingUser);
    } catch (err) {
      // Error handled in updateUser
    }
  };

  return (
    <div>
      <h2>User Management</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Form to create user */}
      <form onSubmit={handleCreateSubmit}>
        <h3>Create User</h3>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button type="submit" disabled={loading.create}>
          {loading.create ? 'Creating...' : 'Add User'}
        </button>
      </form>

      {/* Form to edit user */}
      {editingUser && (
        <form onSubmit={handleUpdateSubmit}>
          <h3>Edit User</h3>
          <input
            type="text"
            value={editingUser.name}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
          />
          <input
            type="email"
            value={editingUser.email}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
          />
          <button type="submit" disabled={loading.update}>
            {loading.update ? 'Updating...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => setEditingUser(null)}>
            Cancel
          </button>
        </form>
      )}

      {/* Users list */}
      <h3>Users</h3>
      {loading.fetch ? (
        <p>Loading users...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email})
              <button onClick={() => setEditingUser(user)}>Edit</button>
              <button onClick={() => deleteUser(user.id)} disabled={loading.delete}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserManagement;
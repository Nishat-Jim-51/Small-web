import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [blockAction, setBlockAction] = useState(null);
  const [unblockAction, setUnblockAction] = useState(null);

  useEffect(() => {
    axios.get('/user-management')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleSelectAll = () => {
    setSelectedUsers(users.map(user => user.id));
  };

  const handleSelectSingle = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleBlock = () => {
    axios.post('/block/' + selectedUsers.join(','))
      .then(response => console.log(response.data))
      .catch(error => console.error(error));
  };

  const handleUnblock = () => {
    axios.post('/unblock/' + selectedUsers.join(','))
      .then(response => console.log(response.data))
      .catch(error => console.error(error));
  };

  const handleDelete = () => {
    axios.delete('/delete/' + selectedUsers.join(','))
      .then(response => console.log(response.data))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" onChange={handleSelectAll} />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login Time</th>
            <th>Registration Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <input type="checkbox" onChange={() => handleSelectSingle(user.id)} />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.last_login_time}</td>
              <td>{user.registration_time}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleBlock}>Block</button>
      <button onClick={handleUnblock}>Unblock</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default App;
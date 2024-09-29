const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

app.use(bodyParser.json());

// Database connection
const db = require('./database');

// Authentication middleware
app.use((req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
});

// Registration route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.query(`INSERT INTO users (name, email, password) VALUES (@name, @email, @password)`, {
    name,
    email,
    password: hashedPassword,
  });
  res.send({ message: 'User created successfully' });
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.query(`SELECT * FROM users WHERE email = @email`, { email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    res.status(401).send({ message: 'Invalid email or password' });
  } else {
    req.session.user = user;
    res.send({ message: 'Logged in successfully' });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send({ message: 'Logged out successfully' });
});

// User management route
app.get('/user-management', async (req, res) => {
  const users = await db.query(`SELECT * FROM users WHERE status = 'active'`);
  res.send(users);
});

// Block/Unblock user route
app.post('/block/:id', async (req, res) => {
  const userId = req.params.id;
  await db.query(`UPDATE users SET status = 'blocked' WHERE id = @id`, { id: userId });
  res.send({ message: 'User blocked successfully' });
});

// Unblock user route
app.post('/unblock/:id', async (req, res) => {
  const userId = req.params.id;
  await db.query(`UPDATE users SET status = 'active' WHERE id = @id`, { id: userId });
  res.send({ message: 'User unblocked successfully' });
});

// Delete user route
app.delete('/delete/:id', async (req, res) => {
  const userId = req.params.id;
  await db.query(`DELETE FROM users WHERE id = @id`);
  res.send({ message: 'User deleted successfully' });
});

app.listen(3000, () => console.log('Server started on port 3000'));
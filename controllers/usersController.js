const db     = require('../config/db');
const bcrypt = require('bcryptjs');

// GET /users
exports.index = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id,name,email,role,status,created_at FROM users ORDER BY created_at DESC');
    res.render('modules/users', { title: 'User Management', active: 'users', users });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load users.');
    res.redirect('/dashboard');
  }
};

// POST /users
exports.create = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)', [name, email, hashed, role]);
    req.flash('success', `User "${name}" created successfully.`);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') req.flash('error', 'Email already exists.');
    else req.flash('error', 'Failed to create user.');
  }
  res.redirect('/users');
};

// POST /users/:id/edit
exports.update = async (req, res) => {
  const { name, email, role, status } = req.body;
  try {
    await db.query('UPDATE users SET name=?,email=?,role=?,status=? WHERE id=?',
      [name, email, role, status, req.params.id]);
    req.flash('success', 'User updated successfully.');
  } catch (err) {
    req.flash('error', 'Failed to update user.');
  }
  res.redirect('/users');
};

// DELETE /users/:id
exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    req.flash('success', 'User deleted.');
  } catch (err) {
    req.flash('error', 'Failed to delete user.');
  }
  res.redirect('/users');
};

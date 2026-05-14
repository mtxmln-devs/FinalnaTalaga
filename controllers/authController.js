const db      = require('../config/db');
const bcrypt  = require('bcryptjs');

const C = {
  reset:'\x1b[0m', bright:'\x1b[1m',
  green:'\x1b[32m', red:'\x1b[31m', yellow:'\x1b[33m',
  cyan:'\x1b[36m', gray:'\x1b[90m',
};

function ts() {
  return new Date().toLocaleString('en-PH', {
    year:'numeric',month:'2-digit',day:'2-digit',
    hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true
  });
}

// GET /login
exports.getLogin = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

// POST /login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const line = '═'.repeat(55);
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND status = "Active"', [email]);
    if (rows.length === 0) {
      console.log(`\n${C.bright}${C.red}${line}${C.reset}`);
      console.log(`${C.bright}${C.red}❌  LOGIN FAILED${C.reset}`);
      console.log(`${C.gray}  Time   :${C.reset} ${ts()}`);
      console.log(`${C.gray}  Email  :${C.reset} ${email}`);
      console.log(`${C.gray}  Reason :${C.reset} ${C.red}User not found or inactive${C.reset}`);
      console.log(`${C.bright}${C.red}${line}${C.reset}\n`);
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    const user  = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log(`\n${C.bright}${C.red}${line}${C.reset}`);
      console.log(`${C.bright}${C.red}❌  LOGIN FAILED${C.reset}`);
      console.log(`${C.gray}  Time   :${C.reset} ${ts()}`);
      console.log(`${C.gray}  Email  :${C.reset} ${email}`);
      console.log(`${C.gray}  Reason :${C.reset} ${C.red}Incorrect password${C.reset}`);
      console.log(`${C.bright}${C.red}${line}${C.reset}\n`);
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    // Store user in session (exclude password)
    req.session.user = {
      id: user.id, name: user.name,
      email: user.email, role: user.role
    };

    console.log(`\n${C.bright}${C.green}${line}${C.reset}`);
    console.log(`${C.bright}${C.green}✅  LOGIN SUCCESSFUL${C.reset}`);
    console.log(`${C.gray}  Time   :${C.reset} ${ts()}`);
    console.log(`${C.gray}  Name   :${C.reset} ${C.bright}${user.name}${C.reset}`);
    console.log(`${C.gray}  Email  :${C.reset} ${user.email}`);
    console.log(`${C.gray}  Role   :${C.reset} ${user.role}`);
    console.log(`${C.bright}${C.green}${line}${C.reset}\n`);

    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/dashboard');

  } catch (err) {
    console.error(`${C.red}Login error:${C.reset}`, err);
    req.flash('error', 'Server error. Please try again.');
    res.redirect('/login');
  }
};

// GET /signup
exports.getSignup = (req, res) => {
  res.render('auth/signup', { title: 'Sign Up' });
};

// POST /signup
exports.postSignup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const [exists] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length > 0) {
      req.flash('error', 'Email already registered.');
      return res.redirect('/signup');
    }
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, role || 'Encoder']
    );
    console.log(`\n${C.bright}${C.cyan}${'═'.repeat(55)}${C.reset}`);
    console.log(`${C.bright}${C.cyan}📝  NEW USER REGISTERED${C.reset}`);
    console.log(`${C.gray}  Name   :${C.reset} ${name}`);
    console.log(`${C.gray}  Email  :${C.reset} ${email}`);
    console.log(`${C.gray}  Role   :${C.reset} ${role}`);
    console.log(`${C.bright}${C.cyan}${'═'.repeat(55)}${C.reset}\n`);
    req.flash('success', 'Account created! Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not create account.');
    res.redirect('/signup');
  }
};

// GET /forgot-password
exports.getForgot = (req, res) => {
  res.render('auth/forgot-password', { title: 'Forgot Password' });
};

// POST /forgot-password
exports.postForgot = (req, res) => {
  req.flash('success', 'If that email exists, a reset link has been sent.');
  res.redirect('/login');
};

// GET /logout
exports.logout = (req, res) => {
  const name = req.session?.user?.name || 'Unknown';
  console.log(`\n${C.bright}${C.yellow}${'═'.repeat(55)}${C.reset}`);
  console.log(`${C.bright}${C.yellow}🚪  USER LOGGED OUT${C.reset}`);
  console.log(`${C.gray}  Name   :${C.reset} ${name}`);
  console.log(`${C.gray}  Time   :${C.reset} ${ts()}`);
  console.log(`${C.bright}${C.yellow}${'═'.repeat(55)}${C.reset}\n`);
  req.session.destroy();
  res.redirect('/login');
};

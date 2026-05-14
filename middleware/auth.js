// Redirect to login if not authenticated
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  req.flash('error', 'Please log in to access this page.');
  res.redirect('/login');
}

// Redirect to dashboard if already logged in
function redirectIfAuth(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  next();
}

// Only allow administrators
function requireAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'Administrator') {
    return next();
  }
  req.flash('error', 'Access denied. Administrators only.');
  res.redirect('/dashboard');
}

module.exports = { requireAuth, redirectIfAuth, requireAdmin };

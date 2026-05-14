require('dotenv').config();
const express    = require('express');
const path       = require('path');
const session    = require('express-session');
const flash      = require('connect-flash');
const override   = require('method-override');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── ANSI COLORS ────────────────────────────────────────────
const C = {
  reset: '\x1b[0m', bright: '\x1b[1m',
  green: '\x1b[32m', cyan: '\x1b[36m', yellow: '\x1b[33m',
  red: '\x1b[31m', blue: '\x1b[34m', magenta: '\x1b[35m',
  gray: '\x1b[90m', white: '\x1b[37m',
};

const PAGE_LABELS = {
  '/login':                  { label: 'Login Page',            icon: '🔐', color: C.cyan    },
  '/signup':                 { label: 'Sign Up Page',          icon: '📝', color: C.cyan    },
  '/forgot-password':        { label: 'Forgot Password',       icon: '🔑', color: C.cyan    },
  '/logout':                 { label: 'Logout',                icon: '🚪', color: C.yellow  },
  '/dashboard':              { label: 'Dashboard',             icon: '📊', color: C.green   },
  '/users':                  { label: 'User Management',       icon: '👥', color: C.blue    },
  '/household':              { label: 'Household Profiling',   icon: '🏠', color: C.blue    },
  '/residents':              { label: 'Resident Records',      icon: '👤', color: C.blue    },
  '/health/immunization':    { label: 'Immunization',          icon: '💉', color: C.magenta },
  '/health/operation-timbang':{ label: 'Operation Timbang',   icon: '⚖️ ', color: C.magenta },
  '/health/vitamin-a':       { label: 'Vitamin A',             icon: '🌟', color: C.magenta },
  '/health/deworming':       { label: 'Deworming',             icon: '💊', color: C.magenta },
  '/health/risk-assessment': { label: 'Risk Assessment',       icon: '⚠️ ', color: C.magenta },
  '/health/family-planning': { label: 'Family Planning',       icon: '❤️ ', color: C.magenta },
};

function ts() {
  return new Date().toLocaleString('en-PH', {
    year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true
  });
}

function logVisit(req, label, icon, color) {
  const line = '─'.repeat(55);
  console.log(`${C.gray}${line}${C.reset}`);
  console.log(`${C.bright}${color}${icon}  PAGE VISIT${C.reset}`);
  console.log(`${C.gray}  Time   :${C.reset} ${ts()}`);
  console.log(`${C.gray}  Page   :${C.reset} ${C.bright}${color}${label}${C.reset}`);
  console.log(`${C.gray}  Method :${C.reset} ${req.method === 'POST' ? C.yellow : C.white}${req.method}${C.reset}`);
  console.log(`${C.gray}  Route  :${C.reset} ${req.originalUrl}`);
  console.log(`${C.gray}  User   :${C.reset} ${req.session?.user?.name || 'Guest'}`);
  console.log(`${C.gray}${line}${C.reset}`);
}

// ─── MIDDLEWARE ──────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(override('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'lmlinga_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 hours
}));

app.use(flash());

// Make flash messages & session user available in ALL views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error   = req.flash('error');
  res.locals.user    = req.session.user || null;
  next();
});

// ─── VIEW ENGINE ────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── PAGE LOGGER ────────────────────────────────────────────
app.use((req, res, next) => {
  const skip = ['/css','/js','/img','/favicon'];
  if (skip.some(s => req.originalUrl.startsWith(s))) return next();
  const found = PAGE_LABELS[req.path];
  if (found) {
    logVisit(req, found.label, found.icon, found.color);
  } else {
    console.log(`${C.gray}─────────────────────────────────────────────────────${C.reset}`);
    console.log(`${C.bright}${C.blue}📄  PAGE VISIT${C.reset}`);
    console.log(`${C.gray}  Time   :${C.reset} ${ts()}`);
    console.log(`${C.gray}  Route  :${C.reset} ${req.originalUrl}`);
    console.log(`${C.gray}  User   :${C.reset} ${req.session?.user?.name || 'Guest'}`);
    console.log(`${C.gray}─────────────────────────────────────────────────────${C.reset}`);
  }
  next();
});

// ─── ROUTES ─────────────────────────────────────────────────
app.use('/',          require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/users',     require('./routes/users'));
app.use('/household', require('./routes/household'));
app.use('/residents', require('./routes/residents'));
app.use('/health',    require('./routes/health'));

// ─── 404 ────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// ─── START ──────────────────────────────────────────────────
app.listen(PORT, () => {
  const line = '═'.repeat(55);
  console.log(`\n${C.bright}${C.green}${line}${C.reset}`);
  console.log(`${C.bright}${C.green}🏥  LMLinga Barangay Health System${C.reset}`);
  console.log(`${C.gray}  URL    : ${C.reset}${C.bright}http://localhost:${PORT}${C.reset}`);
  console.log(`${C.gray}  Mode   : ${C.reset}Development`);
  console.log(`${C.gray}  Time   : ${C.reset}${ts()}`);
  console.log(`${C.bright}${C.green}${line}${C.reset}\n`);
});

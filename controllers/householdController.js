const db = require('../config/db');

// GET /household
exports.index = async (req, res) => {
  try {
    const [households] = await db.query(`
      SELECT h.*, COUNT(r.id) AS member_count
      FROM households h
      LEFT JOIN residents r ON r.household_id = h.id
      GROUP BY h.id ORDER BY h.created_at DESC
    `);
    const [[{ total }]]    = await db.query('SELECT COUNT(*) AS total FROM households');
    const [[{ fourps }]]   = await db.query('SELECT COUNT(*) AS fourps FROM households WHERE is_4ps = 1');
    const [[{ members }]]  = await db.query('SELECT COUNT(*) AS members FROM residents WHERE status="Active"');
    res.render('modules/household', { title: 'Household Profiling', active: 'household', households, stats: { total, fourps, members } });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load households.');
    res.redirect('/dashboard');
  }
};

// GET /household/profile/:id
exports.profile = async (req, res) => {
  try {
    const [[household]] = await db.query('SELECT * FROM households WHERE id = ?', [req.params.id]);
    if (!household) { req.flash('error', 'Household not found.'); return res.redirect('/household'); }
    const [members] = await db.query(
      'SELECT * FROM residents WHERE household_id = ? ORDER BY last_name', [req.params.id]);
    res.render('modules/household-profile', { title: 'Household Profile', active: 'household', household, members });
  } catch (err) {
    req.flash('error', 'Failed to load household profile.');
    res.redirect('/household');
  }
};

// POST /household
exports.create = async (req, res) => {
  const { hh_number, head_name, address, purok, housing_type, is_4ps } = req.body;
  try {
    await db.query(
      'INSERT INTO households (hh_number,head_name,address,purok,housing_type,is_4ps) VALUES (?,?,?,?,?,?)',
      [hh_number, head_name, address, purok, housing_type, is_4ps === 'on' ? 1 : 0]
    );
    req.flash('success', `Household "${hh_number}" added successfully.`);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') req.flash('error', 'Household number already exists.');
    else req.flash('error', 'Failed to add household.');
  }
  res.redirect('/household');
};

// POST /household/:id/edit
exports.update = async (req, res) => {
  const { head_name, address, purok, housing_type, is_4ps } = req.body;
  try {
    await db.query(
      'UPDATE households SET head_name=?,address=?,purok=?,housing_type=?,is_4ps=? WHERE id=?',
      [head_name, address, purok, housing_type, is_4ps === 'on' ? 1 : 0, req.params.id]
    );
    req.flash('success', 'Household updated.');
  } catch (err) {
    req.flash('error', 'Failed to update household.');
  }
  res.redirect('/household');
};

// DELETE /household/:id
exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM households WHERE id = ?', [req.params.id]);
    req.flash('success', 'Household deleted.');
  } catch (err) {
    req.flash('error', 'Failed to delete household.');
  }
  res.redirect('/household');
};

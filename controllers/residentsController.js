const db = require('../config/db');

// GET /residents
exports.index = async (req, res) => {
  try {
    const [residents] = await db.query(`
      SELECT r.*, h.hh_number,
        TIMESTAMPDIFF(YEAR, r.birthdate, CURDATE()) AS age
      FROM residents r
      LEFT JOIN households h ON r.household_id = h.id
      WHERE r.status != 'Deceased'
      ORDER BY r.last_name ASC
    `);
    const [households] = await db.query('SELECT id, hh_number, head_name FROM households ORDER BY hh_number');
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM residents WHERE status="Active"');
    res.render('modules/residents', { title: 'Resident Records', active: 'residents', residents, households, total });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load residents.');
    res.redirect('/dashboard');
  }
};

// GET /residents/profile/:id
exports.profile = async (req, res) => {
  try {
    const [[resident]] = await db.query(`
      SELECT r.*, h.hh_number,
        TIMESTAMPDIFF(YEAR, r.birthdate, CURDATE()) AS age
      FROM residents r
      LEFT JOIN households h ON r.household_id = h.id
      WHERE r.id = ?
    `, [req.params.id]);
    if (!resident) { req.flash('error', 'Resident not found.'); return res.redirect('/residents'); }

    const [immunizations]   = await db.query('SELECT * FROM immunization WHERE resident_id = ? ORDER BY date_given DESC', [req.params.id]);
    const [timbangRecords]  = await db.query('SELECT * FROM operation_timbang WHERE resident_id = ? ORDER BY date_measured DESC LIMIT 5', [req.params.id]);
    const [vitaminA]        = await db.query('SELECT * FROM vitamin_a WHERE resident_id = ? ORDER BY year DESC', [req.params.id]);
    const [deworming]       = await db.query('SELECT * FROM deworming WHERE resident_id = ? ORDER BY date_given DESC', [req.params.id]);
    const [riskAssessments] = await db.query('SELECT * FROM risk_assessment WHERE resident_id = ? ORDER BY date_assessed DESC', [req.params.id]);
    const [fp]              = await db.query('SELECT * FROM family_planning WHERE resident_id = ? ORDER BY start_date DESC', [req.params.id]);

    res.render('modules/resident-profile', {
      title: `${resident.first_name} ${resident.last_name}`,
      active: 'residents', resident,
      immunizations, timbangRecords, vitaminA, deworming, riskAssessments, fp
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load resident profile.');
    res.redirect('/residents');
  }
};

// POST /residents
exports.create = async (req, res) => {
  const { resident_no, household_id, last_name, first_name, middle_name,
          birthdate, sex, civil_status, purok, address, occupation,
          religion, philhealth_no, is_4ps } = req.body;
  try {
    await db.query(`
      INSERT INTO residents
        (resident_no,household_id,last_name,first_name,middle_name,birthdate,
         sex,civil_status,purok,address,occupation,religion,philhealth_no,is_4ps)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `, [resident_no, household_id || null, last_name, first_name, middle_name,
        birthdate, sex, civil_status, purok, address, occupation,
        religion, philhealth_no, is_4ps === 'on' ? 1 : 0]);
    req.flash('success', `Resident ${first_name} ${last_name} added.`);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') req.flash('error', 'Resident number already exists.');
    else req.flash('error', 'Failed to add resident.');
  }
  res.redirect('/residents');
};

// POST /residents/:id/edit
exports.update = async (req, res) => {
  const { last_name, first_name, middle_name, birthdate, sex,
          civil_status, purok, address, occupation, religion,
          philhealth_no, household_id, status } = req.body;
  try {
    await db.query(`
      UPDATE residents SET
        last_name=?,first_name=?,middle_name=?,birthdate=?,sex=?,
        civil_status=?,purok=?,address=?,occupation=?,religion=?,
        philhealth_no=?,household_id=?,status=?
      WHERE id=?
    `, [last_name, first_name, middle_name, birthdate, sex,
        civil_status, purok, address, occupation, religion,
        philhealth_no, household_id || null, status, req.params.id]);
    req.flash('success', 'Resident updated.');
  } catch (err) {
    req.flash('error', 'Failed to update resident.');
  }
  res.redirect(`/residents/profile/${req.params.id}`);
};

// DELETE /residents/:id
exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM residents WHERE id = ?', [req.params.id]);
    req.flash('success', 'Resident record deleted.');
  } catch (err) {
    req.flash('error', 'Failed to delete resident.');
  }
  res.redirect('/residents');
};

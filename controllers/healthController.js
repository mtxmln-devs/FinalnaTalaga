const db = require('../config/db');

async function getResidents() {
  const [rows] = await db.query(`
    SELECT 
      id,
      CONCAT(last_name, ', ', first_name) AS full_name
    FROM residents
    ORDER BY last_name ASC
  `);

  console.log(rows);

  return rows;
}

// ─── IMMUNIZATION ──────────────────────────────────────────
exports.getImmunization = async (req, res) => {
  try {
    const [records] = await db.query(`
      SELECT i.*, CONCAT(r.last_name,', ',r.first_name) AS full_name,
        TIMESTAMPDIFF(YEAR, r.birthdate, CURDATE()) AS age
      FROM immunization i JOIN residents r ON i.resident_id = r.id
      ORDER BY i.date_given DESC
    `);
    const [[{ total }]]     = await db.query('SELECT COUNT(DISTINCT resident_id) AS total FROM immunization');
    const residents = await getResidents();
    res.render('modules/health/immunization', { title:'Immunization', active:'immunization', records, stats:{ total }, residents });
  } catch (err) { console.error(err); res.redirect('/dashboard'); }
};

exports.createImmunization = async (req, res) => {
  const { resident_id, vaccine, dose, date_given, next_schedule, given_by, remarks } = req.body;
  try {
    await db.query('INSERT INTO immunization (resident_id,vaccine,dose,date_given,next_schedule,given_by,remarks) VALUES (?,?,?,?,?,?,?)',
      [resident_id, vaccine, dose, date_given, next_schedule || null, given_by, remarks]);
    req.flash('success', 'Immunization record added.');
  } catch (err) { req.flash('error', 'Failed to add record.'); }
  res.redirect('/health/immunization');
};

exports.updateImmunization = async (req, res) => {

  const {
    resident_id,
    vaccine,
    dose,
    date_given,
    next_schedule,
    given_by,
    remarks
  } = req.body;

  try {

    await db.query(`
      UPDATE immunization SET
        resident_id=?,
        vaccine=?,
        dose=?,
        date_given=?,
        next_schedule=?,
        given_by=?,
        remarks=?
      WHERE id=?
    `, [
      resident_id,
      vaccine,
      dose,
      date_given,
      next_schedule || null,
      given_by,
      remarks,
      req.params.id
    ]);

    req.flash('success', 'Immunization record updated.');

  } catch (err) {

    console.log(err);
    req.flash('error', 'Failed to update record.');

  }

  res.redirect('/health/immunization');
};

exports.deleteImmunization = async (req, res) => {
  try { await db.query('DELETE FROM immunization WHERE id=?', [req.params.id]); req.flash('success','Record deleted.'); }
  catch (err) { req.flash('error','Failed to delete.'); }
  res.redirect('/health/immunization');
};

// ─── OPERATION TIMBANG ────────────────────────────────────
exports.getTimbang = async (req, res) => {
  try {
    const [records] = await db.query(`
      SELECT ot.*, CONCAT(r.last_name,', ',r.first_name) AS full_name,
        TIMESTAMPDIFF(YEAR, r.birthdate, CURDATE()) AS age, r.sex
      FROM operation_timbang ot JOIN residents r ON ot.resident_id = r.id
      ORDER BY ot.date_measured DESC
    `);
    const [[{ total }]]        = await db.query('SELECT COUNT(*) AS total FROM operation_timbang');
    const [[{ normal }]]       = await db.query('SELECT COUNT(*) AS normal FROM operation_timbang WHERE status="Normal"');
    const [[{ underweight }]]  = await db.query('SELECT COUNT(*) AS underweight FROM operation_timbang WHERE status="Underweight"');
    const [[{ severe }]]       = await db.query('SELECT COUNT(*) AS severe FROM operation_timbang WHERE status="Severely Underweight"');
    const residents = await getResidents();
    res.render('modules/health/operation-timbang', {
      title:'Operation Timbang', active:'timbang', records, residents,
      stats:{ total, normal, underweight, severe }
    });
  } catch (err) { console.error(err); res.redirect('/dashboard'); }
};

exports.createTimbang = async (req, res) => {
  const { resident_id, weight_kg, height_cm, date_measured, measured_by, remarks } = req.body;
  const bmi = (weight_kg / ((height_cm / 100) ** 2)).toFixed(2);
  let status = 'Normal';
  if (bmi < 16) status = 'Severely Underweight';
  else if (bmi < 18.5) status = 'Underweight';
  else if (bmi >= 25 && bmi < 30) status = 'Overweight';
  else if (bmi >= 30) status = 'Obese';
  try {
    await db.query('INSERT INTO operation_timbang (resident_id,weight_kg,height_cm,bmi,status,date_measured,measured_by,remarks) VALUES (?,?,?,?,?,?,?,?)',
      [resident_id, weight_kg, height_cm, bmi, status, date_measured, measured_by, remarks]);
    req.flash('success', `Timbang record added. BMI: ${bmi} — ${status}`);
  } catch (err) { req.flash('error', 'Failed to add record.'); }
  res.redirect('/health/operation-timbang');
};

exports.updateTimbang = async (req, res) => {

  const {
    resident_id,
    weight_kg,
    height_cm,
    date_measured,
    measured_by,
    remarks
  } = req.body;

  const bmi = (weight_kg / ((height_cm / 100) ** 2)).toFixed(2);

  let status = 'Normal';

  if (bmi < 16) status = 'Severely Underweight';
  else if (bmi < 18.5) status = 'Underweight';
  else if (bmi >= 25 && bmi < 30) status = 'Overweight';
  else if (bmi >= 30) status = 'Obese';

  try {

    await db.query(`
      UPDATE operation_timbang SET
        resident_id=?,
        weight_kg=?,
        height_cm=?,
        bmi=?,
        status=?,
        date_measured=?,
        measured_by=?,
        remarks=?
      WHERE id=?
    `, [
      resident_id,
      weight_kg,
      height_cm,
      bmi,
      status,
      date_measured,
      measured_by,
      remarks,
      req.params.id
    ]);

    req.flash('success', 'Timbang updated.');

  } catch (err) {

    console.log(err);
    req.flash('error', 'Failed to update.');

  }

  res.redirect('/health/operation-timbang');
};

exports.deleteTimbang = async (req, res) => {
  try { await db.query('DELETE FROM operation_timbang WHERE id=?', [req.params.id]); req.flash('success','Record deleted.'); }
  catch (err) { req.flash('error','Failed to delete.'); }
  res.redirect('/health/operation-timbang');
};

// ─── VITAMIN A ────────────────────────────────────────────
exports.getVitaminA = async (req, res) => {
  try {
    const [records] = await db.query(`
      SELECT va.*, CONCAT(r.last_name,', ',r.first_name) AS full_name,
        TIMESTAMPDIFF(YEAR, r.birthdate, CURDATE()) AS age
      FROM vitamin_a va JOIN residents r ON va.resident_id = r.id
      ORDER BY va.year DESC, va.round
    `);
    const [[{ total }]]  = await db.query('SELECT COUNT(*) AS total FROM vitamin_a WHERE status="Given"');
    const [[{ pending }]]= await db.query('SELECT COUNT(*) AS pending FROM vitamin_a WHERE status="Pending"');
    const residents = await getResidents();
    res.render('modules/health/vitamin-a', { title:'Vitamin A', active:'vitamin-a', records, residents, stats:{ total, pending } });
  } catch (err) { console.error(err); res.redirect('/dashboard'); }
};

exports.createVitaminA = async (req, res) => {
  const { resident_id, dosage, round, date_given, given_by, year } = req.body;
  const status = date_given ? 'Given' : 'Pending';
  try {
    await db.query('INSERT INTO vitamin_a (resident_id,dosage,round,date_given,given_by,status,year) VALUES (?,?,?,?,?,?,?)',
      [resident_id, dosage, round, date_given || null, given_by, status, year]);
    req.flash('success', 'Vitamin A record added.');
  } catch (err) { req.flash('error', 'Failed to add record.'); }
  res.redirect('/health/vitamin-a');
};

exports.updateVitaminA = async (req, res) => {

  const {
    resident_id,
    dosage,
    round,
    date_given,
    given_by,
    year
  } = req.body;

  const status = date_given ? 'Given' : 'Pending';

  try {

    await db.query(`
      UPDATE vitamin_a SET
        resident_id=?,
        dosage=?,
        round=?,
        date_given=?,
        given_by=?,
        status=?,
        year=?
      WHERE id=?
    `, [
      resident_id,
      dosage,
      round,
      date_given || null,
      given_by,
      status,
      year,
      req.params.id
    ]);

    req.flash('success', 'Vitamin A updated.');

  } catch (err) {

    console.log(err);
    req.flash('error', 'Failed to update.');

  }

  res.redirect('/health/vitamin-a');
};

exports.deleteVitaminA = async (req, res) => {
  try { await db.query('DELETE FROM vitamin_a WHERE id=?', [req.params.id]); req.flash('success','Record deleted.'); }
  catch (err) { req.flash('error','Failed to delete.'); }
  res.redirect('/health/vitamin-a');
};

// ─── DEWORMING ────────────────────────────────────────────
exports.getDeworming = async (req, res) => {
  try {
    const [records] = await db.query(`
      SELECT d.*, CONCAT(r.last_name,', ',r.first_name) AS full_name,
        TIMESTAMPDIFF(YEAR, r.birthdate, CURDATE()) AS age
      FROM deworming d JOIN residents r ON d.resident_id = r.id
      ORDER BY d.date_given DESC
    `);
    const [[{ total }]]    = await db.query('SELECT COUNT(*) AS total FROM deworming');
    const [[{ reactions }]]= await db.query('SELECT COUNT(*) AS reactions FROM deworming WHERE adverse_reaction != "None"');
    const residents = await getResidents();
    res.render('modules/health/deworming', { title:'Deworming', active:'deworming', records, residents, stats:{ total, reactions } });
  } catch (err) { console.error(err); res.redirect('/dashboard'); }
};

exports.createDeworming = async (req, res) => {
  const { resident_id, drug, dosage, round, date_given, given_by, adverse_reaction } = req.body;
  try {
    await db.query('INSERT INTO deworming (resident_id,drug,dosage,round,date_given,given_by,adverse_reaction) VALUES (?,?,?,?,?,?,?)',
      [resident_id, drug, dosage, round, date_given, given_by, adverse_reaction || 'None']);
    req.flash('success', 'Deworming record added.');
  } catch (err) { req.flash('error', 'Failed to add record.'); }
  res.redirect('/health/deworming');
};

exports.updateDeworming = async (req, res) => {

  const {
    resident_id,
    drug,
    dosage,
    round,
    date_given,
    given_by,
    adverse_reaction
  } = req.body;

  try {

    await db.query(`
      UPDATE deworming SET
        resident_id=?,
        drug=?,
        dosage=?,
        round=?,
        date_given=?,
        given_by=?,
        adverse_reaction=?
      WHERE id=?
    `, [
      resident_id,
      drug,
      dosage,
      round,
      date_given,
      given_by,
      adverse_reaction || 'None',
      req.params.id
    ]);

    req.flash('success', 'Deworming updated.');

  } catch (err) {

    console.log(err);
    req.flash('error', 'Failed to update.');

  }

  res.redirect('/health/deworming');
};

exports.deleteDeworming = async (req, res) => {
  try { await db.query('DELETE FROM deworming WHERE id=?', [req.params.id]); req.flash('success','Record deleted.'); }
  catch (err) { req.flash('error','Failed to delete.'); }
  res.redirect('/health/deworming');
};

// ─── RISK ASSESSMENT ──────────────────────────────────────
exports.getRiskAssessment = async (req, res) => {
  try {
    const [records] = await db.query(`
      SELECT ra.*, CONCAT(r.last_name,', ',r.first_name) AS full_name,
        TIMESTAMPDIFF(YEAR, r.birthdate, CURDATE()) AS age
      FROM risk_assessment ra JOIN residents r ON ra.resident_id = r.id
      ORDER BY ra.date_assessed DESC
    `);
    const [[{ total }]]    = await db.query('SELECT COUNT(*) AS total FROM risk_assessment');
    const [[{ low }]]      = await db.query('SELECT COUNT(*) AS low FROM risk_assessment WHERE risk_level="Low"');
    const [[{ moderate }]] = await db.query('SELECT COUNT(*) AS moderate FROM risk_assessment WHERE risk_level="Moderate"');
    const [[{ high }]]     = await db.query('SELECT COUNT(*) AS high FROM risk_assessment WHERE risk_level="High"');
    const residents = await getResidents();
    res.render('modules/health/risk-assessment', { title:'Risk Assessment', active:'risk-assessment', records, residents, stats:{ total, low, moderate, high } });
  } catch (err) { console.error(err); res.redirect('/dashboard'); }
};

exports.createRiskAssessment = async (req, res) => {
  const { resident_id, category, risk_level, risk_factors, date_assessed, next_followup, recommendations, assessed_by } = req.body;
  try {
    await db.query('INSERT INTO risk_assessment (resident_id,category,risk_level,risk_factors,date_assessed,next_followup,recommendations,assessed_by) VALUES (?,?,?,?,?,?,?,?)',
      [resident_id, category, risk_level, risk_factors, date_assessed, next_followup || null, recommendations, assessed_by]);
    req.flash('success', 'Risk assessment recorded.');
  } catch (err) { req.flash('error', 'Failed to add record.'); }
  res.redirect('/health/risk-assessment');
};

exports.updateRiskAssessment = async (req, res) => {

  const {
    resident_id,
    category,
    risk_level,
    risk_factors,
    date_assessed,
    next_followup,
    recommendations,
    assessed_by
  } = req.body;

  try {

    await db.query(`
      UPDATE risk_assessment SET
        resident_id=?,
        category=?,
        risk_level=?,
        risk_factors=?,
        date_assessed=?,
        next_followup=?,
        recommendations=?,
        assessed_by=?
      WHERE id=?
    `, [
      resident_id,
      category,
      risk_level,
      risk_factors,
      date_assessed,
      next_followup || null,
      recommendations,
      assessed_by,
      req.params.id
    ]);

    req.flash('success', 'Risk assessment updated.');

  } catch (err) {

    console.log(err);
    req.flash('error', 'Failed to update.');

  }

  res.redirect('/health/risk-assessment');
};

exports.deleteRiskAssessment = async (req, res) => {
  try { await db.query('DELETE FROM risk_assessment WHERE id=?', [req.params.id]); req.flash('success','Record deleted.'); }
  catch (err) { req.flash('error','Failed to delete.'); }
  res.redirect('/health/risk-assessment');
};

// ─── FAMILY PLANNING ──────────────────────────────────────
exports.getFamilyPlanning = async (req, res) => {
  try {

    const [records] = await db.query(`
      SELECT fp.*, CONCAT(r.last_name,', ',r.first_name) AS full_name,
        TIMESTAMPDIFF(YEAR, r.birthdate, CURDATE()) AS age
      FROM family_planning fp
      JOIN residents r ON fp.resident_id = r.id
      ORDER BY fp.start_date DESC
    `);

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) AS total FROM family_planning WHERE status="Active"'
    );

    const [[{ modern }]] = await db.query(
      'SELECT COUNT(*) AS modern FROM family_planning WHERE method_type="Modern" AND status="Active"'
    );

const [[{ naturalCount }]] = await db.query(
  'SELECT COUNT(*) AS naturalCount FROM family_planning WHERE method_type="Natural" AND status="Active"'
);

    const [[{ dropout }]] = await db.query(
      'SELECT COUNT(*) AS dropout FROM family_planning WHERE status="Dropout"'
    );

    const residents = await getResidents();

    res.render('modules/health/family-planning', {
      title:'Family Planning',
      active:'family-planning',
      records,
      residents,
      stats:{ total, modern, natural: naturalCount, dropout },
      error: null
    });

  } catch (err) {

    console.log("FAMILY PLANNING ERROR:");
    console.log(err);

    res.render('modules/health/family-planning', {
      title: 'Family Planning',
      active: 'family-planning',
      records: [],
      residents: [],
      stats: { total: 0, modern: 0, natural: 0, dropout: 0 },
      error: 'An error occurred while loading Family Planning data.'
    });

  }
};

exports.createFamilyPlanning = async (req, res) => {
  const { resident_id, method, method_type, start_date, next_visit, given_by, status, remarks } = req.body;
  try {
    await db.query('INSERT INTO family_planning (resident_id,method,method_type,start_date,next_visit,given_by,status,remarks) VALUES (?,?,?,?,?,?,?,?)',
      [resident_id, method, method_type, start_date, next_visit || null, given_by, status || 'Active', remarks]);
    req.flash('success', 'Family planning record added.');
  } catch (err) { req.flash('error', 'Failed to add record.'); }
  res.redirect('/health/family-planning');
};

exports.updateFamilyPlanning = async (req, res) => {

  const {
    resident_id,
    method,
    method_type,
    start_date,
    next_visit,
    given_by,
    status,
    remarks
  } = req.body;

  try {

    await db.query(`
      UPDATE family_planning SET
        resident_id=?,
        method=?,
        method_type=?,
        start_date=?,
        next_visit=?,
        given_by=?,
        status=?,
        remarks=?
      WHERE id=?
    `, [
      resident_id,
      method,
      method_type,
      start_date,
      next_visit || null,
      given_by,
      status,
      remarks,
      req.params.id
    ]);

    req.flash('success', 'Family planning updated.');

  } catch (err) {

    console.log(err);
    req.flash('error', 'Failed to update.');

  }

  res.redirect('/health/family-planning');
};

exports.deleteFamilyPlanning = async (req, res) => {
  try { await db.query('DELETE FROM family_planning WHERE id=?', [req.params.id]); req.flash('success','Record deleted.'); }
  catch (err) { req.flash('error','Failed to delete.'); }
  res.redirect('/health/family-planning');
};

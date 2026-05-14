const db = require('../config/db');

exports.getDashboard = async (req, res) => {
  try {
    const [[{ totalResidents }]]  = await db.query('SELECT COUNT(*) AS totalResidents FROM residents WHERE status = "Active"');
    const [[{ totalHouseholds }]] = await db.query('SELECT COUNT(*) AS totalHouseholds FROM households');
    const [[{ immunized }]]       = await db.query('SELECT COUNT(DISTINCT resident_id) AS immunized FROM immunization WHERE MONTH(date_given) = MONTH(CURDATE())');
    const [[{ timbangRecords }]]  = await db.query('SELECT COUNT(*) AS timbangRecords FROM operation_timbang');
    const [[{ malnourished }]]    = await db.query('SELECT COUNT(*) AS malnourished FROM operation_timbang WHERE status = "Severely Underweight"');
    const [[{ atRisk }]]          = await db.query('SELECT COUNT(*) AS atRisk FROM risk_assessment WHERE risk_level = "High"');
    const [[{ fpAcceptors }]]     = await db.query('SELECT COUNT(*) AS fpAcceptors FROM family_planning WHERE status = "Active"');

    const [recentActivity] = await db.query(`
      SELECT r.first_name, r.last_name, 'Immunization' AS service, i.date_given AS date
      FROM immunization i JOIN residents r ON i.resident_id = r.id
      UNION ALL
      SELECT r.first_name, r.last_name, 'Op. Timbang', ot.date_measured
      FROM operation_timbang ot JOIN residents r ON ot.resident_id = r.id
      UNION ALL
      SELECT r.first_name, r.last_name, 'Family Planning', fp.start_date
      FROM family_planning fp JOIN residents r ON fp.resident_id = r.id
      ORDER BY date DESC LIMIT 8
    `);

    res.render('dashboard/index', {
      title: 'Dashboard', active: 'dashboard',
      stats: { totalResidents, totalHouseholds, immunized, timbangRecords, malnourished, atRisk, fpAcceptors },
      recentActivity
    });
  } catch (err) {
    console.error(err);
    res.render('dashboard/index', {
      title: 'Dashboard', active: 'dashboard',
      stats: { totalResidents:0, totalHouseholds:0, immunized:0, timbangRecords:0, malnourished:0, atRisk:0, fpAcceptors:0 },
      recentActivity: []
    });
  }
};

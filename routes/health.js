const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/healthController');
const { requireAuth } = require('../middleware/auth');

router.get('/', (req, res) => res.redirect('/health/immunization'));

router.get('/immunization',     requireAuth, ctrl.getImmunization);
router.post('/immunization',    requireAuth, ctrl.createImmunization);
router.delete('/immunization/:id', requireAuth, ctrl.deleteImmunization);

router.get('/operation-timbang',     requireAuth, ctrl.getTimbang);
router.post('/operation-timbang',    requireAuth, ctrl.createTimbang);
router.delete('/operation-timbang/:id', requireAuth, ctrl.deleteTimbang);

router.get('/vitamin-a',     requireAuth, ctrl.getVitaminA);
router.post('/vitamin-a',    requireAuth, ctrl.createVitaminA);
router.delete('/vitamin-a/:id', requireAuth, ctrl.deleteVitaminA);

router.get('/deworming',     requireAuth, ctrl.getDeworming);
router.post('/deworming',    requireAuth, ctrl.createDeworming);
router.delete('/deworming/:id', requireAuth, ctrl.deleteDeworming);

router.get('/risk-assessment',     requireAuth, ctrl.getRiskAssessment);
router.post('/risk-assessment',    requireAuth, ctrl.createRiskAssessment);
router.delete('/risk-assessment/:id', requireAuth, ctrl.deleteRiskAssessment);

router.get('/family-planning',     requireAuth, ctrl.getFamilyPlanning);
router.post('/family-planning',    requireAuth, ctrl.createFamilyPlanning);
router.delete('/family-planning/:id', requireAuth, ctrl.deleteFamilyPlanning);

module.exports = router;

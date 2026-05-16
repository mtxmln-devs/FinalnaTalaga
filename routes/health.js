const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/healthController');
const { requireAuth } = require('../middleware/auth');

router.get('/', (req, res) => res.redirect('/health/immunization'));

router.get('/immunization',     requireAuth, ctrl.getImmunization);
router.post('/immunization',    requireAuth, ctrl.createImmunization);
router.post('/immunization/:id/edit', requireAuth, ctrl.updateImmunization);
router.delete('/immunization/:id', requireAuth, ctrl.deleteImmunization);

router.get('/operation-timbang',     requireAuth, ctrl.getTimbang);
router.post('/operation-timbang',    requireAuth, ctrl.createTimbang);
router.post('/operation-timbang/:id/edit', requireAuth, ctrl.updateTimbang);
router.delete('/operation-timbang/:id', requireAuth, ctrl.deleteTimbang);

router.get('/vitamin-a',     requireAuth, ctrl.getVitaminA);
router.post('/vitamin-a',    requireAuth, ctrl.createVitaminA);
router.post('/vitamin-a/:id/edit', requireAuth, ctrl.updateVitaminA);
router.delete('/vitamin-a/:id', requireAuth, ctrl.deleteVitaminA);

router.get('/deworming',     requireAuth, ctrl.getDeworming);
router.post('/deworming',    requireAuth, ctrl.createDeworming);
router.post('/deworming/:id/edit', requireAuth, ctrl.updateDeworming);
router.delete('/deworming/:id', requireAuth, ctrl.deleteDeworming);

router.get('/risk-assessment',     requireAuth, ctrl.getRiskAssessment);
router.post('/risk-assessment',    requireAuth, ctrl.createRiskAssessment);
router.post('/risk-assessment/:id/edit', requireAuth, ctrl.updateRiskAssessment);
router.delete('/risk-assessment/:id', requireAuth, ctrl.deleteRiskAssessment);

router.get('/family-planning',     requireAuth, ctrl.getFamilyPlanning);
router.post('/family-planning',    requireAuth, ctrl.createFamilyPlanning);
router.post('/family-planning/:id/edit', requireAuth, ctrl.updateFamilyPlanning);
router.delete('/family-planning/:id', requireAuth, ctrl.deleteFamilyPlanning);

module.exports = router;

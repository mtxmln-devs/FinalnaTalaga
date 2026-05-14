const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/residentsController');
const { requireAuth } = require('../middleware/auth');

router.get('/',             requireAuth, ctrl.index);
router.get('/profile/:id',  requireAuth, ctrl.profile);
router.post('/',            requireAuth, ctrl.create);
router.post('/:id/edit',    requireAuth, ctrl.update);
router.delete('/:id',       requireAuth, ctrl.delete);
module.exports = router;

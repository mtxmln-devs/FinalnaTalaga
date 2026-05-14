const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/usersController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/',           requireAuth, requireAdmin, ctrl.index);
router.post('/',          requireAuth, requireAdmin, ctrl.create);
router.post('/:id/edit',  requireAuth, requireAdmin, ctrl.update);
router.delete('/:id',     requireAuth, requireAdmin, ctrl.delete);
module.exports = router;

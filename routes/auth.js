const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/authController');
const { redirectIfAuth } = require('../middleware/auth');

router.get('/',                ctrl.getLogin);
router.get('/login',           redirectIfAuth, ctrl.getLogin);
router.post('/login',          ctrl.postLogin);
router.get('/signup',          redirectIfAuth, ctrl.getSignup);
router.post('/signup',         ctrl.postSignup);
router.get('/forgot-password', ctrl.getForgot);
router.post('/forgot-password',ctrl.postForgot);
router.get('/logout',          ctrl.logout);

module.exports = router;

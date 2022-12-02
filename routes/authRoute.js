const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/signup').post(authController.createUser);
router.route('/login').post(authController.loginUser);
router.route('/resetPass').post(authController.resetPass);
router.route('/test').post(authMiddleware,authController.test);

module.exports = router;
// action="forgot-password"

const express = require('express');
const router = express.Router();
const preventUnprotectedAccess = require('../middleware/preventUnprotectedAccess');
const forgotPassword = require('../controllers/forgotPassword');
const accountVerifier = require('../middleware/accountVerifier');
const tokenVerifier = require('../middleware/tokenVerifier');
const changePassword = require('../controllers/changePassword');

router.get('/',preventUnprotectedAccess.preventAuthenticatedAccess, (req, res) => {
  res.render('authEmail' , { });
});

router.get('/:token' , tokenVerifier.resetPasswordAccesCheck , (req , res) => {
  res.render('resetPassword' , { token : req.token});
});

router.post('/' , preventUnprotectedAccess.preventAuthenticatedAccess ,accountVerifier.nextIfExist,forgotPassword.generateForgotPasswordToken  , forgotPassword.storeForgotPasswordToken, forgotPassword.sendForgotPasswordLinkMail );

router.post('/reset' , changePassword.reset);

module.exports = router;
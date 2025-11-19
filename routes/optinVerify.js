const express = require('express');
const router = express.Router();
const optinVerifyController = require('../controllers/optinVerify');
const middleware = require('../middleware/mailVerifier');
const sender = require('../controllers/sendOptinCode');
const storing = require('../controllers/storeOptinCode');


router.post('/' , middleware.getContactType, middleware.checkContactValidity ,sender.generateSecureOtp, sender.sendCode , storing.storeOptinCode , optinVerifyController.redirectToOptin);
//router.post('/',middleware.checkDomainMx, sender.sendCode , storing.storeOptinCode,  optinVerifyController.redirectToOptin);

module.exports = router;
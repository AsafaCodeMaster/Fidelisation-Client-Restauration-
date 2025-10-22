const express = require('express');
const router = express.Router();
const Middelware = require('../../middleware/preventProtectedAccess');
const changePasswordController = require('../../controllers/changePassword');
const decodeToken = require('../../middleware/decodeToken');

router.get('/' ,Middelware.verifyToken,decodeToken.extractUser,  changePasswordController.getClientChangePassword);
module.exports = router;
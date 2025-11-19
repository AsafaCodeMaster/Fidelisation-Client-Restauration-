const express = require('express');
const router = express.Router();
const profileMiddelware = require('../../middleware/preventProtectedAccess');
const decodeToken = require('../../middleware/decodeToken');
const user = require('../../controllers/user');

router.get('/' ,profileMiddelware.verifyToken,decodeToken.extractUser,  user.loadCurrentPoints);
router.get('/load' ,profileMiddelware.verifyToken,decodeToken.extractUser,  user.loadUser);
router.get('/purchase' ,profileMiddelware.verifyToken,decodeToken.extractUser,  user.totalPurchase);
module.exports = router;
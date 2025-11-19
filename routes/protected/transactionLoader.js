const express = require('express');
const router = express.Router();
const profileMiddelware = require('../../middleware/preventProtectedAccess');
const transactionLoader = require('../../controllers/purchaseHistory');
const decodeToken = require('../../middleware/decodeToken');

router.get('/' ,profileMiddelware.verifyToken,decodeToken.extractUser,  transactionLoader.loadPurchases);

module.exports = router; 
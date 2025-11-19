const express = require('express');
const router = express.Router();
const Middelware = require('../../middleware/preventProtectedAccess');
const purchaseHistoryController = require('../../controllers/purchaseHistory');
const decodeToken = require('../../middleware/decodeToken');

router.get('/' ,Middelware.verifyToken,decodeToken.extractUser,  purchaseHistoryController.getClientPurchaseHistory);

router.get('/load' ,Middelware.verifyToken,decodeToken.extractUser,  purchaseHistoryController.getClientPurchaseHistory);

module.exports = router;
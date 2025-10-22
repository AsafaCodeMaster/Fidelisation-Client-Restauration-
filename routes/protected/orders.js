const express = require('express');
const router = express.Router();
const Middelware = require('../../middleware/preventProtectedAccess');
const ordersController = require('../../controllers/orders');
const decodeToken = require('../../middleware/decodeToken');

router.get('/' ,Middelware.verifyToken,decodeToken.extractUser,  ordersController.getClientOrders);
module.exports = router;
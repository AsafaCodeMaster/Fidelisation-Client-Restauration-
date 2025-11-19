const express = require('express');
const router = express.Router();
const Middelware = require('../../middleware/preventProtectedAccess');
const ordersController = require('../../controllers/orders');
const decodeToken = require('../../middleware/decodeToken');
const client = require('../../controllers/client');

router.get('/' ,Middelware.verifyToken,decodeToken.extractUser,  ordersController.getClientOrders);
router.post('/create' , Middelware.verifyToken , decodeToken.extractUser  , client.getCientPoints , ordersController.create);
module.exports = router;


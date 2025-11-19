const express = require('express');
const router = express.Router();
const profileMiddelware = require('../../middleware/preventProtectedAccess');
const pointsController = require('../../controllers/points');
const decodeToken = require('../../middleware/decodeToken');
const product = require('../../controllers/product');

router.get('/' ,profileMiddelware.verifyToken,decodeToken.extractUser,  product.loadProducts);
module.exports = router;
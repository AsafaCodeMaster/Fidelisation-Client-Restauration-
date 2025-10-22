const express = require('express');
const router = express.Router();
const profileMiddelware = require('../../middleware/preventProtectedAccess');
const pointsController = require('../../controllers/points');
const decodeToken = require('../../middleware/decodeToken');

router.get('/' ,profileMiddelware.verifyToken,decodeToken.extractUser,  pointsController.getClientPoints);
module.exports = router;
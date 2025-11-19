const express = require('express');
const router = express.Router();
const profileMiddelware = require('../../middleware/preventProtectedAccess');
const rewardController = require('../../controllers/reward');
const decodeToken = require('../../middleware/decodeToken');

router.get('/available' ,profileMiddelware.verifyToken,decodeToken.extractUser,  rewardController.available);
router.post('/claim' ,profileMiddelware.verifyToken,decodeToken.extractUser,  rewardController.claim);
router.get('/history' ,profileMiddelware.verifyToken,decodeToken.extractUser,  rewardController.history);
module.exports = router;
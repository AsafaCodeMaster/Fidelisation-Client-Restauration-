const express = require('express');
const router = express.Router();
const Middelware = require('../../middleware/preventProtectedAccess');
const rewardsHistoryController = require('../../controllers/rewardsHistory');
const decodeToken = require('../../middleware/decodeToken');

router.get('/' ,Middelware.verifyToken,decodeToken.extractUser,  rewardsHistoryController.getClientRewardsHistory);
module.exports = router;
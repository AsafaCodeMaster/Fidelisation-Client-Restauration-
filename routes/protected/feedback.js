const express = require('express');
const router = express.Router();
const Middelware = require('../../middleware/preventProtectedAccess');
const feedbackController = require('../../controllers/feedback');
const decodeToken = require('../../middleware/decodeToken');

router.get('/' ,Middelware.verifyToken,decodeToken.extractUser,  feedbackController.getClientFeedback);
module.exports = router;
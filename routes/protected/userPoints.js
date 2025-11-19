const express = require('express');
const router = express.Router();
const profileMiddelware = require('../../middleware/preventProtectedAccess');
const decodeToken = require('../../middleware/decodeToken');
const user = require('../../controllers/user');

router.get('/' ,profileMiddelware.verifyToken,decodeToken.extractUser,  user.loadCurrentPoints);
module.exports = router;
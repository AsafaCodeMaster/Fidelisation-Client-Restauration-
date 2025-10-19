const express = require('express');
const path = require('path');
const router = express.Router();
const profileMiddelware = require('../../middleware/profile');
const profileController = require('../../controllers/home');
const decodeToken = require('../../middleware/decodeToken');

router.get('/' ,profileMiddelware.verifyToken,decodeToken.extractUser,  profileController.getClientProfile);
module.exports = router;
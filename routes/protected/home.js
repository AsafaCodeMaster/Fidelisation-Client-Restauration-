const express = require('express');
const path = require('path');
const router = express.Router();
const profileMiddelware = require('../../middleware/profile');
const profileController = require('../../controllers/home');

router.get('/' ,profileMiddelware.verifyToken, profileController.getClientProfile);
module.exports = router;
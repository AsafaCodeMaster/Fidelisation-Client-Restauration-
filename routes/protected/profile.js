const express = require('express');
const router = express.Router();
const profileMiddelware = require('../../middleware/preventProtectedAccess');
const profileController = require('../../controllers/profile');
const decodeToken = require('../../middleware/decodeToken');

router.get('/' ,profileMiddelware.verifyToken,decodeToken.extractUser,  profileController.getClientProfile);
router.post('/update' ,profileMiddelware.verifyToken,decodeToken.extractUser,  profileController.update);
router.delete('/delete' ,profileMiddelware.verifyToken,decodeToken.extractUser,  profileController.deleteAccount);

module.exports = router;
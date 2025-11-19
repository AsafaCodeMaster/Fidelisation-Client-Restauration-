const express = require('express');
const router = express.Router();
const Middelware = require('../../middleware/preventProtectedAccess');
const info = require('../../controllers/info');
const decodeToken = require('../../middleware/decodeToken');
router.get('/load' , Middelware.verifyToken,decodeToken.extractUser, info.load);


module.exports = router;
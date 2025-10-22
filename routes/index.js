const express = require('express');
const router = express.Router();
const preventUnprotectedAccess = require('../middleware/preventUnprotectedAccess');

router.get('/',preventUnprotectedAccess.preventAuthenticatedAccess, (req, res) => {
  res.render('index' , { });
});

module.exports = router;
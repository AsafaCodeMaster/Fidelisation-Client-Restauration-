const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/' , (req , res)=>{
    console.log("api routes reached /api , will now send api.html");
 res.sendFile(path.join(__dirname,'..' , 'public', 'api.html'));
});
module.exports = router;
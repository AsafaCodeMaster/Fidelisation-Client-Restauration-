const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

dotenv.config();
async function resetPasswordAccesCheck(req , res  , next) {
    const key = process.env.RESET_PASSWORD_KEY;
    const token = req.params.token;
    req.token = token;

    try{jwt.verify(token, key);


        const query = `SELECT * FROM resetpasswords WHERE token = ?`;

        const [used] = await db.execute(query, [
      token
    ]);

    if(used.length === 0){
        console.log('M____Middleware tokenVerifier.js resetPasswordAccesCheck : no token matched in table');
        console.log('email : ' + used[0].contact);
        return res.status(200).send();
    }
    console.log('Middleware tokenVerifier.js resetPasswordAccesCheck token is : ' + token);
    return next();


    }catch(e){
        console.log('token not valid');
        res.json({e});
    }
}

module.exports = {resetPasswordAccesCheck};
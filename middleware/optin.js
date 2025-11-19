const db = require('../config/database');

async function verifyOptinCode(req , res , next) {
    const user_optin = req.body.optinCode;
        const [optin_rows] = await db.execute(
      'SELECT first_name , last_name , optin_receiver , hashed_password FROM pending WHERE verification_code = ?',
      [user_optin]
    );
    const optin = optin_rows;
        if (optin.length === 0 || optin.optin_receiver !== req.body.contact) {
            console.log('optinCode found is ' + req.body.optinCode);
            console.log('optin found is ' + optin.length);
            console.log(' optin middleware : wrong optin found , opin is ' + optin.optin_receiver + ' but found' +req.body.contact);
      return res.status(404).send('Wrong optin');
    }
                console.log('optinCode found is ' + req.body.optinCode);
            console.log('optin found is ' + optin.length);
    const pending = optin[0];
            req.body.nom = pending.first_name;
            req.body.prenom = pending.last_name;
            req.body.contact = pending.optin_receiver;
            req.body.password = pending.hashed_password;
    next();


}
module.exports = {verifyOptinCode};
const dns = require('dns');

/**
 * Extrait le nom de domaine d'une adresse email.
 * @param {string} email - L'adresse email complète.
 * @returns {string | null} Le nom de domaine ou null si le format est invalide.
 */


function getContactType(req , res , next) {
    let contactType = 'phoneNumber';
    const contact = req.body.contact;
    const isEmail = contact.includes('@');
    if(isEmail) contactType = 'email';
    req.body.contactType = contactType;
    next();

}

async function checkContactValidity(req, res, next) {
    if (req.body.contactType === 'email') {
        const isValid = await checkDomainMx(req);

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Adresse email invalide : domaine introuvable ou sans MX."
            });
        }

        return next();
    }

    // Phone number case
    return checkPhoneNumberValidity(req, res, next);
}

function checkPhoneNumberValidity(req, res , next) {
    next();
}

function extractDomain(email) {
    if (typeof email !== 'string' || !email.includes('@')) {
        return null;
    }
    
    const parts = email.split('@');
    const domain = parts[parts.length - 1];
    
    // Vérification basique du format (doit contenir un point et ne pas être vide)
    if (domain.length > 0 && domain.includes('.')) {
        return domain;
    }
    return null;
}


/**
 * Vérifie l'existence des enregistrements MX pour un nom de domaine en utilisant le module DNS natif.
 * C'est l'étape cruciale pour savoir si un domaine peut recevoir des emails.
 * @param {string} email - L'adresse email à vérifier.
 * @returns {Promise<boolean>} True si des enregistrements MX valides existent, False sinon.
 */
function checkDomainMx(req) {
    const domain = extractDomain(req.body.contact);
    if (!domain) return false;

    return new Promise((resolve) => {
        dns.resolveMx(domain, (err, addresses) => {
            if (err) return resolve(false);
            if (!addresses || addresses.length === 0) return resolve(false);
            resolve(true);
        });
    });
}
module.exports = { getContactType,checkContactValidity, checkDomainMx};
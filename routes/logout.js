const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    console.log('hehehe');
    // 1. SUPPRIMER le token/cookie du côté client (cette ligne modifie seulement les headers)
   res.clearCookie('token'); 

    // 2. LOG la déconnexion sur le serveur
    console.log('logged out');
    
    // 3. ENVOYER LA RÉPONSE FINALE et QUITTER la fonction
    // Nous utilisons 'return' pour garantir que le code s'arrête ici.
    // L'option choisie est une redirection (car l'utilisateur n'a plus de token).
    res.redirect('/login'); 

    /* IMPORTANT : Vous avez enlevé res.json({ message: 'Logged out' }); car on ne peut pas 
    envoyer à la fois une réponse JSON ET une redirection. Dans un scénario de déconnexion, 
    la redirection vers la page de login est l'action la plus attendue.
    */
});

module.exports = router;

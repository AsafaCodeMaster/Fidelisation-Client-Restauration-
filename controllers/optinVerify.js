async function redirectToOptin(req, res) {
    const name = req.body.nom;
    const firstname = req.body.prenom;
    const contact = req.body.contact;
    // // console.log(name +" " +firstname +" "+contact );
    

    res.render("signup", { rname : name , rfirstname : firstname , rcontact : contact , optin : true });
}

module.exports = { redirectToOptin };

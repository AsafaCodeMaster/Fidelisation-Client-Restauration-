const db = require('../config/database');

async function getClientPurchaseHistory(req, res) {
  try {
    const clientId = req.userId;

    // Fetch user info from DB
    const [rows] = await db.execute(
      'SELECT first_name, last_name, email, phone_number FROM clients WHERE id = ?',
      [clientId]
    );

    if (rows.length === 0) {
      return res.status(404).send('User not found');
    }

    const myclient = rows[0];
    // Render the EJS page with client info
    res.render("purchaseHistory", { myclient });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving client info');
  }
}
async function loadPurchases(req , res) {
  console.log('hey there ');
  try {
    const userId = req.userId;
    const query = `SELECT * FROM sold_products WHERE id_client = ?`;
    const [purchases] =  await db.execute(query , [userId]);
    console.table(purchases);
    const productQuery = `SELECT name FROM products WHERE id = ?`;
    const purchaseData = await Promise.all(
      purchases.map(async (purchase) => {
        const [product] = await db.execute(productQuery, [purchase.id_product]);
        return {
          id: purchase.id,
          type: purchase.type,
          name: product[0]?.name || "Unknown Product",
          unitPrice: Number(purchase.price),
          quantity: purchase.quantity,
          date: purchase.sale_date,
          description: "Optional description",
        };
      })
    );
    
    res.json({
      success : true,
      data : purchaseData
    });

  } catch (e) {
    // 💡 Ajoutez l'affichage de l'erreur complète pour le débogage serveur
    console.error('Erreur lors du chargement des achats:', e); 
    
    // 💡 Renvoyez un statut HTTP 500 pour indiquer une erreur serveur
    res.status(500).json({"success" : false, message: "Erreur serveur interne."});
  }
}

module.exports = { getClientPurchaseHistory , loadPurchases };

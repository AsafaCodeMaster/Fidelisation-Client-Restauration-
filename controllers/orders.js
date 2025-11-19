const db = require('../config/database');

// === 1️⃣ Page affichant les commandes client ===
async function getClientOrders(req, res) {
  try {
    const clientId = req.userId; // Décodé depuis le token par le middleware

    // Récupération des infos du client
    const [rows] = await db.execute(
      'SELECT first_name, last_name, email, phone_number FROM clients WHERE id = ?',
      [clientId]
    );

    if (rows.length === 0) {
      return res.status(404).send('User not found');
    }

    const myclient = rows[0];

    // Rendu de la page EJS avec les données client
    res.render('orders', { myclient });

  } catch (error) {
    console.error('Error retrieving client info:', error);
    res.status(500).send('Error retrieving client info');
  }
}

// === 2️⃣ Création d'une commande ===
async function create(req, res) {
  try {
/*     console.log("items id :", req.body.items[0].id);
    console.log("item name :", req.body.items[0].name);
    console.log("item price :", req.body.items[0].price);
    console.log("quantity :", req.body.items[0].quantity); */

    // Enregistrement de la commande principale

    req.body.points = parseInt(req.body.total / 10000);
    await db.execute(`UPDATE clients 
                      SET reward_points = reward_points + ? 
                      WHERE id = ?`  ,
                       [req.body.points , req.userId]);

    const orderId = await storeOrder(req);



    // Enregistrement des produits vendus
    await storeSoldProducts(req, orderId);

    res.json({ success: true });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
}

// === 3️⃣ Fonction pour stocker la commande principale ===
async function storeOrder(req) {
  const clientId = req.userId;
  const total_price = req.body.total;
  const points = parseInt(req.body.total/10000); // 1 point par 10k (à ajuster)
  const clientPoints = req.points ?? 0; // Sécurité si req.points est undefined

  const query = `
    INSERT INTO orders (id_client, total_price, point, remaining_points)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    clientId,
    total_price,
    points,
    clientPoints + points
  ]);

  console.log("Order inserted with ID:", result.insertId);
  return result.insertId; // Renvoie l'ID de la commande créée
}

// === 4️⃣ Fonction pour stocker les produits associés ===
async function storeSoldProducts(req, orderId) {
  const items = req.body.items;
  const clientId = req.userId;

  const query = `
    INSERT INTO sold_products (id_order, id_product, id_client, quantity, price, type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Exécuter les insertions en parallèle de manière propre
  const promises = items.map(item =>
    db.execute(query, [
      orderId,
      item.id,
      clientId,
      item.quantity,
      item.price,
      'product'
    ])
  );

  await Promise.all(promises); // Attendre que toutes les insertions soient finies
  console.log(`All sold products linked to order ${orderId} inserted.`);
}

module.exports = { getClientOrders, create };

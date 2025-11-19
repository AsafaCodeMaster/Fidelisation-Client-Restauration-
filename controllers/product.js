const db = require('../config/database');

async function loadProducts(req, res) {
  try {
    // Query all products
    const [rows] = await db.execute('SELECT id, name, price FROM products');

    // Map products into the requested JSON structure
    const products = rows.map(p => ({
      id: p.id,
      name: p.name,
      price: parseFloat(p.price),
      emoji: "🍕" // placeholder
    }));

    // Send JSON response
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error loading products:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving products'
    });
  }
}

module.exports = { loadProducts };

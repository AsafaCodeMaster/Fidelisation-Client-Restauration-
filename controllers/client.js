const db = require('../config/database');

async function getCientPoints(req , res , next) {
    const query = `SELECT * FROM clients WHERE id = ?`;
    const [client] = await db.execute(query , [req.userId]);
    req.points = client[0].reward_points;
    next();
}

module.exports = {getCientPoints};
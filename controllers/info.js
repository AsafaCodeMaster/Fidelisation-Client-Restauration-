const db = require('../config/database'); 

async function load(req , res){
    const query = `SELECT first_name , last_name , reward_points FROM clients  WHERE id = ?`;
    const [results] = await db.execute(query , [req.userId]);
    const client = results[0];

    const totalPurchaseQuery = `SELECT total_price FROM orders WHERE type = 'purchase' AND id_client = ?`;
    const [totalPuchases] = await db.execute(totalPurchaseQuery , [req.userId]);
    const totalPurchase = totalPuchases.length;
    let totalSpent = 0;
    totalPuchases.map(purchase => {
        totalSpent += purchase.total_price;
    });
    
    const totalRewardQuery = `SELECT total_price FROM orders WHERE type = 'reward' AND id_client = ?`;
    const [totalRewards] = await db.execute(totalRewardQuery , [req.userId]);
    const totalReward = totalRewards.length;

    res.json({
        success : true , 
        data :{
        first_name : client.first_name,
        last_name : client.last_name,
        points : client.reward_points,
        total_purchase : totalPurchase,
        total_spent : totalSpent,
        total_reward : totalReward}
    });


/*     const totalSpent = `SELECT `; */



}

module.exports = {load};
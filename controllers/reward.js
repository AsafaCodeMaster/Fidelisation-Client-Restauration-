const db = require('../config/database');

async function available(req , res) {

  const query = `SELECT id , name , description , points_required FROM rewards `;
  const [rewards] = await db.execute(query , [ ]);
  const available = rewards.map( reward => ({
    id : reward.id, 
    name : reward.name, 
    description : reward.description,
    cost : reward.points_required
  }));
    res.json({
  success: true,
  data: available
});
}


async function claim(req , res){

  try {
    
  const rewardPointsQuery = `SELECT * FROM rewards WHERE id = ?`;
  const [rewardPointsResponse] = await db.execute(rewardPointsQuery , [req.body.rewardId]);
  const rewardPoints = rewardPointsResponse[0].points_required;

  const clientPointsQuery = `SELECT reward_points FROM clients WHERE id=?`;
  const [clientPointsResponse] = await db.execute(clientPointsQuery , [req.userId]);
  const clientPoints = clientPointsResponse[0].reward_points;

  if(clientPoints < rewardPoints){
    return res.json({
      success : false
    });
  }
  await storeInOrders(req.body.rewardId,rewardPointsResponse[0] , req.userId , clientPoints-rewardPoints);
  await db.execute(`UPDATE clients SET reward_points = reward_points - ? WHERE id = ?` , [rewardPoints , req.userId]);

  


  res.json({
    success: true

  });
  } catch (error) {
    console.log('could not claim reward due to ' + error);
    res.json({
      success: false
    });
  }

}

async function storeInOrders(rewardId , rewardInfo , userId , remainingPoints){
/*         // console.log("reward id is : " + rewardId); */
  const query =`INSERT INTO orders (id_client ,id_reward, total_price , point , remaining_points , description , type) VALUES (?,?,?,?,?,?,?)`;
  await db.execute(query , [userId ,rewardId, 0 ,rewardInfo.points_required , remainingPoints , rewardInfo.name , 'reward']);
  return ;
}

async function clientRemainingPoints(id){
  const query = `SELECT reward_points FROM clients WHERE id = ?`;
  const [response] = await db.execute(query , [id]);

  return response[0].reward_points;

}
async function history(req , res){
  const query = `SELECT * FROM  orders WHERE type = 'reward' AND id_client = ?`;
  const [orders] = await db.execute(query , [req.userId]);
/*   console.log(req.userId); */
  const nameQuery = `SELECT name FROM rewards WHERE id = ?`;
  const mappedRewardHistory = await Promise.all(orders.map( async (order) =>{
    const [names] = await db.execute(nameQuery , [order.id_reward]);
    return ({
      id : order.id,
      name : names[0].name,
      cost : order.point,
      date : order.order_date , 
      status : order.status == 'success' ? 'claimed' : ' ',
      icon : '🎁'
    });
  })
  );

/*    const mappedReward = await Promise.all(mappedRewardHistory); */
/*       console.table(mappedRewardHistory); */
    res.json({
  success: true,
  data : mappedRewardHistory
});
}

module.exports = {available , history , claim};
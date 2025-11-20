const db = require('../config/database');

async function loadCurrentPoints(req , res) {
  try {
    const query = `SELECT reward_points FROM clients WHERE id = ?`;
    const [user] = await db.execute(query , [req.userId]);

      res.json({
  success: true,
  points: user[0].reward_points
});
  } catch (error) {
/*     console.log('cannot loas user points due to ' + error); */
    res.json({success : false});
  }
 
}
async function totalPurchase(req , res) {
  try {
    const query = `SELECT * FROM orders WHERE type = 'purchase' AND id_client = ?`;
    const [found] = await db.execute(query , [req.userId]);
/* console.log(found.length); */
    res.json({
      success: true , 
      totalpurchase : found.length
    })

  } catch (error) {
/*     console.log('error sending total client puchase due to ' + error); */
    res.json({
      success : false
    })
  }
}

async function loadUser(req , res) {
  try {
    const query = `SELECT * FROM clients WHERE id = ?`;
    const [results] = await db.execute(query , [req.userId]);
    if(results.length === 0 ) res.json({success : false});
    const user = results[0];

    let date , month , year , birthdate = '';
    if (user.birth_date != null) {
     date = user.birth_date.getUTCDate()+1;
     month = user.birth_date.getUTCMonth()+1;
     year = user.birth_date.getUTCFullYear();
     birthdate = year+'-'+(month >= 10 ? month : `0${month}`)+'-'+(date >= 10 ? date : `0${date}`);

    }
    const changed = new Date(user.last_password_change);
    const today = new Date();

    const data = {
      firstName : user.first_name,
      lastName : user.last_name,
      phoneNumber : user.phone_number,
      email : user.email,
      gender : user.gender== 'other' ? 'autre' : user.gender,
      birthdate : birthdate,
      adress : user.address,
      city : user.city,
      rewardPoints : user.reward_points,
      lastPasswordChanged : timeAgo(changed , today)

    };
/* console.table(data); */
    res.json({
      success : true,
      data : data
    });
  } catch (e) {
/*     console.log('user could not be load bc of ' +e); */
    res.json({success : false});
  }

}


function timeAgo(date1, date2) {
  // Ensure both are Date objects
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Difference in milliseconds
  const diffMs = Math.abs(d2 - d1);

  // Convert to seconds, minutes, hours, days, months, years
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // Decide the format
  if (seconds < 60) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  if (days < 30) return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  if (months < 12) return `Il y a ${months} moi${months > 1 ? "s" : ""}`;
  return `Il y a ${years} an${years > 1 ? "s" : ""}`;
}


module.exports = {loadCurrentPoints , loadUser , totalPurchase};
    const names = document.getElementById('names');
    const points = document.getElementById('points');
    const totalpurchase = document.getElementById('totalPurchase');
    const totalSpent = document.getElementById('totalSpent');
    const totalReward = document.getElementById('totalReward');

let loadedInfo;

    document.addEventListener('DOMContentLoaded' , async ()=>{
        await loadInfo();
        renderInfo();
        
    });

async function loadInfo(){
     const request = await fetch('/info/load');
     const response = await request.json();

     if(response.success){

        loadedInfo = response.data;
        // console.log(loadedInfo);        
        return ;
     }
}
function renderInfo(){
    names.innerText = loadedInfo.first_name + ' ' + loadedInfo.last_name;
    points.innerText = loadedInfo.points;
    totalpurchase.innerText = loadedInfo.total_purchase;
    totalReward.innerText = loadedInfo.total_reward;
    totalSpent.innerText = parseInt(loadedInfo.total_spent) + ' Ar';
}
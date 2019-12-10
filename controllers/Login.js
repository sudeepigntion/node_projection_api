async function Init(payload)
{
    await sleep();
    
    return new Promise((resolve, reject) =>{


        resolve({
            status:true,
            msg:"worked"
        });

    });
}

async function sleep()
{
    return new Promise((resolve, reject) =>{
        setTimeout(function()
        {
            resolve(true);
        }, 5000)
    });
}

exports.Init = Init;
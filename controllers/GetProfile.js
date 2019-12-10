async function Init(payload)
{
    return new Promise((resolve, reject) =>{
        
        resolve({
            status:true,
            msg:"worked"
        });
    });
}

exports.Init = Init;
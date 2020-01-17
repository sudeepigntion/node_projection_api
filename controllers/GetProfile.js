async function GetProfile(payload)
{
    return new Promise((resolve, reject) =>{
        
        resolve({
            status:true,
            msg:"worked"
        });
    });
}

exports.GetProfile = GetProfile;
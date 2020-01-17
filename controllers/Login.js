async function Login(payload)
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
        }, 1000)
    });
}

exports.Login = Login;
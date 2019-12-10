const Schema = {};

function CreateSchema(schema)
{
    for(var key in schema)
    {
        Schema[key] = schema[key];

        if(schema[key].method === undefined)
        {
            console.log(`no method found for ${key}...`);
        }

        if(schema[key].timeout === undefined)
        {
            Schema[key].timeout = 5000;
        }
    }
}

async function HandleRequest(req, res)
{
    try
    {
        var waitResp = {};

        for(var key in req.body)
        {
            if(Schema[key] === undefined)
            {
                waitResp[key] = {
                    status:false,
                    msg:"No Methods found"
                };
            }
            else
            {

                Promise.timeout = function(timeout, cb)
                {
                    return Promise.race([
                        Schema[key].method.Init(req.body),
                        new Promise(function(resolve, reject)
                        {
                            setTimeout(function() { resolve(false) }, timeout);
                        })
                    ]);
                }

                let callback = await Promise.timeout(Schema[key].timeout);

                if(!callback)
                {
                    waitResp[key] = {
                        status:false,
                        msg:`Method ${key} timed out`
                    };
                }
                else
                {
                    clearTimeout(callback.timer);

                    waitResp[key] = callback;
                }
            }
        }

        res.send(waitResp);
    }
    catch(e)
    {
        console.log(e);
    }
}

async function invokeMethod()
{
    
}

exports.CreateSchema = CreateSchema;
exports.HandleRequest = HandleRequest;
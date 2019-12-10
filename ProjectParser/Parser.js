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
                    msg:`No Method named ${key} found`
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
                    waitResp[key] = callback;
                }
            }
        }

        res.send(waitResp);
    }
    catch(e)
    {
        res.send({
            status:false,
            msg:"Oops, something went wrong"
        });
    }
}

async function HandleStreamingRequest(ws, message)
{
    try
    {
        for(var key in message)
        {
            var waitResp = {};

            if(Schema[key] === undefined)
            {
                waitResp[key] = {
                    status:false,
                    msg:`No Method named ${key} found`
                };
            }
            else
            {
                Promise.timeout = function(timeout, cb)
                {
                    return Promise.race([
                        Schema[key].method.Init(message),
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
                    waitResp[key] = callback;
                }
            }

            ws.send(JSON.stringify(waitResp));
        }
    }
    catch(e)
    {
        console.log(e);

        ws.send(JSON.stringify({
            status:false,
            msg:"Oops, something went wrong"
        }));
    }
}

async function HandleHttp2StreamingRequest(req, res, message)
{
    try
    {
        for(var key in message)
        {
            var waitResp = {};

            if(Schema[key] === undefined)
            {
                waitResp[key] = {
                    status:false,
                    msg:`No Method named ${key} found`
                };
            }
            else
            {
                Promise.timeout = function(timeout, cb)
                {
                    return Promise.race([
                        Schema[key].method.Init(message),
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
                    waitResp[key] = callback;
                }
            }

            res.write(JSON.stringify(waitResp));
        }

        res.end();
    }
    catch(e)
    {
        console.log(e);

        ws.send(JSON.stringify({
            status:false,
            msg:"Oops, something went wrong"
        }));
    }
}

exports.CreateSchema = CreateSchema;
exports.HandleRequest = HandleRequest;
exports.HandleStreamingRequest = HandleStreamingRequest;
exports.HandleHttp2StreamingRequest = HandleHttp2StreamingRequest;
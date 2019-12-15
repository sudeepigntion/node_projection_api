const express = require('express')
const bodyParser = require('body-parser')
const https = require("https");
const http = require("http");
const WebSocket = require('ws').Server;

const http2 = require('http2');

const app = express();

let wss = null;
let server = null;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

function Use(param)
{
    if(typeof(param) === "function")
    {
        app.use(function(req,res,next)
        {
            param(req,res,next)
        })
    }
    else
    {
        app.use(param);
    }
}

function StartStreaming()
{
    wss = new WebSocket({
        server: server
    });

    const streamingParser = require("./Parser");

    wss.on('connection', function connection(ws)
    {
        ws.isAlive = true;

        ws.on('pong', heartbeat);

        ws.on("error",function(err)
        {
           console.log(err);
        });

        ws.on('message', function incoming(message)
        {
            streamingParser.HandleStreamingRequest(ws, JSON.parse(message));
        });
    });

    wss.on("error",function(err)
    {
        console.log(err);
    });

    const interval = setInterval(function ping()
    {
        wss.clients.forEach(function each(ws)
        {
            if(ws.readyState === 2)
            {
                if (ws.isAlive === false)
                {
                    return ws.terminate();
                }

                ws.isAlive = false;
                ws.ping("ping");
            }
        });

    }, 30000);
}

function heartbeat()
{
  this.isAlive = true;
}

function Listen(protocol, hostName, sslOptions)
{
    try
    {
        hostName = hostName.split(":");

        let host = hostName[0];

        let port = typeof(parseInt(hostName[1])) !== "number" ? 3000 : hostName[1]; 
     
        if(protocol === "http")
        {
            if(host !== "localhost" && host !== "127.0.0.1")
            {
                server = http.createServer(app).listen(host, port, function()
                {
                    console.log(`Server is listening at host: ${host} and port: ${port}`);
                });
            }
            else
            {
                server = http.createServer(app).listen(port, function()
                {
                    console.log(`Server is listening at host: ${host} and port: ${port}`);
                });
            }
        }
        else if(protocol === "https")
        {
            if(host !== "localhost" && host !== "127.0.0.1")
            {
                server = https.createServer(sslOptions, app).listen(host, port, function()
                {
                    console.log(`Server is listening at host: ${host} and port: ${port}`);
                });
            }
            else
            {
                server = https.createServer(sslOptions, app).listen(port, function()
                {
                    console.log(`Server is listening at host: ${host} and port: ${port}`);
                });
            }
        }
        else
        {
            console.log(`Invalid protocol selected must be http or https`);
        }

        return server;
    }
    catch(e)
    {
        console.log(e);
        return null;
    }
}

function SetRoutePath(path)
{
    app.post(path, require("./Parser").HandleRequest);
}

function CreateHttpStreaming(protocol, hostName, sslOptions)
{
    try
    {
        hostName = hostName.split(":");

        let host = hostName[0];

        let port = typeof(parseInt(hostName[1])) !== "number" ? 3000 : hostName[1]; 
     
        if(protocol === "http")
        {
            if(host !== "localhost" && host !== "127.0.0.1")
            {
                server = http2.createServer().listen(host, port, function()
                {
                    console.log(`Server is listening at host: ${host} and port: ${port}`);
                });
            }
            else
            {
                server = http2.createServer().listen(port, function()
                {
                    console.log(`Server is listening at host: ${host} and port: ${port}`);
                });
            }
        }
        else if(protocol === "https")
        {
            if(host !== "localhost" && host !== "127.0.0.1")
            {
                server = http2.createSecureServer(sslOptions).listen(host, port, function()
                {
                    console.log(`Server is listening at host: ${host} and port: ${port}`);
                });
            }
            else
            {
                server = http2.createSecureServer(sslOptions).listen(port, function()
                {
                    console.log(`Server is listening at host: ${host} and port: ${port}`);
                });
            }
        }
        else
        {
            console.log(`Invalid protocol selected must be http or https`);
        }

        return server;
    }
    catch(e)
    {
        console.log(e);
        return null;
    }
}

function StartHttpStreaming()
{
    const streamingParser = require("./Parser");

    // server.on('stream', (sockStream, requestHeaders) => {
            
    // });

    server.on('request', async function(req, res)
    {
       try
       {
            var parsedPayload = await parsePayload(req, res);

            if(parsedPayload !== false)
            {
                parsedPayload = JSON.parse(parsedPayload);

                streamingParser.HandleHttp2StreamingRequest(req, res, parsedPayload);
            }
            else
            {
                res.end(JSON.stringify({
                    status:false,
                    msg:"Oops, something went wrong"
                }));
            }
       }
       catch(e)
       {
            console.log(e);

            res.end(JSON.stringify({
                status:false,
                msg:"Oops, something went wrong"
            }));
       }
    });
}

async function parsePayload(req, res)
{
    return new Promise((resolve,reject) =>{
        try
        {
            var payLoad = "";

            req.on('data',function(data)
            {
                payLoad += data;
            });

            req.on('end',function()
            {
                resolve(payLoad);
            });
        }
        catch(e)
        {
            resolve(false);
        }
    });
}

exports.Listen = Listen;
exports.CreateSchema = require("./Parser").CreateSchema;
exports.Use = Use;
exports.SetRoutePath = SetRoutePath;
exports.StartStreaming = StartStreaming;
exports.CreateHttpStreaming = CreateHttpStreaming;
exports.StartHttpStreaming = StartHttpStreaming;
exports.App = app;
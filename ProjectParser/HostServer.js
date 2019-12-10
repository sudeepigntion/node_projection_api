const express = require('express')
const bodyParser = require('body-parser')
const https = require("https");
const http = require("http");
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

function Use(param)
{
    app.use(param)
}

function Listen(protocol, hostName, sslOptions)
{
    try
    {
        let server = null;

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

exports.Listen = Listen;
exports.CreateSchema = require("./Parser").CreateSchema;
exports.Use = Use;
exports.SetRoutePath = SetRoutePath;
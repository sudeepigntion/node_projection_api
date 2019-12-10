# node_projection_api
This is a framework built over nodejs express framework and ws library. It is built as inspiration to GraphQL by facebook.
In this you can invoke methods using http/1.1 and get streaming packets using http/2 push and websockets.

// Here we are importing Project parser module

const parserSchema = require("./ProjectParser");

// This are routes we have created 2 routes inside controllers folder one is Login and the other is GetProfile

const Login = require("./controllers/Login");

const GetProfile = require("./controllers/GetProfile");

// Here we are creating schema for method invocation.
// It requires 2 parameters

1. Method Object
2. Timeout for the request to complete, if the routes is not able to give response in between the timeout then it will terminate the route and give timeout response to client

parserSchema.Project.CreateSchema({
    "Login":{
        method:Login,
        timeout:100,
    },
    "GetProfile":{
        method:GetProfile,
        timeout:100,
    }
});

// Here we are invoking express framework use method to create interceptor

parserSchema.Project.Use(function(req, res, next)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});

// Here we are starting Http/1.1 listener with http module, you can pass https also for https you can call
// parserSchema.Project.Listen("https","127.0.0.1:8000", sslOptions);

parserSchema.Project.Listen("http","127.0.0.1:8000");

// Here are setting path for remote method invocation

parserSchema.Project.SetRoutePath("/");

// Here we are starting websocket streaming for remote method invocation, it will listen to the same port as http server

parserSchema.Project.StartStreaming();

// here we are create http2 streaming for push

parserSchema.Project.CreateHttpStreaming("http","127.0.0.1:8100");

// here we are starting the streaming

parserSchema.Project.StartHttpStreaming();


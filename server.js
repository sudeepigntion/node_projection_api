const parserSchema = require("./ProjectParser");

const Login = require("./controllers/Login");

const GetProfile = require("./controllers/GetProfile");

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

parserSchema.Project.Use(function(req, res, next)
{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});

parserSchema.Project.App.use(function(req,res)
{
    res.send("okok");
});

parserSchema.Project.Listen("http","127.0.0.1:8000");

parserSchema.Project.SetRoutePath("/");

parserSchema.Project.StartStreaming();

parserSchema.Project.CreateHttpStreaming("http","127.0.0.1:8100");

parserSchema.Project.StartHttpStreaming();

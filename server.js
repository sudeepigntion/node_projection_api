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

parserSchema.Project.Listen("http","127.0.0.1:8000");

parserSchema.Project.SetRoutePath("/");
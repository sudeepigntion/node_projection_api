# node_projection_api
This is a framework built over nodejs express framework and ws library. It is built as inspiration to GraphQL by facebook.
In this you can invoke methods using http/1.1 and get streaming packets using http/2 push and websockets.

// All request are post request, run the server.js it will eshtablish http/1.1, websocket and http/2 push server

// Make post request with the following payload and header as Content-Type:application/json , send this payload with http/2 client code sample written at the bottom

// Make websocket message payload with the following

// For http/2 stream packets are splitted with \r\n\r\n 

	{
		"Login":{
			"requestPayload":{
				"username":"Joe",
				"password":"kaihiwatari"
			}
		},
		"GetProfile":{},
		"SchemeMaster":{
			"requestPayload":{
				"category":"EQUITY"
			}
		}
	}

// Here we are importing Project parser module

	const parserSchema = require("./ProjectParser");

// This are routes we have created 2 routes inside controllers folder one is Login and the other is GetProfile

	const Login = require("./controllers/Login");

	const GetProfile = require("./controllers/GetProfile");

// Here we are creating schema for method invocation.
// It requires 2 parameters

// Method Object
// Timeout for the request to complete, if the routes is not able to give response in between the timeout then it will terminate the route and give timeout response to client

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

##############################################################################################################################

// For client setup for http/1.1 and websocket

	<html>

	    <script
		src="https://code.jquery.com/jquery-2.2.4.min.js"
		integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
		crossorigin="anonymous"></script>
	    <script>

		var saveData = $.ajax({
		    type: 'POST',
		    url: "http://localhost:8000",
		    beforeSend: function(request) {
			request.setRequestHeader("Content-Type", "application/json");
		    },
		    data: JSON.stringify({
			"Login":{
			    "requestPayload":{
				"username":"sudeep.dasgupta",
				"password":"kaihiwatari"
			    }
			},
			"GetProfile":{},
			"SchemesMaster":{
			    "requestPayload":{
				"category":"EQUITY"
			    }
			}
		    }),
		    success: function(resultData)
		    { 
			console.log(resultData)
		    }
		});
		function WebSocketTest()
		{
		    if ("WebSocket" in window)
		    {               
		       // Let us open a web socket
		       var ws = new WebSocket("ws://localhost:8000");

		       ws.onopen = function()
		       {

			  // Web Socket is connected, send data using send()
			  ws.send(
			    JSON.stringify({
				"Login":{
				    "requestPayload":{
					"username":"sudeep.dasgupta",
					"password":"kaihiwatari"
				    }
				},
				"GetProfile":{},
				"SchemesMaster":{
				    "requestPayload":{
					"category":"EQUITY"
				    }
				}
			    })
			  );
		       };

		       ws.onmessage = function (evt)
		       { 
			  var received_msg = evt.data;
			  console.log(received_msg);
		       };

		       ws.onclose = function()
		       { 

			  // websocket is closed.
			  console.log("Connection is closed..."); 
		       };
		    } else {

		       // The browser doesn't support WebSocket
		       console.log("WebSocket NOT supported by your Browser!");
		    }
		 }
		 WebSocketTest();
	    </script>
	</html>

##################################################################################################################

// For client http/2 push streams

	const http2 = require('http2');
	function post(url, path, body)
	{

	    const client = http2.connect(url);
	    const buffer = Buffer.from(JSON.stringify(body));
	    const req = client.request({
		[http2.constants.HTTP2_HEADER_SCHEME]: "http",
		[http2.constants.HTTP2_HEADER_METHOD]: http2.constants.HTTP2_METHOD_POST,
		[http2.constants.HTTP2_HEADER_PATH]: `/${path}`,
		"Content-Type": "application/json",
		"Content-Length": buffer.length,
	    });
	    req.on('response', (headers, flags) => {
		for (const name in headers) {
		  console.log(`${name}: ${headers[name]}`);
		}
	    });
	    req.setEncoding('utf8');
	    var data = "";
	    req.on('data', (chunk) => {
		console.log(chunk);
		data += chunk;
	    });
	    req.end(buffer);
	    req.on('end', () => {
	       console.log(data);
	       client.close();
	    });
	    req.on("error",function(err)
	    {
		console.log(err);
	    })
	}

	post("http://127.0.0.1:8100", "/", {
		"Login":{
			"requestPayload":{
				"username":"sudeep.dasgupta",
				"password":"kaihiwatari"
			}
		},
		"GetProfile":{},
		"SchemesMaster":{
			"requestPayload":{
				"category":"EQUITY"
			}
		}
	});

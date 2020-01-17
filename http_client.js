const http2 = require('http2');





function post(url, path, body)

{

    const client = http2.connect(url);



    const buffer = Buffer.from(JSON.stringify(body));



    const req = client.request({

        // [http2.constants.HTTP2_HEADER_SCHEME]: "https",

        // [http2.constants.HTTP2_HEADER_METHOD]: http2.constants.HTTP2_METHOD_POST,

        // [http2.constants.HTTP2_HEADER_PATH]: `/${path}`,

        // "Content-Type": "application/json",

        // "Content-Length": buffer.length,

        ':path': '/',
        ':method': 'POST'

    });





    req.on('response', (headers, flags) => {

        // for (const name in headers) {

        //   console.log(`${name}: ${headers[name]}`);

        // }

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



post("http://religareonline.com:8100", "/", {

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
var http = require("http");
var fs = require("fs");

var server = http.createServer(function(req, res) {
  switch (req.url) {
    case "/file": {
      switch (req.method) {
        case "GET": {
          fs.readFile("./src/data.txt", function (error, data) {
            if(error) throw error;
            var result = data.toString()
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.write(JSON.stringify({
              text: result
            }));
            res.end();
          });
          break; 
        }
        case "POST": {
          var chunks = [];
          req
              .on("data", function (chunk) {
                  chunks.push(chunk)    
              })
              .on("end", function () {
                  var data = Buffer.concat(chunks).toString();
                  res.writeHead(200, {
                    "Content-Type": "application/json"
                  });
                  res.end(JSON.stringify({
                    text: data
                  }));
                  fs.writeFile("./src/data.txt", data, function(error) {
                    if(error) throw error;
                  });   
              });
          break; 
        }
        case "DELETE": {
          res.writeHead(200, {
            "Content-Type": "application/json"
          });
          res.end();
          fs.writeFile("./src/data.txt", "", function(error) {
            if(error) throw error;
          });   
          break; 
        }
        case "PUT": {
          var chunks = [];
          req
            .on("data", function (chunk) {
                chunks.push(chunk)    
            })
            .on("end", function () {
              var data = Buffer.concat(chunks).toString();
              fs.appendFileSync("./src/data.txt", " " + data)
              fs.readFile("./src/data.txt", function (error, data) {
                if(error) throw error;
                var result = data.toString()
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                res.write(JSON.stringify({
                  text: result
                }));
                res.end();
              });
            });
          break; 
        }
        default: {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/plain");
          res.end("Not found!");
          break;
        }
      }
      break;
    }
    default: {
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/plain");
        res.end("Not found!");
        break;
    }
  } 
});        
server.listen(3000, "127.0.0.1", function() {
        console.info("Server listening at 127.0.0.1:3000")
});
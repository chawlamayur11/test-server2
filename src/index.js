const http = require("http");

const port = 3000;


const server = http.createServer((req, res) => {
  console.log(`Just got a request at ${req.url}!`);
  if (req.method == "POST") {
    let body = "";
    req.on("data", function (data) {
      body += data;
    });
    req.on("end", function () {
      body = JSON.parse(JSON.parse(body));
      console.log(body);
      res.statusCode = 200;
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");
      res.setHeader("Access-Control-Allow-Headers","X-Requested-With,Content-Type");
      res.setHeader("Content-Type", "application/json");
      res.end("test");
    });
  } else {
    res.write('Yo!');
    res.end();
  }
});

server.listen(process.env.PORT || port, () => {
  console.log(`Server running at http://${ipAddress}:${port}/`);
});

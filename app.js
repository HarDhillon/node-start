const http = require('http');
const fs = require('fs')

{

}

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/'){
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><form action="/message" method="POST"><input name="message" type="text"/><button type="submit">Send</button></form></body>');
    res.write('</html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST'){
    const body = []
    req.on('data', (chunk) => {
      console.log(chunk)
      body.push(chunk);
    });
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFile('message.txt', message, (err) => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end() ;
      })
    })
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>')
  res.write('<head><title>My First Page</title></head>')
  res.write('<body>Hello from my Node.js server!</body>')
  res.write('</html>')
  res.end()

})

server.listen(3000)
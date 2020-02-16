var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer((request, response)=>{  
  let data = [];
  if(url.parse(request.url).pathname === '/' && request.method=='GET'){
    let html = fs.readFileSync('./mailer.html');
    response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    response.end(html);
  }
  else if(url.parse(request.url).pathname === '/' && request.method=='POST'){
    request.on('data', chunk => {
      data.push(chunk);
    })
    request.on('end', () => {
      let from = JSON.parse(data).from;
      let to = JSON.parse(data).to;
      let message = JSON.parse(data).message;
      require('./nodeMailer')(from, to, message);
    })
    response.end();
  }
  else if(url.parse(request.url).pathname === '/send' && request.method=='GET'){
    require('./m0603')('Message sent with module');
    response.end();
  }   
}).listen(5000);

console.log('Server running at http://localhost:5000/');
var http=require('http');
var url=require('url');
var fs=require('fs');
var sendmail = require('sendmail')({silent: true})

let http_handler=(req, resp)=>{
  resp.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
  if(url.parse(req.url).pathname === '/' && req.method=='GET'){
    sendmail({
      from: 'metpolina29@gmail.com',
      to: 'metla.p@mail.ru',
      subject: 'Test sendmail',
      html: 'Mail of test sendmail '
    }, function (err, reply) {
      console.log(err && err.stack)
      console.dir(reply)
    })
}}

let server = http.createServer(http_handler);
server.listen(5000);
console.log('Server running at http://localhost:5000/');


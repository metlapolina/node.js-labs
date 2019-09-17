var http = require('http');
var fs = require('fs');

const express = require('express');
const app = express();

app.get('/html',function(request, response){
    let html = fs.readFileSync('./index.html');
    response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    response.end(html);
});

app.get('/png',function(request, response){
    const fname = './aaa.jpg';
    let picture = null;

    fs.stat(fname,(err,stat)=>{
        if(err){console.log('error:',err);}
        else{
            picture = fs.readFileSync(fname);
            response.writeHead(200, {'Content-Type':'image/jpeg','Content-Length':stat.size});
            response.end(picture, 'binary');
        }
    });
});

app.get('/api/name',function(request, response){
    response.writeHead(200, {'Content-Type':'text/plain; charset=utf-8'});
    response.end('Метла Полина Георгиевна');
});

app.get('/xmlhttprequest',function(request, response){
    let html = fs.readFileSync('./xmlhttprequest.html');
    response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    response.end(html);
});

app.get('/fetch',function(request, response){
    let html = fs.readFileSync('./fetch.html');
    response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    response.end(html);
});

app.get('/jquery',function(request, response){
    let html = fs.readFileSync('./jquery.html');
    response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    response.end(html);
});

app.listen(5000);

console.log('Server running at http://localhost:5000/');
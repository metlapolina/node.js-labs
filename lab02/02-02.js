var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer((request, response)=>{
    if(url.parse(request.url).pathname==='/png'){
        const fname = './pic.png';
        let picture = null;

        fs.stat(fname,(err,stat)=>{
            if(err){console.log('error:',err);}
            else{
                picture = fs.readFileSync(fname);
                response.writeHead(200, {'Content-Type':'image/png','Content-Length':stat.size});
                response.end(picture, 'binary');
            }
        });
    }
}).listen(5000);

console.log('Server running at http://localhost:5000/png');
let http = require('http');
let url = require('url');
let fs = require('fs');
let parseString = require('xml2js').parseString;
let mp = require('multiparty');

let server = http.createServer((request, response)=>{
    let parsedUrl = url.parse(request.url, true);
    let pathUrls = parsedUrl.pathname.split('/');

    if (parsedUrl.pathname === '/connection') {
        let key = Number(parsedUrl.query.set);
        if(Number.isInteger(key)){
            server.keepAliveTimeout = key;
        }
        response.end('Value KeepAliveTimeout: ' + server.keepAliveTimeout);
    } 

    else if (parsedUrl.pathname == '/headers') {
        response.writeHead(200,{'Content-Type':'text/html;charset=utf-8', 'Client-Header':'1'});
        let rc ='';
        for(key in request.headers) 
            rc+='<h3>'+key+':'+request.headers[key]+'</h3>';
        response.end(rc);
    } 
    
    else if (parsedUrl.pathname == '/parameter') {
        let x = Number(parsedUrl.query.x);
        let y = Number(parsedUrl.query.y);
        if(Number.isInteger(x) && Number.isInteger(y)){
            response.end('x+y='+(x+y)+
                        '\nx-y='+(x-y)+
                        '\nx*y='+(x*y)+
                        '\nx/y='+(x/y));
        }else{
            response.end('Error: values are not integers');
        }
    } 
    
    else if (pathUrls[1] === 'parameter') {
        if (pathUrls.length == 4){
            let x = Number(pathUrls[2]);
            let y = Number(pathUrls[3]);
            if(Number.isInteger(x) && Number.isInteger(y)){
                response.end('x+y='+(x+y)+
                            '\nx-y='+(x-y)+
                            '\nx*y='+(x*y)+
                            '\nx/y='+(x/y));
            }else{
                response.end(`URI: ${request.host}:5000${request.url}`);
            }
        }
        else{
            response.end('Error: invalid count of params');
        }        
    } 

    else if (parsedUrl.pathname == '/close') {
        const time = 10;
        response.end('Server will be closed after ' + time + ' seconds');
        setTimeout(() => { server.close();}, time * 1000);
    }
    
    else if (parsedUrl.pathname == '/socket') {
        response.end('Client ip:'+ request.connection.remoteAddress+
            '\nClient port:' + request.connection.remotePort+
            '\nServer ip:' + request.connection.localAddress+
            '\nServer port:' +  request.connection.localPort
        );
    } 
      
    else if (parsedUrl.pathname == '/req-data') {
        request.on('data', chunk => {
            console.log(`Chunk : ${chunk}`);
          })
    } 

    else if (parsedUrl.pathname == '/resp-status') {
        response.statusCode = Number(parsedUrl.query.code);
        response.statusMessage = parsedUrl.query.mess;
        response.end();
    } 
    
    else if (parsedUrl.pathname == '/formparameter') {
        if (request.method == 'GET') {
            let html = fs.readFileSync('./static/form.html');
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(html);
        } 
        else if (request.method == 'POST') {
            let data = '';
            request.on('data', chunk => {
                data += chunk.toString();
            })
            request.on('end', () => {
                response.end(data);
            })
        }
    } 

    else if (parsedUrl.pathname == '/json') {
        let data = '';
        request.on('data', (chunk) => {
            data += chunk;
        });
        request.on('end', () => {
            data = JSON.parse(data);
            response.writeHead(200, {'Content-type': 'application/json; charset=utf-8'});
            let comment = 'Ответ.' + data.__comment.split('.')[1];
            let resp = {};
            resp.__comment = comment;
            resp.x_plus_y = data.x + data.y;
            resp.Concatenation_s_o = data.s + ': '+data.o.surname + ', ' + data.o.name;
            resp.Length_m = data.m.length;
            response.end(JSON.stringify(resp));
        });
    } 
    
    else if (parsedUrl.pathname == '/xml') {
        let data = '';
        request.on('data', (chunk) => {
            data += chunk;
        });
        request.on('end', () => {
            parseString(data, function(err, result) {
                response.writeHead(200, {'Content-type': 'application/xml'});
                let id = result.request.$.id;
                let sum = 0;
                let concat = '';
                result.request.x.forEach((p) => {
                    sum += parseInt(p.$.value);
                });
                result.request.m.forEach((p) => {
                    concat += p.$.value;
                });

                let responseText = `<response id="33" request="${id}"><sum element="x" result="${sum}"/><concat element="m" result="${concat}"/></response>`;
                response.end(responseText);
            });
        });
    } 
    
    else if (parsedUrl.pathname == '/files') {
        fs.readdir( __dirname + '/static', (err, files) => {
            if (err)
                response.statusCode = 500;
            response.setHeader('X-static-files-count', files.length);
            response.end();
        });
    } 
    
    else if (pathUrls[1] == 'files') {
        fs.readFile(__dirname + '/static/' + pathUrls[2], (err, data) => {
            if (err) {
                response.statusCode = 404;
                response.end();
            } else {
                response.sendFile(__dirname + '/static/' + pathUrls[2]);
            }
        })
    } 
    
    else if (parsedUrl.pathname == '/upload') {
        if (request.method == 'GET') {
            let html = fs.readFileSync('./upload.html');
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.end(html);
        } 
        else if (request.method == 'POST') {
            let form = new mp.Form({uploadDir: './static'});
            form.on('file', (name, file) => {
            });
            form.on('close', () => {
                response.writeHead(200, {'Content-type': 'text/plain'});
                response.end("Uploaded!");
            });
            form.parse(request);
        }
    }
}).listen(5000);
console.log('Server running at http://localhost:5000/');
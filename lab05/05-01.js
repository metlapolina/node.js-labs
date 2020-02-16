var http=require('http');
var url=require('url');
var fs=require('fs');
var data=require('./database');
var readline = require('readline');

var db = new data.DB();

let isStat = false;
let countRequest = 0;
let countCommit = 0;
let date1 = 0;
let date2 = 0;
var ID = 0;

db.on('GET', (req, res)=>{
  if(isStat)
    	countRequest++;
  res.end(JSON.stringify(db.select()));
});
db.on('POST', (req, res)=>{
  if(isStat)
    	countRequest++;
  req.on('data', data=>{
    let r = JSON.parse(data);
    db.insert(r);
    res.end(JSON.stringify(r));
  });
});
db.on('PUT', (req, res)=>{
  if(isStat)
    	countRequest++;
  req.on('data', data=>{
    let r = JSON.parse(data);
    res.end(JSON.stringify(db.update(r)));
  });
});
db.on('DELETE', (req, res)=>{
  if(isStat)
    	countRequest++;
  res.end(JSON.stringify(db.delete(ID)));
});
db.on('HEAD', ()=>{
  if(isStat)
    	countCommit++;
  db.commit();
});

http.createServer(function(request, response){
  if(url.parse(request.url).pathname === '/'){
    let html = fs.readFileSync('client.html');
    response.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
    response.end(html);
  }else if(url.parse(request.url).pathname === '/api/db'){
    response.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});
    if(typeof url.parse(request.url, true).query.id!='undefined')
      ID = parseInt(url.parse(request.url,true).query.id);
    db.emit(request.method, request, response);
  }else if(url.parse(request.url).pathname === '/api/ss'){
    let res = "{startTime: " + date1 + ", endTime: " + date2 + ", countCommit: " + countCommit + ", countRequest: " + countRequest + "}";
    response.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});
    isStat = false;
    countRequest = 0;
    countCommit = 0;
    response.end(res);
  }
}).listen(5000);
 console.log('Server running at http://localhost:5000/');

function getTime() {
	var d = new Date();
	return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}

function stopStatistics(){
  console.log('calculation stopped');
  date2 = getTime();
  console.log("{startTime: " + date1 + ", endTime: " + date2 + ", countCommit: " + countCommit + ", countRequest: " + countRequest + "}");
  isStat = false;
  countCommit = 0;
  countRequest = 0; 
}

var rl = readline.createInterface({
   input:process.stdin,
   output: process.stdout,
   prompt: '>>>'
});
var timerId = 0;
var intervalId = 0;
var statId = 0;

rl.prompt();
rl.on('line', (line)=>{
  var oper = line.split(' ');
  var param = parseInt(oper[1], 10);
  switch(oper[0]){
    case 'sd':
      if(param){ 
        if(timerId!=0)
          clearTimeout(timerId);
        timerId = setTimeout(()=>{process.exit(0);}, param*1000);
      }else{  
        clearTimeout(timerId);      
        console.log('break exit process');
        timerId=0;
      }
      break;
    case 'sc':
      if(param){
        intervalId = setInterval(()=>{db.emit('HEAD');}, param*1000);
        intervalId.unref();
      }else{  
        clearInterval(intervalId);      
        console.log('break commit');
      }
      break;
    case 'ss':
      if(param){
        isStat = true;
        date1 = getTime();
        statId = setTimeout(()=>{ stopStatistics(); }, param*1000);
      }else{
        clearTimeout(statId);
        stopStatistics();
      }
      break;
    case 'exit':
      process.exit(0);
      break;
    default:
      console.log('error operation!');
      break;
   }
   rl.prompt();
});
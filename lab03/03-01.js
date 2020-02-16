var http=require('http');
const readline = require('readline');
var status = 'norm';

 http.createServer(function(request, response){
     response.writeHead(200,{'Content-Type':'text/html'});
     response.end('<h1>'+status+'</h1>\n');
 }).listen(5000);

 console.log('Server running at http://localhost:5000/');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'status->'
});

rl.prompt();

rl.on('line', (line) => {
  switch(line.trim()) {
    case 'norm':
      console.log('reg = ' +status+'-->'+line);
      status = line;
      break;
      case 'stop':
      console.log('reg = ' +status+'-->'+line);
      status = line;
      break;
      case 'test':
      console.log('reg = ' +status+'-->'+line);
      status = line;
      break;
      case 'idle':
      console.log('reg = ' +status+'-->'+line);
      status = line;
      break;
      case 'exit':
      process.exit(0);
      break;
    default:
      console.log(line);
      console.log('reg = ' +status+'-->'+status);
      break;
  }
  rl.prompt();
});
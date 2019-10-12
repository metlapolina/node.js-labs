const express = require('express');
const bodyParser = require('body-parser');
const xmlBodyParser = require('express-xml-bodyparser');
const fileUpload = require('express-fileupload');

var app = express();

app.use(fileUpload({createParentPath: true}));
app.use(xmlBodyParser({}));
app.use(bodyParser.json());

app.listen(5000);
console.log('Server running at http://localhost:5000/');

app.get('/', (request, response) => {
    response.statusCode = '201';
    response.json({data: "first task of lab09"});
});

app.get('/second', (request, response) => {
    response.json({data: "Second task of lab09. Params: "+request.query.x+", "+request.query.y});
});

app.post('/third', (request, response) => {
    response.json({data: "Third task of lab09. Params: "+request.body.x+", "+request.body.y+", "+request.body.s});
});

app.post('/fourth', (request, response) => {
    let {
        comment: comment,
        x: x,
        y: y,
        s: s,
        m: m,
        o: o
    } = request.body;
    response.json({
        __comment: 'Response. ' + comment,
        x_plus_y: x + y,
        concat_s_o: s + ': ' + o.surname + ', ' + o.name,
        length_m: m.length
    });
});

app.post('/fifth', (request, response) => {
    let xml = request.body;
    response.setHeader('Content-Type', 'text/xml');
    let sum = 0;
    let concat = '';
    xml.request.x.forEach(x => sum += Number(x.$.value));
    xml.request.m.forEach(m => concat += m.$.value);
    let responseText = `<response id="33" request="${xml.request.$.id}"><sum element="x" result="${sum}"/><concat element="m" result="${concat}"/></response>`;
    response.end(responseText);
});

app.post('/sixth', (request, response) => {
    response.end(request.files.textFile.name);
});

app.post('/seventh', (request, response) => {
    response.end(request.files.pngFile.name);
});

app.get('/eighth', (request, response) => {
    response.sendFile(__dirname+'/MyFile.txt');
});
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

let service = axios.create({
    baseURL: 'http://localhost:5000',
    responseType: "application/json"
});

service.get('/eighth')
.then(res=>{
    console.log('response: ', res.status);
    console.log('statusMessage: ', res.statusText);
    console.log('data: ' + JSON.stringify(res.data));
    console.log('response headers: ', res.headers);
});
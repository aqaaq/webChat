const express = require('express');
const fs = require('fs');
const app = express();

const compression = require('compression');
//jwt 密钥
app.use(compression());
app.set('jwtKey', '2020');
require('./db/db');
const bodyParser = require('body-parser');
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



//cors跨域
// app.use(require('cors')());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Expose-Headers", "*");
    next();
})
//静态托管文件
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.static(__dirname + '/web'));
const router = require('./router');
app.use(router);
require('./socket')(app);




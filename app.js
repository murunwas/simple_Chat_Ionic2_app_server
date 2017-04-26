const express = require('express');
const path = require('path');
const bodyParser=require('body-parser');
const cors = require('cors');
const passport = require('passport');
/*--- mongoose ----*/
const mongoose = require('mongoose');
const config = require('./config/db');
mongoose.connect(config.dataBase);
mongoose.connection.on('connected',()=>{  console.log('Connected to Database '+config.dataBase); });
mongoose.connection.on('error',(err)=>{  console.log('Database Error : '+err); });
/*-----------------*/
const app = express();
/*--- socket config ----*/
const server  = require('http').createServer(app);
const io = require('socket.io')(server);
require('./socket/socketFun').Mysocket(io);
/*---------cors---------*/
app.use(cors());
/*---------Set Static Folder-------------*/
app.use(express.static(path.join(__dirname,'public')));
/*---------body Parser MW-------------*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
/*---------passport MW---------*/
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
/*---------routes---------*/
const users = require('./routes/users');
const chat = require('./routes/chat');
app.use('/users',users);
app.use('/chat',chat);
//app.get('*',(req,res) => {  res.sendFile(path.join(__dirname,'public/index.html')); });
/*--------- test home---------*/
app.get('/',(req,res) => { res.send("<h1>Home Page Works</h1>"); });
/*--------- server listen ---------*/
const port = process.env.PORT || '3000';
server.listen(port,() => {  console.log('server started on port '+port); });

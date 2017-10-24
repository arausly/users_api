const restify = require('restify');
const plugins = require('restify-plugins');
const morgan = require('morgan');
const restifyValidator = require('restify-validator');
const mongoose = require('mongoose'); 


const serverMiddleWares = require('./controller/setupController');
const serverRoutes = require('./controller/routeController');
const { getConnection } = require('./config/dbCollection');
const UserModel = require('./model/userModel');


const server = restify.createServer();

serverMiddleWares(server, restify, restifyValidator);
serverRoutes(server);

mongoose.Promise = global.Promise;
mongoose.connect(getConnection);
mongoose.connection
  .once('open',()=> console.log('connected to database'))
  .on('error',err=> console.log('Error occured',err))
  .on('disconnected',()=> console.log('disconnected from database'));


server.listen(8080, (err)=>{
    err ? console.log(err) : console.log('%s is running at port %s',server.name,server.url);
})
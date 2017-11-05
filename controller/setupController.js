const morgan = require('morgan');
const { failure } = require('../config/helperFunctions');

module.exports= function(server,restify,restifyValidator){

    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());
    server.use(restifyValidator);
    server.use(morgan('dev'));

    server.use(restify.authorizationParser());
    //  how to utilize re.authorization api 
    //  call restify.authorizationParser()
    //  write the middleware function
    //  client :{
    //  authorization: basic{
    //    username:what the client inputs as username
    //    passwords: what the client inputs as password 
    // }
    //  }
    //  if it tallys with my written middleware function. then user is authenticated.
    server.use(function (req,res,next){
         let apiKeys = {
             "user1":'password',
         }
         if(typeof(req.authorization.basic) === "undefined" || !apiKeys[req.authorization.basic.username] || req.authorization.basic.password !== apiKeys[req.authorization.basic.username]){
            let response = {
                status:'failure',
                data:'You must specify a valid api key',
            };
            res.setHeader('content-type','application/json');
            res.writeHead(403);
            res.end(JSON.stringify(response));
            return next();
         }
           return next();
    });
    server.use(function(req,res,next){
         let whiteListedIps = ['10.0.3.232','127.0.0.12','125.0.12.232'];
         let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          if(whiteListedIps.indexOf(ip) === -1){
            let response = {
                status:'failure',
                data:'Invalid Ip address',
            };
            res.setHeader('content-type','application/json');
            res.writeHead(403);
            res.end(JSON.stringify(response));
            return next();
          }
          return next();
    })
    server.use(restify.throttle({
        rate:1,
        burst:2,
        ip:true,
        xff:true,
    }))
}
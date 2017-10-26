const morgan = require('morgan');
const { failure } = require('../config/helperFunctions');

module.exports= function(server,restify,restifyValidator){

    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.queryParser());
    server.use(restify.bodyParser());
    server.use(restifyValidator);
    server.use(morgan('dev'));

    server.use(restify.authorizationParser());

    server.use(function(req,res,next){
         let apiKeys = {
             "user1":'userapiKe278292sdbds7292dbjwebjwe',
         }
         if(typeof(req.authorization.basic) === "undefined" || !apiKeys[req.authorization.basic.username] || req.authorization.basic.password !== apiKeys[req.authorization.basic.password]){
            let response = {
                status:'failure',
                data:'You must specify a valid api key',
            };
            res.setHeader('content-type','application/json');
            res.writeHead(403);
            res.end(JSON.stringify(response));
            return next();
         }else{
             return next();
         }
    })
}
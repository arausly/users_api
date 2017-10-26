const _respond =(res,next,status,http_code,data)=>{
    let response = {status,data};
    res.setHeader('content-type','application/json');
    res.writeHead(http_code);
    res.end(JSON.stringify(response));
    return next();
}

module.exports.success =(res,next,data)=>{
  _respond(res,next,'success',200,data);
}

module.exports.failure =(res,next,data,http_code)=>{
  _respond(res,next,'failure',http_code,data);
}

module.exports.idChecker = (req,failure)=>{
  req.assert('_id','id must be provided and must be numeric').notEmpty();
  let errors =  req.validationErrors();
  if(errors) return failure(res,next,errors[0],400);
}
const { success, failure, idChecker } = require('../config/helperFunctions');
const userModel = require('../model/userModel');


module.exports = function(server){
    
        // GET API get all users
    server.get('/', (req,res,next)=>{
        userModel.find({})
        .then(users =>
            (!users) ? Promise.reject() : success(res,next,users))
        .catch(err => failure(res,next,err,404))
    });
    
    // GET API get a single user

    server.get('/user/:_id', (req,res, next)=>{
    idChecker(req,failure);
    let { _id } = req.params;
    userModel.findById(_id)
        .then(user =>  (!user) ? Promise.reject() : success(res,next,user))
        .catch(err => failure(res,next,err,404));
    })

    // POST API create a new user

    server.post('/user', (req,res,next)=>{
    req.assert('first_name','first_name must be provided').notEmpty();
    req.assert('surname','surname must be provided').notEmpty();
    req.assert('Email','valid email must be provided').notEmpty().isEmail();
    req.assert('career','career must be either software developer, Network programmer or Executive director').notEmpty().isIn(['software developer','Network programmer','Executive director']);
    let errors = req.validationErrors();
    errors ? failure(res,next,errors,400) : null;
    let {first_name, surname, Email, career} = req.params;
    let newUser = new userModel({first_name,surname,Email,career});
    newUser.save()
        .then(user =>success(res,next,user))
        .catch(err => failure(res,next,err,500));
    })


    // PATCH API  update  user details

    server.patch('/user/:_id',(req,res,next)=>{
        idChecker(req,failure);
        let { _id } = req.params;
        for( let props in req.params){
        userModel.findOneAndUpdate({_id},{$set:{props:req.params[props]}},{returnNewDocument:true})
            .then(user => (!user) ? Promise.reject() : success(res,next,user))
            .catch(err => failure(res,next,err,404));
        }
    })

    // DELETE API remove a user

    server.del('/user/:_id',(req,res,next)=>{
        idChecker(req,failure);
        let { _id } = req.params;
        userModel.findOneAndRemove({_id})
        .then(user =>  (!user) ? Promise.reject() : success(res,next,user))
        .catch(err => failure(res,next,err,404));
    })
}

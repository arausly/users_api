const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    first_name:String,
    surname:String,
    career:String,
    Email:String,
}); 

module.exports = mongoose.model('users',userSchema);
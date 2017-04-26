const mongoose = require('mongoose');
const config = require('../config/db');
const bcrypt = require('bcryptjs');

//User Schema
const UserSchema = mongoose.Schema({
  Fname:{type:String},
  Lname:{type:String,required:true},
  Email:{type:String,required:true},
  password:{type:String,required:true},
  Urole:{type:String, default: null}
});
const User = module.exports = mongoose.model("User",UserSchema);
module.exports.getUserById = (id,callback)=>{
  User.findById(id,callback);
}
module.exports.getUserByEmail = (email,callback)=>{
  const query = {Email:email}
  User.findOne(query,callback);
}
module.exports.addUser = (newUser,callback)=>{
  bcrypt.genSalt(10,(err,salt) => {
    bcrypt.hash(newUser.password,salt,(err,hash)=>{
      if(err)throw err;
     newUser.password = hash;
     newUser.save(callback);
    });
  });
}
module.exports.comparePassword = (password,hash,callback) =>{
  bcrypt.compare(password,hash,(err,isMatch) => {
    if(err)throw err;
    callback(null,isMatch);
  });
}

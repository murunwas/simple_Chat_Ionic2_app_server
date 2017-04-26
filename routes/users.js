const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config/db');
const UserFun = require('../ChatAPI/UserFun');

/*------- test --------*/
router.get('/',(req,res) => { res.send("<h1>API Page Works</h1>"); });
/*----------------register --------*/
router.post('/register',(req,res,next)=>{
let newUser = new User({Fname:req.body.f_name,Lname:req.body.l_name
  ,Email:req.body.email,password:req.body.Password});
User.addUser(newUser,(err,user)=>{
  if(err){res.json({success:false,msg:"failed To register user"});}
  else{res.json({success:true,msg:"user registered"});}
 });
});
/*----------------Authenticate --------*/
router.post('/authenticate',(req,res,next) => {
  const email =req.body.email;
  const password =req.body.password;
  User.getUserByEmail(email,(err,user)=>{
    if(err)throw err;
    if(!user){return res.json({success:false,msg:"user not found"});}
    User.comparePassword(password,user.password,(err,isMatch) =>{
      if(err)throw err;
      if(isMatch){
        const token = jwt.sign(user,config.secret,{  expiresIn:604800 /* 1 week */  });
        res.json({success:true,
          token:'JWT '+token,
          user:{  id:user._id,  Fname: user.Fname,  Lname: user.Lname,  Email: user.Email  }
        });
      }else{return res.json({success:false,msg:"password is wrong"});}
    });
  });
});
/*---------------------Get All Users------------------------*/
router.get('/getusers',passport.authenticate('jwt',{session:false}),UserFun.getAllUsers);
/*----------------Get User Data --------*/
router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next)=>{  res.json({user:req.user}); });
/*------------*/
module.exports = router;

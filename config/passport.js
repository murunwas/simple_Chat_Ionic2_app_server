const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('./db');
module.exports= (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload,done) => {
   User.getUserById(jwt_payload._doc._id,(err,user) => {
     if(err){return done(err,flase);}
     if(user){return done(null,user);}
     else{return done(null,false);}
   });
  }) );
}

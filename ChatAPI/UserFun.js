const User = require('../models/user');
const socket = require('../socket/socketFun');

exports.getAllUsers = (req, res, next) => {
User.find({}).select('_id Fname Lname')
 .exec((err, Users)=>{
   if (err) { res.send({ error: err });  return next(err);  }
   console.log(" socket.Allusers "+socket.Allusers_e);
 return res.status(200).json({ Users: Users ,Currentusers: socket.Allusers_e}); });
}

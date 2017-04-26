const mongoose = require('mongoose');
const MsgSchema   = mongoose.Schema({
  conversationId: {  type: mongoose.Schema.Types.ObjectId, required: true  }
  ,  body: {  type: String,  required: true }
  , author: {  type: mongoose.Schema.Types.ObjectId,ref: 'User'}
  }
  , {  timestamps: true /* Saves createdAt and updatedAt as dates. createdAt will be our timestamp.*/  });
module.exports=mongoose.model('Msg',MsgSchema);

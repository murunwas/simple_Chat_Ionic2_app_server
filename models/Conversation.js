const mongoose = require('mongoose');
const ConversationSchema   = mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
 ,ISawIt:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
 });
module.exports=mongoose.model('Conversation',ConversationSchema);

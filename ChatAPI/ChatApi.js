const Conversation = require('../models/Conversation'),
      User = require('../models/user'),
      Message = require('../models/message');
/*------------------get All Conversation-----------------------------------*/
exports.getAllConversations = function(req, res, next) {
// Only return one message from each conversation to display as snippet
  Conversation.find({ participants: req.user._id }).populate({path: 'participants',select: "Fname Lname"}).exec(function(err, conversations) {
    if (err) { res.send({ error: err });  return next(err); }
    // Set up empty array to hold conversations + most recent message
      let fullConversations = [];
      conversations.forEach( (conversation) => {  Message.find({ 'conversationId': conversation._id })
      .sort('-createdAt').limit(1).populate({path: "author",  select: "Fname Lname"}).exec(function(err, message) {
  if (err) { res.send({ error: err });  return next(err);  }
  if(message.length > 0){
    let secondparty =(conversation.participants[0].id == req.user._id)?conversation.participants[1]:conversation.participants[0];
  let data = {conversationId:message[0].conversationId,Lmsg:message[0].body,createdAt:message[0].createdAt,secondparty:secondparty,ISawIt:conversation.ISawIt};
      fullConversations.push(data);}
      if(fullConversations.length === conversations.length) {  return res.status(200).json({ conversations: fullConversations }); }
          });
      });
  });
}
/*------------------get One Conversation-----------------------------------*/
exports.getConversation = function(req, res, next) {
  Message.find({ conversationId: req.params.conversationId }).select('createdAt body author').exec(function(err, messages) {
    if(err){res.send({ error: err }); return next(err); }
      Conversation.findOneAndUpdate({_id: req.params.conversationId},{ $push: { ISawIt: req.user._id }},{ upsert: true,new: true},(err,doc3)=> { if(err){throw err;}
      res.status(200).json({ messages: messages, conversation: doc3 });
      });
    });
  }
  /*--------------------get One Conversation By Users---------------------*/
  exports.getConversationByUsers = function(req, res, next) {
    Conversation.findOne({$and: [{participants:req.params.user1},{participants:req.params.user2}]},(err,OldConversation)=>{
  if(OldConversation){
  Message.find({ conversationId: OldConversation._id }).select('createdAt body author').exec(function(err, messages) {
    if(err){res.send({ error: err }); return next(err); }
    Conversation.findOneAndUpdate({_id: OldConversation._id},{ $push: { ISawIt: req.user._id }},{ upsert: true,new: true},(err,doc3)=> { if(err){throw err;}
    res.status(200).json({ messages: messages, conversation: OldConversation });
    });
  });
  }else{ const conversation = new Conversation({    participants: [req.params.user1, req.params.user2]  });
    conversation.save(function(err, newConversation) {
      if(err){res.send({ error: err }); return next(err); }
      Conversation.findOneAndUpdate({_id: newConversation._id},{ $push: { ISawIt: req.user._id }},{ upsert: true,new: true},(err,doc3)=> { if(err){throw err;}
      res.status(200).json({ messages: [] , conversation: newConversation});
      });
    });
  }
  });
    }
  /*---------------------- Create New Conversation -----------------------------------------------*/
  exports.newConversation = (req, res, next) => {
   if(!req.params.recipient) {  res.status(422).send({ error: 'Please choose a valid recipient for your message.' });    return next(); }
   if(!req.body.composedMessage) {  res.status(422).send({ error: 'Please enter a message.' });  return next();  }

   const conversation = new Conversation({    participants: [req.user._id, req.params.recipient]  });

   conversation.save(function(err, newConversation) {
     if (err) {  res.send({ error: err });  return next(err); }
     const message = new Message({  conversationId: newConversation._id,  body: req.body.composedMessage,  author: req.user._id  });
     message.save(function(err, newMessage) {
       if (err) {  res.send({ error: err });    return next(err);  }
       res.status(200).json({ message: 'Conversation started!', conversationId: conversation._id });
       return next();  });
   });
 }
 /*---------------------- send Reply -----------------------------------------------*/
 exports.sendReply = function(req, res, next) {
   const reply = new Message({ conversationId: req.params.conversationId,  body: req.body.composedMessage,  author: req.user._id  });
   reply.save(function(err, sentReply) {
     if (err) {  res.send({ error: err });  return next(err);  }
     res.status(200).json({ message: 'Reply successfully sent!' });
     return(next);
   });
 }

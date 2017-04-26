//socket listen events
const Conversation = require('../models/Conversation'),
      User = require('../models/user'),
      Message = require('../models/message');
      Item_Postin=(arr,id)=> {return arr.map(x => x.id).indexOf(id);}

let Allusers = [];
exports.Allusers_e = Allusers;
exports.Mysocket = (io) => {
  /*------connection-----*/
  io.on('connection',(socket)=> {
    /*------NewUser-----*/
    socket.on('NewUser', (user) => {Allusers.push({	id : socket.id,	user : user});
     io.emit("NewUser",Allusers[Item_Postin(Allusers,socket.id)]); });
     /*------disconnect-----*/
    socket.on('disconnect',(socket2)=> {
    io.emit("user disconnect",Allusers[Item_Postin(Allusers,socket.id)]);
  Allusers.splice(Item_Postin(Allusers,socket.id),1); });
      /*--------------on type---------------*/
      socket.on('usertype',(data)=> { io.emit("Ontype"+data.C_id,data.U_id);});
      socket.on('userStoptype',(data)=> { io.emit("OnStoptype"+data.C_id,data.U_id);});
      /*--------------I Saw It---------------*/
  socket.on('I Saw It',(data)=> {
    Conversation.findOneAndUpdate({_id: data.C_id},{ $push:{ ISawIt: data.U_id } },{ upsert: true,new: true},(err,doc3)=> { if(err){throw err;}
            console.log('I Saw It'+JSON.stringify(data));  });});
    /*------Msg With conversationID-----*/
  socket.on('New Msg With conversationID',(data)=> {
   const reply = new Message({ conversationId: data.C_id ,  body: data.body,  author: data.authorId });
  reply.save(function(err, Reply) { if(err){throw err;}
  Conversation.findOneAndUpdate({_id:data.C_id},{$set:{ISawIt :[data.authorId] }},{ upsert: true,new: true},(err,conversation) =>{
    if(err){throw err;}
    let MsgListItem = {conversationId:data.C_id,Lmsg:Reply.body,createdAt:Reply.createdAt,secondparty:data.secondparty,ISawIt:conversation.ISawIt};
    io.emit("New Msg id = "+data.C_id,{msg:Reply,conversation:MsgListItem});
    io.emit("New Msg for user"+data.secondparty._id,MsgListItem);
    console.log('MsgListItem -->'+JSON.stringify(MsgListItem));});

    });
   });
  });

 }

const express = require('express');
const router = express.Router();
const ChatAPI = require('../ChatAPI/ChatApi');
const passport = require('passport');
// View messages to and from authenticated user
router.get('/', passport.authenticate('jwt',{session:false}), ChatAPI.getAllConversations );
// Retrieve single conversation
router.get('/:conversationId', passport.authenticate('jwt',{session:false}), ChatAPI.getConversation);
router.get('/:user1/:user2', passport.authenticate('jwt',{session:false}), ChatAPI.getConversationByUsers);
// Send reply in conversation
router.post('/:conversationId', passport.authenticate('jwt',{session:false}), ChatAPI.sendReply);
// Start new conversation
router.post('/new/:recipient', passport.authenticate('jwt',{session:false}), ChatAPI.newConversation);
module.exports = router;

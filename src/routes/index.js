import express from 'express';
import * as conversations from '../controllers/conversationsController'
const router = express.Router();

router.route('/conversations')
    .post(conversations.createConversation);
// router.post('/conversations', conversations.createConversation);

export default router;
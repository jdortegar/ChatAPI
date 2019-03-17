import express from 'express';
import * as conversations from '../controllers/conversationsController'
const router = express.Router();

/**
 * @api {post} /conversations
 * @apiName postConversation
 * @apiGroup Conversations
 * 
 * @apiParam (body) {String[]} members      Array of userIds members of the conversation.
 * @apiParam (body) {String}   title        Title of the conversation.
 * @apiParam (body) {String}   description  Description of the propouse of the conversation.
 * @apiParam (body) {String}   organization Organization which this members are part of.
 * @apiParam (body) {Object}   appData      Custom data object with data used in the application implementation.
 * 
 * @apiParamExample {json} Request-Example:
 *     {
 *       "members": [
 *         "05bc149a-d473-47dc-8210-d2ab0006193a",
 *         "05e6c706-5681-4821-80dc-136a16750fb2"
 *       ],
 *       "title": "Architecture Team",
 *       "description": "Main conversation of the architecture team.",
 *       "organization": "06085fc6-80a6-4be6-be8c-06bce21559b5",
 *       "appData": {
 *         "teamId": "5e38ec6b-3be7-4b04-998b-73d8f8d9f648"
 *       }
 *     }
 * @apiSuccess (Success 201) {String}   id           Unique ID of the new created conversation.
 * @apiSuccess (Success 201) {String[]} members      Array of userIds members of the conversation.
 * @apiSuccess (Success 201) {String}   title        Title of the conversation.
 * @apiSuccess (Success 201) {String}   description  Description of propouse of the conversation.
 * @apiSuccess (Success 201) {String}   organization Organization which this members are part of. 
 * @apiSuccess (Success 201) {Object}   appData      Custom data object with data used in the application Implementation.
 * 
 * @apiSuccessExample {json} Response-Example:
 *     {
 *       "id": "5fe89cfa-05d5-4da3-89d2-a4f2bfec8d51",
 *       "members": [
 *         "05bc149a-d473-47dc-8210-d2ab0006193a",
 *         "05e6c706-5681-4821-80dc-136a16750fb2"
 *       ],
 *       "title": "Architecture Team",
 *       "description": "Main conversation of the architecture team.",
 *       "organization": "06085fc6-80a6-4be6-be8c-06bce21559b5",
 *       "appData": {
 *         "teamId": "5e38ec6b-3be7-4b04-998b-73d8f8d9f648"
 *       }
 *     }
 * 
 */
router.post('/conversations', conversations.createConversation);

router.get('/conversations', conversations.getConversations);

export default router;

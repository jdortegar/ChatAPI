import _ from 'lodash';
import httpStatus from 'http-status';
import Conversation from '../models/Conversation';
import InternalServerError from '../errors/InternalServerError';

/**
 * Controller for route POST /api/v1/conversations.
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
export const createConversation = async (req, res) => {
    try {
        const conversation = new Conversation(null, req.body.members, req.body.title, req.body.description, req.body.organization, req.body.appData);
        conversation.save();
        return res.status(httpStatus.CREATED).json({
            id: conversation.id,
            title: conversation.title,
            description: conversation.description,
            members: conversation.members,
            organization: conversation.organization,
            appData: conversation.appData,
            active: conversation.active
        });
    } catch(err) {
        const error = new InternalServerError(res, 'Something went Wrong creating the conversation', err.stack);
        return error.getResponse();
    }
}

/**
 * Controller for route GET /api/v1/conversations?userId={userId}
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
export const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.getUserConversations(req.query.userId);
        const formatedConversations = _.map(conversations, (val) => {
            return {
                id: val.id,
                title: val.title,
                description: val.description,
                members: val.members,
                organization: val.organization, 
                appData: val.appData,
                active: val.true
            }
        });
        return res.json(formatedConversations);

    } catch (err) {
        console.error(err);
        const error = new InternalServerError(res, 'Something went wrong retrieving conversations', err.stack);
        return error.getResponse();
    }
}

export const updateConversations = async (req, res) => {
    try {
        const conversation = await Conversation.find(req.params.conversationId);
        conversation.update(req.body);
        conversation.save();
        return res.json(conversation._extract());
    } catch (err) {
        console.error(err);
        const error = new InternalServerError(res, 'Something went wrong updating conversation', err.stack);
        return error.getResponse();
    }
}
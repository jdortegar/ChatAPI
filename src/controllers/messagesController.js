import httpStatus from 'http-status';
import Message from '../models/Message';
import { ChannelFactory, EventTypes } from '../services/socket/factory';
import InternalServerError from '../errors/InternalServerError';

/**
 * Controller for route POST /conversations/:conversationId/messages
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
export const createMessage = async (req, res) => {
    const conversationId = req.params.conversationId;
    const userId = req.body.userId;
    const content = req.body.content;
    const replyTo = req.body.replyTo;
    const message = new Message(null, conversationId, content, userId, replyTo);
    try {
        req.app.locals.chatSocket.sendEvent(EventTypes.messageCreated, message._extract(), ChannelFactory.conversationChannel(conversationId));
        message.save();
        return res.status(httpStatus.CREATED).json(message._extract());
    } catch(err) {
        //TODO: Send an event on save message.
        console.error(err);
        const error = new InternalServerError(res, 'Something went wrong trying to save the message.', err.stack);
        return error.getResponse();
    }
}
 
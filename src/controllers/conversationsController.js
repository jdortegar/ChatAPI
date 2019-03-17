import httpStatus from 'http-status';
import Conversation from '../models/Conversation';

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
        console.error(err);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            error: 'Internal Server Error',
            message: 'Something went wrong creating the conversation'
        });
    }
}

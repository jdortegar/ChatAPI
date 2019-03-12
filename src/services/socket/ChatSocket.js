import _ from 'lodash';
import SocketIO from 'socket.io';
import socketioJwt from 'socketio-jwt';
import socketIOWildcard from 'socketio-wildcard';
import SocketIoRedisAdapter from 'socket.io-redis';
import config from '../../config';
import Conversation from '../../models/Conversation';

/**
 * Here every time the user logs in we need to join 
 */
const joinCurrentChannels = async (socket, userId) => {
    try {
        const conversations = await Conversation.getUserConversations(userId);
        _.foreach(conversations, (conversation) => {
            const channelName = `conversationId=${conversation.id}` 
            socket.join(channelName);
            if (config.app.environment == 'dev') {
                console.info(`ChatService: userId=${userId} joining ${channelName}`);
            }
        });
    } catch (err) {
        return Promise.reject(err);
    }
}
/**
 * Class to Manage all the socket connection related to chat.
 */
class ChatSocket {
    init(httpServer) {
        this.httpServer =httpServer;
        this.io = new SocketIO(this.httpServer);
        this.io.use(new socketIOWildcard());
        this.io.origins(config.app.corsOrigins);
        this.io
            .on('connection', socketioJwt.authorize({
                secret: config.app.jwtSecret,
                timeout: 15000,
                callback: false
            }))
            .on('authenticated', async (socket) => {
                try {
                    await this._connected(socket);
                } catch (err) {
                    console.error(err);
                    return Promise.reject(err);
                }
            });
    }

    /**
     * Here we get some data from the socket and connects the user to the different channels.
     * 
     * @param {WebSocket} socket 
     */
    async _connected(socket) {
        const userId = socket.decoded_token._id;
        const address = socket.client.conn.remoteAddress;
        const userAgent = socket.client.request.headers['user-agent'];
        const location = undefined;
        if (config.app.environment === 'dev') {
            console.info(`ChatSocket: User connected sId=${socket.id} userId=${userId} ${socket.decoded_token.email} address=${address} userAgen=${userAgent}`);
        }
        await joinCurrentChannels(socket, userId);
        this._prescenceChanged(userId, address, userAgent, location, 'online');
    }

    _prescenceChanged() {
        // TODO: Implement this method to broadcast the presence of the user.
    }
    
}

export default ChatSocket;
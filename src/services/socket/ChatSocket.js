import _ from 'lodash';
import SocketIO from 'socket.io';
import socketioJwt from 'socketio-jwt';
import socketIOWildcard from 'socketio-wildcard';
import SocketIoRedisAdapter from 'socket.io-redis';
import { EventTypes, ChannelFactory } from './factory';
import config from '../../config';
import Conversation from '../../models/Conversation';
import * as Presence from './presence';

/**
 * Here every time the user logs in we need to join 
 */
const joinCurrentChannels = async (socket, userId) => {
    try {
        const conversations = await Conversation.getUserConversations(userId);
        _.foreach(conversations, (conversation) => {
            const channelName = ChannelFactory.conversationChannel(conversation.id);
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
    /**
     * Initialize Socket connection.
     * @param {Object} httpServer 
     */
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
                }
                socket.on('message', (eventType, event) => {
                    this._message(socket, eventType, event);
                });
                socket.on('disconnect', async (reason) => {
                    try {
                        await this._disconnected(socket, reason);
                    } catch(err) {
                        console.error(err);
                    }
                });
                socket.on('error', (error) => {
                    console.error(`ChatSocket: error. ${error}`)
                });
            });
    }

    /**
     * Here we get some data from the socket and connects the user to the different channels.
     * 
     * @param {WebSocket} socket 
     */ 
    async _connected(socket) {
        try {
            const userId = socket.decoded_token._id;
            const address = socket.client.conn.remoteAddress;
            const userAgent = socket.client.request.headers['user-agent'];
            const location = undefined;
            if (config.app.environment === 'dev') {
                console.info(`ChatSocket: User connected sId=${socket.id} userId=${userId} ${socket.decoded_token.email} address=${address} userAgen=${userAgent}`);
            }
            await joinCurrentChannels(socket, userId);
            this._presenceChanged(userId, address, userAgent, location, 'online');
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Send a broadcast event telling everyone that user changed his prescence.
     * 
     * @param {String} userId 
     * @param {String} address 
     * @param {String} userAgent 
     * @param {String} location 
     * @param {String} presenceStatus 
     * @param {String} presenceMessage 
     */
    async _presenceChanged(userId, address, userAgent, location, presenceStatus, presenceMessage) {
        try {
            const presence = { userId, address, userAgent, location, presenceStatus, presenceMessage };
            this._broadcastEvent(EventTypes.prescenceChanged, presence);
            await Presence.setPresence(userId, presence);
        } catch(err) {
            console.error(err);
            return Promise.reject(err);
        }
    }

    /**
     * Broadcast an event with an event type
     * @param {String} eventType 
     * @param {String} event 
     * @param {Array} channels 
     */
    async _broadcastEvent(eventType, event, channels = undefined) {
        if (channels) {
            channels.forEach((channel) => {
                this.io.in(channel).emit(eventType, event);
            });
        } else {
            this.io.emit(eventType, event);
        }
        if (config.app.environment === 'dev') {
            const channelsString = (channels) ? `, channels="${JSON.stringify(channels)}"` : '';
            console.info(`ChatSocket.broadcastEvent(eventType=${eventType}, event=${JSON.stringify(event)})${channelsString}`);
        }
    }
    
    /**
     * Checks the type of message and send an event for that (for now only typing related message was migrate)
     * NOTE: chat messages are not managed here is for status messages.
     * 
     * @param {SocketIO} socket 
     * @param {String} eventType 
     * @param {String} event 
     */
    _message(socket, eventType, event) {
        if (eventType === EventTypes.typing && event.conversationId) {
            const userId = socket.decoded_token._id;
            const channel = ChannelFactory.conversationChannel(conversationId);
            socket.to(channel).emit(eventType, { userId, conversationId, isTyping: event.isTyping });
        } else {
            console.warn(`ChatSocket: Dropping Message received from sId=${socket.id} userId=${socket.decoded_token._id} ${socket.decoded_token.email}. eventType=${eventType},
                event=${event}`);
        }

    }

    /**
     * Takes the actions needed when user disconects, like changing the status presence.
     * 
     * @param {SocketIO} socket 
     * @param {String} reason 
     */
    async _disconnected(socket, reason) {
        try {
            const userId = socket.decoded_token._id;
            const address = socket.client.conn.remoteAddress;
            const userAgent = socket.client.request.headers['user-agent'];
            const location = undefined;
            if (config.app.environment === 'dev') {
                console.debug(`ChatSocket: User disconnected. sId=${socket.id} userId=${userId} ${socket.decoded_token.email} address=${address} userAgent=${userAgent} (${reason})`);
            }
            this._presenceChanged(req, userId, address, userAgent, location, 'away');
        } catch(err) {
            return Promise.reject(err);
        }
    }
}

export default ChatSocket;

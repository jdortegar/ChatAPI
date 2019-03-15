import uuid from 'uuid';
import _ from 'lodash';
import * as conversationsDB from '../db/conversations';

export class Conversation {
    constructor(id = null, members= [], title = null, description = null, appData = {}, active = true) {
        this.id = id;
        this.members = members;
        this.title = title;
        this.description = description;
        this.appData = appData;
        this.active = active;
    }

    /**
     * Return an array of all user Conversations.
     * 
     * @param {String} userId 
     */
    static async getUserConversations(userId) {
        try {
            const results = await conversationsDB.getConversationsByUserId(userId);
            const collection = [];
            _.foreach(results, (val) => {
                collection.push(new Conversation(val.id, val.members, val.title, val.description, val.appData, val.active));
            });
            return collection;
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async save() {
        try {
            if (!this.id) {
                this.id = uuid.v4();
                await conversationsDB.createConversation(this.id, this.members, this.title, this.description, 0, this.appData, this.active)
                this.messageCount = 0;
                return this;
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Find a unique instance of conversation by Conversation id.
     * 
     * @param {String} id 
     */
    static async find(id) {
        const conversation = await conversationsDB.getConversationById(id);
        console.log(conversation);
    }
}

export default Conversation;

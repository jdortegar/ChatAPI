import uuid from 'uuid';
import _ from 'lodash';
import * as conversationsDB from '../db/conversations';

export class Conversation {
    constructor(id = null, members= [], title = null, description = null, appData = {}, active = true) {
        this.id = (id) ? id : uuid.v4();
        this.members = members;
        this.title = title;
        this.description = description;
        this.appData = appData;
        this.active = true;
    }

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
}

export default Conversation;

import uuid from 'uuid';
import _ from 'lodash';
import * as conversationsDB from '../db/conversations';

export class Conversation {
    constructor(id = null, members= [], title = null, description = null, organization = null, appData = {}, active = true, messageCount = 0) {
        this.id = id;
        this.members = members;
        this.title = title;
        this.description = description;
        this.organization = organization;
        this.appData = appData;
        this.active = active;
        this.messageCount = messageCount;
        this._originalValues = this._extract();
    }

    /**
     * Extracts the properties to an Object.
     */
    _extract() {
        return {
            id: this.id, 
            members: _.cloneDeep(this.members),
            title: this.title,
            description: this.description,
            organization: this.organization,
            appData: _.cloneDeep(this.appData),
            active: this.active, 
            messageCount: this.messageCount
        }

    }
    
    /**
     * Update the object with the given object.
     * @param {Object} props 
     */
    update(props) {
        _.forOwn(props, (val, key) => {
            this[key] = val;
        });    
    }
    /**
     * Return an array of all user Conversations.
     * 
     * @param {String} userId 
     */
    static async getUserConversations(userId) {
        try {
            const results = await conversationsDB.getConversationsByUserId(userId);
            console.log(results);
            const collection = [];
            _.forEach(results, (val) => {
                collection.push(new Conversation(val.id, val.members, val.title, val.description, val.organization, val.appData, val.active, val.messageCount));
            });
            return collection;
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Creates or update a conversation.
     */
    async save() {
        try {
            if (!this.id) {
                this.id = uuid.v4();
                await conversationsDB.createConversation(this.id, this.members, this.title, this.description, 0, this.organization,  this.appData, this.active)
                this.messageCount = 0;
                return this;
            } 
            await conversationsDB.updateConversation(this.id, this._extract(), this._originalValues);
            this._originalValues = this._extract();
            return this;
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
        try {
            const data = await conversationsDB.getConversationById(id);
            if (!data) {
                return null;
            }
            return new Conversation(data.id, data.members, data.title, data.description, data.organization, data.appData, data.active, data.messageCount);
        } catch (err) {
            return Promise.reject(err);
        }
    }


}

export default Conversation;

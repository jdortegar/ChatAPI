import moment from 'moment';
import uuid from 'uuid';
import Model from './Model';
import Conversation from './Conversation';
import * as messagesDB from '../db/messages';

class Message extends Model {
    constructor(id = null, conversationId= null, content = null, createdBy =null, replyTo = null) {
        const now = moment();
        // this._new property is for checking if update or create on save.
        if (!id) {
            this.id = uuid.v4();
            this._new = true;
        } else {
            this.id = id;
            this._new = false;
        }
        this.conversationId = conversationId;
        this.content = content;
        this.replyTo = replyTo;
        this.createdBy = createdBy;
        this.byteCount = this._byteCountOfContent();
        this.created = now.format();
        this.lastModified = now.format();
        this._originalValues = this._extract();
    }

    /**
     * INTERNAL Extracts the properties to an Object
     */
    _extract() {
        return {
            id: this.id,
            conversationId: this.conversationId,
            content: this.content,
            replyTo: this.replyTo,
            createdBy: this.createdBy, 
            byteCount: this.byteCount,
            created: this.created,
            lastModified: this.lastModified,
        }
    }

    /**
     * INTERNAL Calculates the byte count of the content.
     */
    _byteCountOfContent() {
        let byteCount = 0;
        this.content.forEach((entry) => {
            if ((entry.meta) && (entry.meta.fileSize)) {
                byteCount += entry.meta.fileSize;
            } else if (entry.type === 'text/plain') {
                byteCount += Buffer.byteLength(entry.text, 'utf8');
            }
        });
        return byteCount;
    }

    /**
     * Returns the conversation of the message. We use promise here because we need some practical way to get the 
     * conversation without await for it
     */
    conversation() {
        if (this._conversation && this._conversation.id === this.conversationId) {
            return this._conversation
        }
        return Conversation.find(this.conversationId)
            .then((conversation) => {
                this._conversation = conversation;
                return conversation;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    async save() {
        if (this._new) {
            await messagesDB.createMessage(this.id, this.conversationId, this.content, this.replyTo, this.createdBy, this.byteCount, this.created, this.lastModified);
            this._new = false;
            return this;            
        }
    }

} 

export default Message;

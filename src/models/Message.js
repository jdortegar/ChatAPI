import moment from 'moment';
import uuid from 'uuid';
class Message {
    constructor(id = null, conversationId= null, content = null, createdBy =null, replyTo = null) {
        const now = moment();
        this.id = (id) ? id : uuid.v4();
        this.conversationId = conversationId;
        this.content = content;
        this.replyTo = replyTo;
        this.createdBy = createdBy;
        this.byteCount = this._byteCountOfContent();
        this.created = now.format();
        this.lastModified = now.format();
    }
    
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
} 

export default Message;

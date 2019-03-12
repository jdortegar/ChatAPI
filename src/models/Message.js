import moment from 'moment';
class Message {
    constructor(conversationId, content, createdBy, replyTo = null) {
        const now = moment();
        this.conversationId = conversationId;
        this.content = content;
        this.replyTo = replyTo;
        this.createdBy = createdBy;
        this.byteCount = this.byteCountOfContent();
        this.created = now.format();
        this.lastModified = now.format();
    }
    
    byteCountOfContent() {
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
class Conversation {
    constructor(members, title = null, description = null, appData = {}) {
        this.members = members;
        this.title = title;
        this.description = description;
        this.messageCount = 0;
        this.appData = appData;
    }
}

export default Conversation;
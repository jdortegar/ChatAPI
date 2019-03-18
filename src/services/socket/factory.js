export const EventTypes = Object.freeze({
    prescenceChanged: 'prescenceChanged',
    typing: 'typing',
    messageCreated: 'messageCreated'
});

export class ChannelFactory {
    static conversationChannel(conversationId) {
        return `conversationId=${conversationId}`;
    }
}
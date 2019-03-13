export const EventTypes = Object.freeze({
    prescenceChanged: 'prescenceChanged',
    typing: 'typing',
});

export class ChannelFactory {
    static conversationChannel(conversationId) {
        return `conversationId=${conversationId}`;
    }
}
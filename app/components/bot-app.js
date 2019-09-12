import Component from '@ember/component';
import axios from 'npm:axios';
import Pusher from 'npm:pusher-js';

export default Component.extend({
    chats: null,
    init() {
        this._super(...arguments);
        this.set('chats', []);
        let pusher = new Pusher('e2f057935436900cfe0d', { // update your APP_KEY
            cluster: 'ap2',
            encrypted: true
        });
        const channel = pusher.subscribe('bot');
        channel.bind('bot-response', data => {
            const response = {
                speech: data.speech,
                query: data.query
            }
            this.get('chats').pushObject(response);
        });
    },

    actions: {
        sendChat() {
            const text = this.get('message');
            axios.post('http://localhost:3000/dialogue', { text });
            this.set('message', '');
        }
    }
});
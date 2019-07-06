import { Events } from '../shared';
import Match from './match';

const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8080
});

class MatchManager {

    constructor() {
        this.matches = [];
        this.matchesQueue = [];
        this.matchesCount = 0;
    }

    addMatchToQueue(matchId) {
        this.matchesQueue.push(matchId);
    }

    findAvailableMatch() {
        if (this.matchesQueue[0] !== undefined) {
            let matchId = this.matchesQueue[0];
            for (const match of this.matches) {
                if (match.id == matchId) {
                    if (match.playerCount == 1) {
                        this.matchesQueue.shift();
                    }
                    return match;
                }
            }
        }
        
        let newMatch = new Match(this.matchesCount, this);
        this.matches.push(newMatch);
    
        this.matchesQueue.push(newMatch.id);
    
        this.matchesCount++;
        
        return newMatch;
    }
}

let matchManager = new MatchManager();

wss.on('connection', (socket, req) => {
    console.log(`Nova conexão recebida`);

    socket.match = matchManager.findAvailableMatch();
    socket.match.joinPlayer(socket);

    socket.on('message', (message) => {
        let streams = message.split(';');

        for (let i = 0; i < streams.length; i++) {
            const stream = streams[i].split('-');
            
            switch (parseInt(stream[0])) {
                case Events.ChangeCell:
                    let value = parseInt(stream[1]);
                    
                    if (!isNaN(value)) {
                        socket.match.changeCell(socket, value);
                    }
                    break;
                
                case Events.FindGame:
                    socket.match = matchManager.findAvailableMatch();
                    socket.match.joinPlayer(socket);
            
                default:
                    break;
            }
        }
    });

    socket.on('close', () => {
        if (socket.match)
            socket.match.leavePlayer(socket);
    });
});
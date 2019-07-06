export class DataStream {
    // This class represents an event queue in the following format:
    // event-value;event-value;event-value....
    // Arrays can be represented using ',':
    // event-value,value,value;event-value;event-value,value

    constructor() {
        this.streams = [];
    }

    queue(event, value) {
        let stream = [event.toString()];

        if (value !== undefined) {
            if (Array.isArray(value)) {
                stream.push(value.join(','));
            }
            else {
                stream.push(value.toString());
            }
        }
        
        this.streams.push(stream);
        return this;
    }

    output() {
        let result = [];
        for (let i = 0; i < this.streams.length; i++) {
            const stream = this.streams[i];
            result.push(stream.join('-'));
        }
        this.streams.splice(0, this.streams.length);
        return result.join(';');
    }
}

export const Events = {
    GameStart: 0,
    GameOver: 1,
    GameTied: 2,
    ChangeCell: 3,
    YouAre: 4,
    ChangeTurn: 5,
    WinnerCells: 6,
    FindGame: 7,
    EnemyLeave: 8,
};

export const Values = {
    None: 0,
    Cross: 1,
    Circle: 2,
    Tie: 3,
};
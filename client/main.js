import { DataStream, Events } from '../server/shared';

let host = location.origin.replace(/^http/, 'ws');
let ws = new WebSocket(host);

let infoEl = document.querySelector('#game-info');
let boardEl = document.querySelector('#board');
let newGameEl = document.querySelector('#new-game');
let abandonInfo = document.querySelector('#enemy-disconnect');
let yourMarkEl = document.querySelector('#your-mark');

let isGameOver = false;
let currentMark = null;

let streams = new DataStream();

ws.onopen = function onopen() {
    console.log('Connected');
    infoEl.textContent = 'Searching for an opponent...';
};

ws.onclose = function close() {
    console.log('Disconnected');
};

ws.onerror = function error() {
    console.log('Failed to connect to the server');
    infoEl.textContent = 'Failed to connect to the server';
};

ws.onmessage = function(message) {
    var streams = message.data.split(';');

    for (let i = 0; i < streams.length; i++) {
        const stream = streams[i].split('-');

        switch (parseInt(stream[0])) {
            case Events.GameStart:
                yourMarkEl.classList.remove('hidden');
                infoEl.classList.add('text-right');
                boardEl.classList.remove('hidden');
                break;
            
            case Events.ChangeTurn:
                var value = parseInt(stream[1]);
                
                if (currentMark == value) {
                    infoEl.textContent = 'Your turn!';
                }
                else {
                    infoEl.textContent = `${(value == 1 ? 'X' : 'O')}'s turn!`;
                }
                break;
            
            case Events.ChangeCell:
                var values = stream[1].split(',');

                var cellId = parseInt(values[0]);
                var mark = parseInt(values[1]);

                var cellEl = document.querySelector(`#cell-${cellId}`);
                cellEl.textContent = mark == 1 ? 'X' : 'O';
                break;
            
            case Events.GameOver:
                infoEl.textContent = (parseInt(stream[1]) == 1 ? 'X' : 'O') + ' won!';
                newGameEl.classList.remove('hidden');
                isGameOver = true;
                break;
            
            case Events.EnemyLeave:
                abandonInfo.classList.remove('hidden');
                isGameOver = true;
                break;
            
            case Events.GameTied:
                infoEl.textContent = 'Tie!';
                newGameEl.classList.remove('hidden');
                isGameOver = true;
                break;
            
            case Events.YouAre:
                currentMark = parseInt(stream[1]);
                yourMarkEl.textContent = `You're the ${(currentMark == 1 ? 'X' : 'O')}`;
                break;
            
            case Events.WinnerCells:
                let cells = stream[1].split(',');
                for (const cellId of cells) {
                    document.querySelector(`#cell-${cellId}`).classList.add('cell-winner');
                }
                break;
            
            default:
                break;
        }
    }
}

function onClickCell(event) {
    if (ws.readyState == 1 && !isGameOver) { // aberto
        var cell = event.target.id.split('-');
        cell.shift();

        ws.send(streams
            .queue(Events.ChangeCell, parseInt(cell[0]))
            .output()
        );
    }
}

for (const cellEl of document.querySelectorAll('.cell')) {
    cellEl.addEventListener('click', onClickCell);
}

newGameEl.addEventListener('click', function(event) {

    currentMark = null;
    isGameOver = false;

    boardEl.classList.add('hidden');
    yourMarkEl.classList.add('hidden');
    infoEl.classList.remove('text-right');
    infoEl.textContent = 'Searching for an opponent...';
    abandonInfo.classList.add('hidden');

    streams.output();

    for (let i = 0; i < 9; i++) {
        let cellEl = document.querySelector(`#cell-${i}`);
        cellEl.classList.remove('cell-winner');
        cellEl.textContent = '';
    }

    this.classList.add('hidden');

    ws.send(streams
        .queue(Events.FindGame)
        .output()
    );
});
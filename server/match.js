import { DataStream, Values, Events } from './shared';
const { None, Cross, Circle, Tie } = Values;

const winningPositions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];

export default class Match {

    constructor(id, matchManager) {
        this.id = id;
        this.matchManager = matchManager;
        this.crossPlayer = null;
        this.circlePlayer = null;
        this.turn = None;
        this._isOver = false;

        this.board = Array(9).fill(None);
        this.stream = new DataStream();
    }

    startMatch() {
        console.log(`Iniciando partida...`);

        this.crossPlayer.send(this.stream
            .queue(Events.YouAre, Values.Cross)
            .queue(Events.GameStart)
        .output());

        this.circlePlayer.send(this.stream
            .queue(Events.YouAre, Values.Circle)
            .queue(Events.GameStart)
        .output());

        this.changeTurn();
    }

    endMatch(isTied, winnerCells) {
        console.log(`Partida encerrada!`);

        this._isOver = true;

        if (isTied) {

            this.crossPlayer.send(this.stream
                .queue(Events.GameTied)
                .output()
            );

            this.circlePlayer.send(this.stream
                .queue(Events.GameTied)
                .output()
            );

            return;
        }

        this.crossPlayer.send(this.stream
            .queue(Events.GameOver, this.turn)
            .queue(Events.WinnerCells, winnerCells)
            .output()
        );

        this.circlePlayer.send(this.stream
            .queue(Events.GameOver, this.turn)
            .queue(Events.WinnerCells, winnerCells)
            .output()
        );

        this.resetMatch();
    }

    changeCell(socket, cell) {
        if (this.turn == None)
            return;
        
        if ((this.circlePlayer == socket && this.turn != Circle)
            || (this.crossPlayer == socket && this.turn != Cross))
            return;

        if (cell >= 0 && cell <= 8) {
            if (this.board[cell] != None)
                return;
            
            this.board[cell] = this.turn;
            
            this.crossPlayer.send(this.stream
                .queue(Events.ChangeCell, [cell, this.turn])
                .output()
            );

            this.circlePlayer.send(this.stream
                .queue(Events.ChangeCell, [cell, this.turn])
                .output()
            );

            let winner = this.checkWinner();
            
            if (!winner) {
                this.changeTurn();
            }
            else if (winner == Tie) {
                console.log('Empate!');
                this.endMatch(true);
            }
            else {
                console.log(`${winner[0] == Cross ? 'X' : 'O'} venceu!`);
                this.endMatch(false, winner[1]);
            }
        }
    }

    joinPlayer(socket) {
        if (this.crossPlayer && this.circlePlayer) {
            console.error(`Conexão negada (${socket})`);
            return false;
        }

        if (!this.crossPlayer) {
            this.crossPlayer = socket;
            console.log(`Jogador entrou na sala como X.`);
            if (this.circlePlayer) {
                this.startMatch();
            }
            return true;
        }

        if (!this.circlePlayer) {
            this.circlePlayer = socket;
            console.log(`Jogador entrou na sala como O.`);
            if (this.crossPlayer) {
                this.startMatch();
            }
            return true;
        }
    }

    leavePlayer(socket, reason) {

        if (this.circlePlayer == socket) {
            this.circlePlayer = null;
            if (!this.isOver && this.crossPlayer) {
                this.crossPlayer.send(this.stream
                    .queue(Events.EnemyLeave)
                    .queue(Events.GameOver, Values.Cross)
                    .output()
                );
            }
        }
        
        if (this.crossPlayer == socket) {
            this.crossPlayer = null;
            if (!this.isOver && this.circlePlayer) {
                this.circlePlayer.send(this.stream
                    .queue(Events.EnemyLeave)
                    .queue(Events.GameOver, Values.Circle)
                    .output()
                );
            }
        }
        
        this.turn = None;

        this.resetMatch();
    }

    checkWinner() {

        const board = this.board;
        for (const combination of winningPositions) {
            if (board[combination[0]] == board[combination[1]] && board[combination[0]] == board[combination[2]] && board[combination[0]] != None) {
                return [board[combination[0]], combination];
            }
        }

        let checked = 0;
        for (const cell of board) {
            if (cell != None)
                checked++;
        }

        if (checked == 9)
            return Tie;

        return null;
    }

    changeTurn() {
        this.turn = this.turn == Cross ? Circle : Cross;

        this.crossPlayer.send(this.stream
            .queue(Events.ChangeTurn, this.turn)
            .output()
        );

        this.circlePlayer.send(this.stream
            .queue(Events.ChangeTurn, this.turn)
            .output()
        );
    }

    resetMatch() {
        if (this.crossPlayer)
            this.crossPlayer.match = undefined;
        
        if (this.circlePlayer)
            this.circlePlayer.match = undefined;
        
        this.crossPlayer = null;
        this.circlePlayer = null;
        this._isOver = false;
        this.turn = None;
        this.board = Array(9).fill(None);
        this.stream.output();
        this.matchManager.addMatchToQueue(this.id);
    }

    get isOver() {
        return this._isOver;
    }

    get isAvailable() {
        return (!this.crossPlayer || !this.circlePlayer);
    }

    get playerCount() {
        let count = 0;

        if (this.crossPlayer)
            count++;
        
        if (this.circlePlayer)
            count++;
        
        return count;
    }
}
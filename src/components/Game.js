import React from 'react';
import Board from './Board';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const winningLine = lines.find((line) => {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return true;
    }
    return false;
  });
  if (!winningLine) {
    return null;
  }
  return {
    winningSquares: winningLine,
    winningPlayer: squares[winningLine[0]],
  };
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          moveLocation: '',
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isMovesSortReversed: false,
    };
  }

    
  calculateLocationBasedOnClickedFieldIndex(idxOfClickedFieldOnBoard){
    // Record the move location history for display.
    // Square position 6 (bottom-left) is equivalent to (1, 3).
    // Use the shared state squares width dimension as rowCount.
    const rowCount = Math.sqrt(this.state.history[0].squares.length); // Wurzel aus 9 = 3 rows
    // moveLocation = string = Column,Row, i.e. 1,3
    var col = (idxOfClickedFieldOnBoard % rowCount) + 1;
    var row = Math.floor((idxOfClickedFieldOnBoard / rowCount) + 1);
    const moveLocation = [col, row].join(', ');

    return moveLocation;
  }

  // make copy of history entries from 0 to currentStep
  // get last history entry of history[]
  // cost squares = make copy of lastEntry.squares
  // moveLocation: location of the clicked field (location = "col,row") is added to the history entry
  // check if winner exists or if current clicked field was already clicked/set -> if one is true -->return;
  // else: 
  // set X|O value into field basd on clicked index in squares[]
  // update state object
  handleClick(idxOfClickedFieldOnBoard) {
   
    console.log("idxOfClickedFieldOnBoard: " + idxOfClickedFieldOnBoard);
    debugger;
    const currentStep = this.state.stepNumber + 1;
    const history = this.state.history.slice(0, currentStep); // make copy of history until currentStep
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // make copy of squares array, will be added to history[] later

    // moveLocation format = col,row (is not index based)
    const moveLocation = this.calculateLocationBasedOnClickedFieldIndex(idxOfClickedFieldOnBoard);

    console.log("moveLocation: " + moveLocation); 

    if (calculateWinner(squares) || squares[idxOfClickedFieldOnBoard]) {
      return;
    }

    squares[idxOfClickedFieldOnBoard] = this.state.xIsNext ? 'X' : 'O';

    this.setState({ // set the new state
      history: history.concat([ // add current snapshot to history
        {
          squares,
          moveLocation,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  } // handleClick end

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: !(step % 2),
    });
  }

  changeMovesSort(isMovesSortReversed) {
    this.setState({
      isMovesSortReversed: !isMovesSortReversed,
    });
  }

  render() { // Game
    const history = this.state.history;
    const current = history[this.state.stepNumber]; // get current board snapShot

    const winner = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = `Winner: ${winner.winningPlayer}`;
    } else if (this.state.stepNumber === 9) {
      status = 'Draw';
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    // create a list of history entries - <li><Button></Button></li> elements
    const moves = history.map((snapshot, stepIdx) => {
      const historyEntryButtonText = stepIdx ? `Move #${stepIdx} (${snapshot.moveLocation})` : 'Game start';
      return (      
        <li key={stepIdx}>
          <button
            onClick={() => this.jumpTo(stepIdx)}
            className={this.state.stepNumber === stepIdx ? 'button--link strong' : 'button--link'}
          >
            {historyEntryButtonText}
          </button>
        </li>
      );
    });

    const { isMovesSortReversed } = this.state;

    return (
      <div className="game">
        <div>
          <Board
            winningSquares={winner && winner.winningSquares}
            squares={current.squares}
            onClick={idx => this.handleClick(idx)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div> {/* Winner / Draw / Next player X|O */}

          <ol reversed={isMovesSortReversed ? 'reversed' : ''}>
            {isMovesSortReversed ? moves.reverse() : moves} {/* render history of li>button asc|desc */}
          </ol>

          <p><strong>Sort: </strong>{isMovesSortReversed ? 'Descending' : 'Ascending'}</p>
          <button onClick={() => this.changeMovesSort(isMovesSortReversed)}>
            Toggle Sort
          </button>
        </div>
      </div>
    );
  }
}
export default Game;

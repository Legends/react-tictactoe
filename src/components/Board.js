import React from 'react';
import Square from './Square';

class Board extends React.Component {
   render() {
    // Based on previous hardcoded values of Game state.squares: [0, 1, 2, 3, 4, 5, 6, 7, 8]
    // Output squares in the format [[0, 1, 2], [3, 4, 5], [6, 7, 8]]
    const { squares, winningSquares } = this.props;
    const rows = Array(Math.sqrt(this.props.squares.length)).fill(null);
    const cells = rows;
    const rowsWrap = rows.map((row, i) => {
      const cellsWrap = cells.map((cell, j) => {
        const squareIdx = (rows.length * i) + j;
      
        return (
          // eslint-disable-next-line react/no-array-index-key
          <span key={squareIdx}>
          
          <Square
          value={squares[squareIdx]}
          winnerClass={winningSquares && winningSquares.includes(squareIdx) ? 'square--winner' : ''}
          onClick={() => this.props.onClick(squareIdx)}
        />

        </span>
        );
      });
      return (
        // eslint-disable-next-line react/no-array-index-key
        <div className="board-row" key={i}>{cellsWrap}</div>
      );
    });
    return (
      <div>{rowsWrap}</div>
    );
  }
}
export default Board;

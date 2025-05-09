import React, { useState } from 'react';
import { Button, Grid, Box, Typography, List, ListItem, ListItemButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Определяем типы
type SquareValue = 'X' | 'O' | null;
type BoardState = SquareValue[];

// Создаем кастомную тему
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

interface SquareProps {
  value: SquareValue;
  onSquareClick: () => void;
}

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <Button
      variant="outlined"
      className="square"
      onClick={onSquareClick}
      style={{
        width: '100px',
        height: '100px',
        fontSize: '2rem',
        margin: '4px',
      }}
    >
      {value}
    </Button>
  );
}

interface BoardProps {
  xIsNext: boolean;
  squares: BoardState;
  onPlay: (nextSquares: BoardState) => void;
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square !== null); // Проверка на ничью
  
  let status: string;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = 'Game ended in a draw!'; // Сообщение о ничьей
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>{status}</Typography>
      <Grid container spacing={1}>
        {[0, 1, 2].map(row => (
          <Grid item key={row} container justifyContent="center">
            {[0, 1, 2].map(col => {
              const index = row * 3 + col;
              return (
                <Grid item key={index}>
                  <Square 
                    value={squares[index]} 
                    onSquareClick={() => handleClick(index)} 
                  />
                </Grid>
              );
            })}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default function Game() {
  const [history, setHistory] = useState<BoardState[]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: BoardState) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? `Go to move #${move}` : 'Go to game start';
    return (
      <ListItem key={move} disablePadding>
        <ListItemButton onClick={() => jumpTo(move)}>
          <Typography>{description}</Typography>
        </ListItemButton>
      </ListItem>
    );
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
        }}
      >
        <Box className="game-board" mr={4}>
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </Box>
        <Box className="game-info">
          <Typography variant="h6" mb={1}>Moves History:</Typography>
          <List>{moves}</List>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

function calculateWinner(squares: BoardState): SquareValue {
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
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
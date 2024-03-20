const express = require('express');
const axios = require('axios');

const app = express();
const windowSize = 10;
let windowPrevState = [];
let windowCurrState = [];

app.get('/numbers/:numberid', async (req, res) => {
  const numberId = req.params.numberid;

  try {
    const response = await axios.get('http://test-server.com/number');
    const number = response.data;

    if (number === null || number === undefined) {
      return res.status(500).json({
        error: 'Test server did not return a valid number',
      });
    }

    if (
      numberId !== 'p' &&
      numberId !== 'f' &&
      numberId !== 'e' &&
      numberId !== 'r'
    ) {
      return res.status(400).json({
        error: 'Invalid number id',
      });
    }

    if (
      (numberId === 'p' && !isPrime(number)) ||
      (numberId === 'f' && !isFibonacci(number)) ||
      (numberId === 'e' && !isEven(number)) ||
      (numberId === 'r' && !isRandom(number))
    ) {
      return res.status(400).json({
        error: 'Number does not match the specified id',
      });
    }

    if (!windowCurrState.includes(number)) {
      if (windowCurrState.length === windowSize) {
        windowPrevState.push(windowCurrState.shift());
      }

      windowCurrState.push(number);
    }

    const avg =
      windowCurrState.reduce((acc, curr) => acc + curr, 0) / windowCurrState.length;

    res.json({
      numbers: windowCurrState,
      windowPrevState: windowPrevState,
      windowCurrstate: windowCurrState,
      avg: Math.round(avg),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error fetching number from test server',
    });
  }
});

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const isFibonacci = (num) => {
  const sqrt5 = Math.sqrt(5);
  const phi = (1 + sqrt5) / 2;
  const psi = (1 - sqrt5) / 2;
  return (
    Math.round(phi * num) - num === Math.round(psi * num) ||
    Math.round(phi * num) - num === Math.round(psi * num) - 1
  );
};

const isEven = (num) => num % 2 === 0;

const isRandom = (num) => Math.random() < 0.5;

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
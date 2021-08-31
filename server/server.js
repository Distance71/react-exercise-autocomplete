const express = require('express');
const cors = require('cors');

const mockedList = require('./mockedData/coins/list');
const handleError = require('./handleError');

const app = express();

const port = process.env.PORT || 5000;

app.set('PORT', port);

const corsOptions ={
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions));

// TODO: Add pagination to this endpoint
// Considered this quick design since the quantity of coins is not high (about 1k)
app.get('/api/coins/list', async (req, res) => {
  try {
    const { name } = req.query;

    let coins = mockedList;
    if(name) { // In a normal implementation would do this with a query
      coins = coins.filter(item => item.name.includes(name));
    }
    res.send({ coins });
  } catch (err) {
    handleError(err, req, res);
  }
});

app.listen(port, () => console.log('listening on port ' + port));

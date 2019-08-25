const express = require('express'); // always required
const bodyParser = require('body-parser');
const planRouter = require('./routes/plan-router');

const app = express(); // standard to have an app object for express
const PORT = process.env.PORT || 3000;  // use the PORT env var or default to whatever

app.use(bodyParser.json()); // add middleware to apply in the request processing to parse the body of req
app.use(bodyParser.urlencoded({extended: false})); // add middleware to apply in the request processing to parse the body of req
//app.use(express.json());

app.use('/api/plans', planRouter);

// default route to localhost:{PORT}
app.get('/', (req, res) => {
    res.send('Hi world!');
});


app.listen(PORT, () => console.log(`App is listening on port ${PORT}!`));

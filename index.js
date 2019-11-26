const express = require('express')
const morgan = require('morgan');
const bodyParser = require('body-parser')
const path = require('path');
const app = express()
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('tiny'));

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/particles.min.js', function(req, res) {
    res.sendFile(path.resolve(__dirname, './node_modules/particlesjs/dist'));
});

app.listen(port, () => console.log(`Listening on port ${port}!`))
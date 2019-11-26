const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const path = require('path');
const helper = require('./helpers');
const app = express();
const port = 3001;

var client_id = 'bb9508582785427bbe6c8aae0953cdb1'; // Your client id
var client_secret = 'dfe82ec77feb42f982f23d31676e1e1c'; // Your secret
var stateKey = 'spotify_auth_state';
var redirect_uri = 'http://localhost:3001/test'; // Your redirect uri

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(morgan('tiny'))
   .use(cookieParser())
   .use(bodyParser.urlencoded({ extended: false }));

app.get('/test', (req, res) => res.send('Hello World!'))

app.get('/hello', function(req, res){
    console.log(__dirname + './public/index.html');
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/authorize', (req, res) => {

    var state = helper.generateRandomString(16);
    var scope = 'user-read-private user-read-email';
    res.cookie(stateKey, state);

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});


app.get('/particles.min.js', function(req, res) {
    res.sendFile(path.resolve(__dirname, './node_modules/particlesjs/dist'));
});

app.listen(port, () => console.log(`Listening on port ${port}!`))
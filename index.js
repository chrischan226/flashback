const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const path = require('path');
const helper = require('./helpers');
const app = express();
const port = 3001;

var client_id = ''; // Your client id
var client_secret = ''; // Your secret
var stateKey = 'spotify_auth_state';
var redirect_uri = 'http://localhost:3001/callback'; // Your redirect uri


app.use(express.static(__dirname + '/build'))
   .use(cors())
   .use(morgan('tiny'))
   .use(cookieParser())
   .use(bodyParser.urlencoded({ extended: false }));


app.get('/authorize', (req, res) => {
    var state = helper.generateRandomString(16);
    var scope = 'user-read-private user-read-email user-library-read';
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

app.get('/callback', (req, res) => {
    var code = req.query.code || null;
    var state = req.query.state || null;
		var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
          querystring.stringify({
            error: 'state_mismatch'
          }));
      } else {
        res.clearCookie(stateKey);
        var authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
          },
          headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
          },
          json: true
				};

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
              
              var access_token = body.access_token,
									refresh_token = body.refresh_token;
      
              var options = {
                url: `https://api.spotify.com/v1/me/`,
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true,
              };

              request.get(options, function(error, response, body) {
                // console.log(body);
              });
      
              // we can also pass the token to the browser to make requests from there

              res.redirect('/#' +
                querystring.stringify({
                  access_token: access_token,
                  refresh_token: refresh_token
                }));
            } else {
              res.redirect('/#' +
                querystring.stringify({
                  error: 'invalid_token'
                }));
            }
          });
        }
});

app.get('/collectData', function(req, res) {
	var offset = req.query.offset,
	access_token = req.query.access,
	refresh_token = req.query.refresh;

	var options = {
		url: `https://api.spotify.com/v1/me/tracks/?limit=50&offset=${offset}`,
		headers: { 'Authorization': 'Bearer ' + access_token },
		json: true,
	};

	request.get(options, function(error, response, body) {
		res.send(body);
	});

});


app.get('/refresh_token', function(req, res) {
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
});

app.listen(port, () => console.log(`Listening on port ${port}!`))
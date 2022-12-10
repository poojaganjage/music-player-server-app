const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const bodyParser = require('body-parser');
const lyricsFinder = require('lyrics-finder');
const app = express();

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '635818ae069840beb5d1994e07657f07',
        clientSecret: 'e5a63763f5a34106a5c780a82a0340a5',
        refreshToken
    });

    spotifyApi.refreshAccessToken().then(
    (data) => {
        res.json({
            accessToken: data.body.access_token,
            expiresIn: data.body.expires_in,
        });
    }).catch((error) => {
        console.log(error);
        res.sendStatus(400);
    });
});

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '635818ae069840beb5d1994e07657f07',
        clientSecret: 'e5a63763f5a34106a5c780a82a0340a5'
    });

    spotifyApi.authorizationCodeGrant(code).then((data) => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        });
    }).catch((error) =>{
        console.log(error);
        res.sendStatus(400);
    });
});

app.get('/lyrics', async(req, res) => {
    const lyrics = 
    (await lyricsFinder(req.query.artist, req.query.track)) || 'No Lyrics Found';
    res.json({lyrics});
});

app.listen('3001');

// index.ts

import express from 'express';
import request from 'request';
import {
    spotifyBaseUrl,
    spotifyClientId,
    spotifyClientSecret,
    spotifyRedirectUri,
} from '../common';

const port = 6000;

const app = express();
app.use(express.json());

app.post('/login', (req, res) => {
    const authorizationCode = req.body?.authorizationCode;

    request.post(
        {
            url: spotifyBaseUrl + 'api/token',
            form: {
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: spotifyRedirectUri,
            },
            headers: {
                Authorization: 'Basic ' + (
                    Buffer.from(
                        `${spotifyClientId}:${spotifyClientSecret}`
                    ).toString('base64')
                ),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
        (_error, response, body) => {
            res.status(response.statusCode).send(body)
        }
    );
});

app.post('/refresh', (req, res) => {
    const refreshToken = req.body?.refreshToken;

    request.post(
        {
            url: spotifyBaseUrl + 'api/token',
            form: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            },
            headers: {
                Authorization: 'Basic ' + (
                    Buffer.from(
                        `${spotifyClientId}:${spotifyClientSecret}`
                    ).toString('base64')
                ),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        },
        (_error, response, body) => {
            res.status(response.statusCode).send(body);
        }
    );
});

app.listen(port, () => {
    console.log(`Musix Mixer app listening at http://localhost:${port}`)
});

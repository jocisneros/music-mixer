// index.ts

import express from 'express';
import request from 'request';
import {
    SPOTIFY_BASE_URL,
    SPOTIFY_REDIRECT_URI,
} from '../src/common/common';
import dotenv from 'dotenv';
dotenv.config();

const AUTH_HEADER = 'Basic ' + Buffer.from(
    `${process.env.REACT_APP_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString('base64');

const port = 6000;

const app = express();
app.use(express.json());

app.post('/login', (req, res) => {
    const authorizationCode = req.body?.authorizationCode;

    request.post(
        {
            url: SPOTIFY_BASE_URL + 'api/token',
            form: {
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: SPOTIFY_REDIRECT_URI,
            },
            headers: {
                Authorization: AUTH_HEADER,
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
            url: SPOTIFY_BASE_URL + 'api/token',
            form: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            },
            headers: {
                Authorization: AUTH_HEADER,
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

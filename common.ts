// common.ts

export * from './src/common/constants';
export * from './src/common/functions';

import dotenv from 'dotenv';

dotenv.config();

export const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;

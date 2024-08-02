import { config } from 'dotenv';

config();

const opts = {
    maxResults: 1,
    key: process.env.YOUTUBE_API_KEY,
    type: 'video'
};

export default opts;

import { config } from 'dotenv';

config();

export function logEnvVariables() {
    try {
        console.log(' + Loaded Enviroment Variables:');
        console.log(' - BOT_TOKEN: ', process.env.BOT_TOKEN);
        console.log(' - BOT_ID: ', process.env.BOT_ID);
        console.log(' - STEAM_API_KEY: ', process.env.STEAM_API_KEY);
    } catch (error) {
        console.error(error);
    }
}
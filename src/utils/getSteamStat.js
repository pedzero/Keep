import axios from "axios";
import { config } from "dotenv";

config();

const api_key = process.env.STEAM_API_KEY;

export async function getSteamStat() {
    try {
        const interfaceName = 'ICSGOServers_730';
        const methodName = 'GetGameServersStatus';
        const version = 1;

        const response = await axios.get(`http://api.steampowered.com/${interfaceName}/${methodName}/v${version}/`, {
            params: {
                key: api_key,
                format: 'json',
            },
        });

        const time = response.data.result.app.time;
        const services = response.data.result.services;
        const gru_datacenter = response.data.result.datacenters.Brazil;
        const matchmaking = response.data.result.matchmaking;

        const result = {
            time,
            services,
            gru_datacenter,
            matchmaking,
        };
        
        return result;

    } catch (error) {
        console.error(error);
        throw new Error('Error fetching data from the SteamStat API');
    }
}

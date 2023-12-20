import { Client } from "discord.js";
import { config } from "dotenv";

config();

const client = new Client({
    intents: ["Guilds", "GuildMessages"]
});

client.login(process.env.BOT_TOKEN);

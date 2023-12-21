import { Client, GatewayIntentBits, Routes, Constants } from "discord.js";
import { REST } from "@discordjs/rest";
import { config } from "dotenv";
import * as fs from 'fs/promises';

config();

const token = process.env.BOT_TOKEN;
const clientID = process.env.BOT_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
const rest = new REST({ version: '10' }).setToken(token);
const commands = new Map();

async function main() {
    try {
        const commandFiles = await fs.readdir('./src/commands');
        for (const file of commandFiles.filter(file => file.endsWith('.js'))) {
            const commandModule = await import(`./commands/${file}`);
            const command = commandModule.command;
            if (command) {
                commands.set(command.data.name, {
                    data: command.data,
                    execute: command.execute,
                });
            } else {
                console.error(`Error loading command module from ./commands/${file}: 'command' property is missing.`);
            }
        }

        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(clientID), { body: [...commands.values()].map(cmd => cmd.data) });
        console.log('Successfully reloaded application (/) commands.');

        client.login(token);

    } catch (error) {
        console.error(error);
    }
}

main();

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (!commands.has(commandName)) return;

    try {
        const command = commands.get(commandName);
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on("ready", () => { console.log("Bot is ready!"); });

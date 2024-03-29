import { getSteamStat } from '../utils/getSteamStat.js';
import { capitalizeFirstChar } from '../utils/capitalizeFirstChar.js';
import { EmbedBuilder } from '@discordjs/builders';

export const command = {
    data: {
        name: 'cs',
        description: 'Get information about the status of CS servers',
        type: 1,
        options: [
            {
                name: 'service',
                description: 'Specify the service status to be obtained.',
                type: 3,
                required: true,
                choices: [
                    {
                        name: 'Logon',
                        value: 'logon',
                    },
                    {
                        name: 'Matchmaking',
                        value: 'matchmaking',
                    },
                ],
            },
        ],
    },
    execute: async (interaction) => {
        try {
            const service = interaction.options.getString('service');
            const steamStatData = await getSteamStat();
            let reply;

            switch (service) {
                case 'logon':
                    const csEmbed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Counter-Strike Servers Status')
                        .setURL('https://steamstat.us/')
                        .setDescription('Current Counter-Strike servers status.')
                        .setThumbnail('https://ih1.redbubble.net/image.5273118024.5498/raf,360x360,075,t,fafafa:ca443f4786.jpg')
                        .addFields(
                            { name: 'Session Logon', value: capitalizeFirstChar(steamStatData.services.SessionsLogon) },
                            { name: 'GRU - Capacity', value: capitalizeFirstChar(steamStatData.gru_datacenter.capacity), inline: true },
                            { name: 'GRU- Load', value: capitalizeFirstChar(steamStatData.gru_datacenter.load), inline: true },
                        )
                        .setTimestamp()

                    reply = csEmbed;
                    break;

                case 'matchmaking':
                    const matchmakingEmbed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Counter-Strike Servers Status')
                        .setURL('https://steamstat.us/')
                        .setDescription('Current Matchmaking status.')
                        .addFields(
                            { name: 'Scheduler', value: capitalizeFirstChar(steamStatData.matchmaking.scheduler) },
                            { name: 'Online Servers', value: steamStatData.matchmaking.online_servers.toString(), inline: true },
                            { name: 'Onliner Players', value: steamStatData.matchmaking.online_players.toString(), inline: true },
                            { name: 'Wait Time', value: steamStatData.matchmaking.search_seconds_avg.toString() + 's', inline: true },
                        )
                        .setTimestamp()

                    reply = matchmakingEmbed;
                    break;
            }

            await interaction.reply({ embeds: [reply] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Error processing the command', ephemeral: true });
        }
    },
};
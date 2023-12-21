export const command = {
    data: {
        name: 'ping',
        description: 'Ping the bot',
        type: 1,
    },
    execute: async (interaction) => {
        await interaction.reply({ content: 'Pong!', ephemeral: true });
    },
};
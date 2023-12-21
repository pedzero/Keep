//import { getSteamStat } from "../utils/getSteamStat.js";

export const command = {
    data: {
        name: "music",
        description: "Create a music player in your voice channel.",
        type: 1,
        options: [
            {
                name: "play",
                description: "Play a given music",
                type: 3,
                required: false,
            },
            {
                name: "query",
                description: "Add a music to the player queue",
                type: 3,
                required: false,
            },
            {
                name: "control",
                description: "Control the music player",
                type: 3,
                required: false,
                choices: [
                    {
                        name: "skip",
                        value: "skip",
                    },
                    {
                        name: "pause",
                        value: "pause",
                    },
                    {
                        name: "stop",
                        value: "stop",
                    },
                    {
                        name: "playlist",
                        value: "playlist",
                    },
                ],
            },
        ],
    },
    execute: async (interaction) => {
        try {
            
            let reply = "in progress";
            await interaction.reply({ content: reply });

        } catch (error) {

            console.error(error);
            await interaction.reply({ content: 'Error processing the command', ephemeral: true });

        }
    },
};
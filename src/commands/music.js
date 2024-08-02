import { MusicPlayer } from '../utils/MusicPlayer.js'
import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice'
import ytdl from '@distube/ytdl-core'

let musicPlayer = new MusicPlayer()

export const command = {
    data: {
        name: 'music',
        description: 'Create a music player in your voice channel.',
        type: 1,
        options: [
            {
                name: 'play',
                description: 'Play a given music',
                type: 3,
                required: false,
            },
            {
                name: 'queue',
                description: 'Add a music to the player queue',
                type: 3,
                required: false,
            },
            {
                name: 'control',
                description: 'Control the music player',
                type: 3,
                required: false,
                choices: [
                    {
                        name: 'skip',
                        value: 'skip',
                    },
                    {
                        name: 'pause',
                        value: 'pause',
                    },
                    {
                        name: 'stop',
                        value: 'stop',
                    },
                    {
                        name: 'playlist',
                        value: 'playlist',
                    },
                ],
            },
        ],
    },
    execute: async (interaction) => {
        try {
            let reply

            const options = ['play', 'queue', 'control'];
            let option = null
            let input = null

            for (let opt of options) {
                let value = interaction.options.getString(opt);
                if (value !== null && value !== undefined) {
                    option = opt
                    input = value
                    break;
                }
            }

            if (option == null) {
                return;
            }

            if (option === 'play') {
                musicPlayer.play(input)
                reply = 'playing now or added to queue'

                const connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channel?.id,
                    guildId: interaction.member.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });
                connection.subscribe(musicPlayer.getPlayer())
            }

            if (option === 'queue') {
                musicPlayer.add(input)
                reply = 'added in queue'
            }

            if (option === 'control') {
                switch (input) {
                    case 'skip':
                        musicPlayer.skip()
                        reply = 'skipped'
                        break;

                    case 'pause':
                        musicPlayer.pause()
                        reply = 'paused'
                        break;

                    case 'stop':
                        musicPlayer.stop()
                        reply = 'stopped'
                        break;

                    case 'playlist':
                        reply = musicPlayer.queueSize
                        break;
                }
            }

            await interaction.reply({ content: reply });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Error processing the command', ephemeral: true });
        }
    },
};
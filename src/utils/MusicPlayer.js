import { createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice'
import search from 'youtube-search'
import ytdl from '@distube/ytdl-core'

import opts from '../config/YTopts.js'

export class MusicPlayer {
    #queue = []
    #audioPlayer

    constructor() {
        this.#audioPlayer = createAudioPlayer()

        this.#audioPlayer.on('error', error => {

        });

        this.#audioPlayer.on(AudioPlayerStatus.Idle, () => {
            this.#playNext()
        });

        this.#audioPlayer.on(AudioPlayerStatus.Playing, () => {

        });
    }

    async play(input) {
        if (this.getPlayerStatus() === 'paused') {
            this.#audioPlayer.unpause()
        }

        let source = await this.#createSource(input)
        let resource = this.#createResource(source)
        this.#queue.push(resource)

        if ((this.queueSize() == 1) && (this.#audioPlayer.state.status === 'idle')) {
            this.#audioPlayer.play(resource)
        }
    }

    async add(input) {
        let source = await this.#createSource(input)
        let resource = this.#createResource(source)
        this.#queue.push(resource)
    }

    skip() {
        this.#queue.shift()
        this.#audioPlayer.play(this.#queue[0])
    }

    pause() {
        if (this.getPlayerStatus() === 'paused') {
            this.#audioPlayer.unpause()
            return
        }

        console.log(this.getPlayerStatus())
    }

    stop() {
        this.#audioPlayer.stop()
        this.#clear()
    }

    getQueue() {
        return this.#queue
    }

    queueSize() {
        return this.#queue.length
    }

    #clear() {
        this.#queue = []
    }

    getPlayer() {
        return this.#audioPlayer
    }

    getPlayerStatus() {
        return this.#audioPlayer.state.status
    }

    #playNext() {
        this.#queue.shift()
        if (this.queueSize() == 0) {
            return
        }
        this.#audioPlayer.play(this.#queue[0])
    }

    async #createSource(input) {
        let validLink = await ytdl.validateURL(input)
        if (validLink) {
            return input
        }

        let results = await search(input, opts).catch(err => console.log(err));
        if (!results.results[0]) {
            return null
        }
        let source = results.results[0].link

        return source
    }

    #createResource(source) {
        const stream = ytdl(source, { filter: "audioonly", quality: 'highestaudio' })
        const resource = createAudioResource(stream, { seek: 0 })

        return resource
    }
}
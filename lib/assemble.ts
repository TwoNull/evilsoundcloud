import { getSegmentData, getPlaylistSegments } from "./clientreq"
import { ID3Writer } from "browser-id3-writer"
import { Set, Track } from "./types"

export async function assembleTrack(playlistURL: string, track: Track, set?: Set, index?: number): Promise<ArrayBuffer> {
    const segURLs = await getPlaylistSegments(playlistURL)

    const audioBuffers: Promise<ArrayBuffer>[] = []
    for (const s in segURLs) {
        audioBuffers.push(getSegmentData(segURLs[s]))
    }
    const resolved = await Promise.all(audioBuffers)
    const totalLength = resolved.reduce((acc, buf) => acc + buf.byteLength, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0;
    for (const buf of resolved) {
        result.set(new Uint8Array(buf), offset)
        offset += buf.byteLength
    }

    const writer = new ID3Writer(result.buffer)
    const artworkResponse = await fetch(track.artwork_url)
    if (set && index) {
        writer.setFrame('TALB', set.title)
        writer.setFrame('TPE2', set.user.username)
        writer.setFrame('TRCK', `${index + 1}/${set.track_count || set.tracks.length}`)
    }
    if (track.label_name) {
        writer.setFrame('TPUB', track.label_name);
    }
    writer.setFrame("TIT2", track.title)
    writer.setFrame("TPE1", [track.user.username])
    writer.setFrame("TCON", [track.genre])
    writer.setFrame("APIC", {
        type: 3,
        description: "",
        data: await artworkResponse.arrayBuffer()
    })
    if (track.release_date) {
        const releaseDate = new Date(track.release_date)
        writer.setFrame("TYER", releaseDate.getFullYear())
        const day = String(releaseDate.getDate()).padStart(2, '0')
        const month = String(releaseDate.getMonth() + 1).padStart(2, '0')
        writer.setFrame('TDAT', `${day}${month}`)
    }

    return writer.addTag()
}
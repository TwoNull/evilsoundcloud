"use server"

import LinkForm from "@/components/linkform"
import TrackCard from "@/components/trackcard"
import { getPlaylistURL, getTrackData } from "@/lib/hydration"
import { Stream } from "@/lib/types"

export default async function TrackPage({params}: any) {
    const { user, trackid } = await params
    const tdata = await getTrackData(`https://soundcloud.com/${user}/${trackid}`)

    if (tdata != null) {
        let stream: Stream = {
            name: "",
            url: "",
            bitrate: ""
        }
        for (const t in tdata.media.transcodings) {
            if (tdata.media.transcodings[t].format.protocol === "hls") {
                if (tdata.media.transcodings[t].preset === "mp3_1_0") {
                    stream = {
                        name: "MP3 (.mp3)",
                        url: tdata.media.transcodings[t].url,
                        bitrate: "128kbps"
                    }
                }
            }
        }
        const playlistURL = await getPlaylistURL(stream.url, tdata.track_authorization)
        if (playlistURL != null) {
            return (
                <div className="flex flex-col items-center p-4 gap-4">
                    <LinkForm />
                    <TrackCard track={tdata} playlistURL={playlistURL} />
                </div>
            )
        }
    }

    return (
        <div className="flex flex-col items-center p-4 gap-4">
            <LinkForm />
        </div>
    )
}
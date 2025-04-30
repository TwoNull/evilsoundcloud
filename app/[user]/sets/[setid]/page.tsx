"use server"

import LinkForm from "@/components/linkform"
import SetCard from "@/components/setcard"
import { getPlaylistURL, getSetData, populateTracks } from "@/lib/serverreq"

export default async function SetPage({params}: any) {
    const { user, setid } = await params
    const stubSetData = await getSetData(`https://soundcloud.com/${user}/sets/${setid}`)

    if (stubSetData != null) {
        const sdata = await populateTracks(stubSetData)
        const playlistURLs: Promise<string>[] = []
        for (const s in sdata.tracks) {
            let streamUrl: string = ""
            for (const t in sdata.tracks[s].media.transcodings) {
                if (sdata.tracks[s].media.transcodings[t].format.protocol === "hls") {
                    if (sdata.tracks[s].media.transcodings[t].preset.substring(0,3) === "mp3") {
                        streamUrl = sdata.tracks[s].media.transcodings[t].url
                    }
                }
            }
            if (streamUrl != "") {
                playlistURLs.push(getPlaylistURL(streamUrl, sdata.tracks[s].track_authorization))
            } else {
                console.log(sdata.tracks[s])
            }
        }
        const resolved = await Promise.all(playlistURLs)
        if (resolved.indexOf("") === -1) {
            return (
                <div className="flex flex-col items-center p-4 gap-4">
                    <LinkForm />
                    <SetCard set={sdata} playlistURLs={resolved} />
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
"use server"

import LinkForm from "@/components/linkform"
import SetCard from "@/components/setcard"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { getPlaylistURL, getSetData, populateTracks } from "@/lib/serverreq"
import { TriangleAlert } from "lucide-react"

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
            <Card className="shadow-md w-full max-w-screen-md">
                <CardContent className="flex justify-between items-center gap-4">
                    <div>
                        <TriangleAlert color="orange" size={64}/>
                    </div>
                    <div>
                        <CardTitle>Hmm. We were unable to find any playlist data at this url. Perhaps you made a typo?</CardTitle>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
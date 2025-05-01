"use server"

import LinkForm from "@/components/linkform"
import TrackCard from "@/components/trackcard"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { getPlaylistURL, getTrackData } from "@/lib/serverreq"
import { TriangleAlert } from "lucide-react"

export default async function TrackPage({params}: any) {
    const { user, trackid } = await params
    const tdata = await getTrackData(`https://soundcloud.com/${user}/${trackid}`)

    if (tdata != null) {
        let streamUrl: string = ""
        for (const t in tdata.media.transcodings) {
            if (tdata.media.transcodings[t].format.protocol === "hls") {
                if (tdata.media.transcodings[t].preset === "mp3_1_0") {
                    streamUrl = tdata.media.transcodings[t].url
                }
            }
        }
        const playlistURL = await getPlaylistURL(streamUrl, tdata.track_authorization)
        if (playlistURL != "") {
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
            <Card className="shadow-md w-full max-w-screen-md">
                <CardContent className="flex justify-between items-center gap-4">
                    <div>
                        <TriangleAlert color="orange" size={64}/>
                    </div>
                    <div>
                        <CardTitle>Hmm. We were unable to find any track data at this url. Perhaps you made a typo?</CardTitle>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
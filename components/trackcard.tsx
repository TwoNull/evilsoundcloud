"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Track } from "@/lib/types"
import { useState, useEffect } from "react"
import { Progress } from "./ui/progress"
import { assembleTrack } from "@/lib/assemble"


export default function TrackCard(props: {track: Track, playlistURL: string}) {
    const [trackUrl, setTrackUrl] = useState("")

    async function addTrack() {
        const result = await assembleTrack(props.playlistURL, props.track)

        const blob = new Blob([result], { type: 'audio/mpeg' })
        setTrackUrl(URL.createObjectURL(blob))
    }

    useEffect(() => {
        addTrack()
    }, [])
    

    return (
        <Card className="shadow-md w-full max-w-screen-md">
            <CardContent className="flex justify-between items-center gap-4">
                <div>
                    <Image src={props.track.artwork_url} alt="" width={64} height={64} />
                </div>
                <div className="flex-1 space-y-1">
                    <h3 className="text-md font-semibold">{props.track.title}</h3>
                    <p className="text-xs text-muted-foreground">{props.track.publisher_metadata.artist}</p>
                </div>
                {trackUrl === "" ? <Progress value={33} /> : <a download={props.track.title + ".mp3"} href={trackUrl}>Download</a>}
            </CardContent>
        </Card>
  )
}
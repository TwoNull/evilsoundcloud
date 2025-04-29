"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Track } from "@/lib/types"
import { useState, useEffect } from "react"
import { addSegmentData, getPlaylistSegments } from "@/lib/hls"
import { Progress } from "./ui/progress"


export default function TrackCard(props: {track: Track, playlistURL: string}) {
    const [trackUrl, setTrackUrl] = useState("")

    async function assembleTrack() {
        const segURLs = await getPlaylistSegments(props.playlistURL)

        const audioBuffers: Promise<ArrayBuffer>[] = []
        console.log(segURLs)
        for (const s in segURLs) {
            audioBuffers.push(addSegmentData(segURLs[s]))
        }
        const resolved = await Promise.all(audioBuffers)
        const totalLength = resolved.reduce((acc, buf) => acc + buf.byteLength, 0)
        const result = new Uint8Array(totalLength)
        let offset = 0;
        for (const buf of resolved) {
            result.set(new Uint8Array(buf), offset)
            offset += buf.byteLength
        }

        const blob = new Blob([result], { type: 'audio/mpeg' })
        setTrackUrl(URL.createObjectURL(blob))
    }

    useEffect(() => {
        assembleTrack()
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
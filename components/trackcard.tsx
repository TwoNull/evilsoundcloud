"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Track } from "@/lib/types"
import { useState, useEffect } from "react"
import { assembleTrack } from "@/lib/assemble"
import { Download, Loader2 } from "lucide-react"
import { Button } from "./ui/button"

export default function TrackCard(props: {track: Track, playlistURL: string}) {
    const [trackData, setTrackData] = useState({url: "", size: 0})

    async function addTrack() {
        const result = await assembleTrack(props.playlistURL, props.track)

        const blob = new Blob([result], { type: 'audio/mpeg' })
        setTrackData({url: URL.createObjectURL(blob), size: blob.size})
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
                {trackData.url === "" ? <Loader2 /> : 
                    <div className="flex flex-col items-center gap-1">
                        <Button size="sm" className="text-xs" asChild>
                            <a download={props.track.title + ".mp3"} href={trackData.url}>
                                <Download />.mp3
                            </a>
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            {"(~" + Math.round((trackData.size / 1024 / 1024) * 10) / 10 + " MB)"} 
                        </p>
                    </div>}
            </CardContent>
        </Card>
  )
}
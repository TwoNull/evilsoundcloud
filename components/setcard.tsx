"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Set } from "@/lib/types"
import { useState, useEffect } from "react"
import { Progress } from "./ui/progress"
import { assembleTrack } from "@/lib/assemble"
import JSZip from "jszip"


export default function SetCard(props: {set: Set, playlistURLs: string[]}) {
    const [trackUrls, setTrackUrls] = useState<string[]>([])
    const [archiveUrl, setArchiveUrl] = useState("")

    async function addSet() {
        const trackBuffers: Promise<ArrayBuffer>[] = []
        for (let i = 0; i < props.playlistURLs.length; i++) {
            trackBuffers.push(assembleTrack(props.playlistURLs[i], props.set.tracks[i], props.set, i+1))
        }
        const resolved = await Promise.all(trackBuffers)
        const tUrls: string[] = []
        const zip = new JSZip()
        for (let i = 0; i < resolved.length; i++) {
            const blob = new Blob([resolved[i]], { type: 'audio/mpeg' })
            tUrls.push(URL.createObjectURL(blob))

            const filename = props.set.tracks[i].title + ".mp3"
            zip.file(filename, resolved[i])
        }
        setTrackUrls(tUrls)
        const zBlob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE"
        })
        setArchiveUrl(URL.createObjectURL(zBlob))
    }

    useEffect(() => {
        addSet()
    }, [])
    

    return (
        <Card className="shadow-md w-full max-w-screen-md">
            <CardContent className="flex justify-between items-center gap-4 ">
                <div>
                    <Image src={props.set.tracks[0].artwork_url} alt="" width={64} height={64} />
                </div>
                <div className="flex-1 space-y-1">
                    <h3 className="text-md font-semibold">{props.set.title}</h3>
                    <p className="text-xs text-muted-foreground">{props.set.user.username}</p>
                </div>
                {archiveUrl === "" ? <Progress value={33} /> : <a download={props.set.title + ".zip"} href={archiveUrl}>Download</a>}
            </CardContent>
            <CardContent className="flex flex-col justify-left items-center gap-2">
                {trackUrls.length === 0 ? <Progress value={33} /> : trackUrls.map((url: string, i: number) => <a key={i} download={props.set.tracks[i].title + ".mp3"} href={url}>{props.set.tracks[i].title}</a>)}
            </CardContent>
        </Card>
  )
}
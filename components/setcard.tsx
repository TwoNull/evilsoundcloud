"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Set } from "@/lib/types"
import { useState, useEffect } from "react"
import { Progress } from "./ui/progress"
import { assembleTrack } from "@/lib/assemble"
import JSZip from "jszip"
import { Table, TableBody, TableCell, TableRow } from "./ui/table"
import { Download, Loader2 } from "lucide-react"
import { Button } from "./ui/button"


export default function SetCard(props: {set: Set, playlistURLs: string[]}) {
    const [trackUrls, setTrackUrls] = useState<string[]>([])
    const [archiveData, setArchiveData] = useState({url: "", size: 0})

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
        setArchiveData({url: URL.createObjectURL(zBlob), size: zBlob.size})
    }

    useEffect(() => {
        addSet()
    }, [])
    

    return (
        <Card className="shadow-md w-full max-w-screen-md gap-0 p-0">
            <Card className="shadow-md w-full">
                <CardContent className="flex justify-between items-center gap-4 ">
                    <div>
                        <Image src={props.set.tracks[0].artwork_url} alt="" width={64} height={64} />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h3 className="text-md font-semibold">{props.set.title}</h3>
                        <p className="text-xs text-muted-foreground">{props.set.user.username}</p>
                    </div>
                    {archiveData.url === "" ? <Loader2 /> :
                        <div className="flex flex-col items-center gap-1">
                            <Button size="sm" className="text-xs" asChild>
                                <a download={props.set.title + ".zip"} href={archiveData.url}>
                                    <Download />.zip
                                </a>
                            </Button>
                            <span className="text-xs text-muted-foreground">
                                {"(~" + Math.round((archiveData.size / 1024 / 1024) * 10) / 10 + " MB)"} 
                            </span>
                        </div>}
                </CardContent>
            </Card>
            <CardContent className="flex flex-col justify-left items-left gap-2 p-2 px-4">
                {
                    trackUrls.length === 0 ? <Progress value={33} /> 
                :
                    <Table>
                        <TableBody>
                            {
                                trackUrls.map((url: string, i: number) => {
                                    const total = Math.floor(props.set.tracks[i].duration / 1000);
                                    const minutes = Math.floor(total / 60);
                                    const seconds = total % 60;
                                    return(
                                        <TableRow className="text-md" key={i}>
                                            <TableCell className="font-light">{i+1}</TableCell>
                                            <TableCell>{props.set.tracks[i].title}</TableCell>
                                            <TableCell className="font-light">{`${minutes}:${seconds.toString().padStart(2, '0')}`}</TableCell>
                                            <TableCell align="right">
                                                <Button size="sm" className="text-xs" asChild>
                                                    <a download={props.set.tracks[i].title + ".mp3"} href={url}>
                                                        <Download/>
                                                        .mp3
                                                    </a>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                }
            </CardContent>
        </Card>
  )
}
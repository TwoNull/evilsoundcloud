import LinkForm from "@/components/linkform";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"

export default function Home() {
    return (
        <div className="flex flex-col items-center p-4 gap-4">
            <LinkForm />
            <Card className="w-full max-w-screen-md">
                <CardHeader>
                    <CardTitle>What is this?</CardTitle>
                    <CardDescription>EvilSoundCloud is a web app for ripping tracks, albums, and playlists from SoundCloud. All music is streamed and assembled in your browser rather than on an external server.</CardDescription>
                    <br />
                    <CardTitle>Usage</CardTitle>
                    <CardDescription>For a single track, copy its url. It will look something like:</CardDescription>
                    <Badge className="text-sm">https://soundcloud.com/artist/trackname</Badge>
                    <CardDescription>For an album or playlist, the url will be something like:</CardDescription>
                    <Badge className="text-sm">https://soundcloud.com/artist/sets/albumname</Badge>
                    <CardDescription>You can then choose to save individual tracks or the entire album as a zip archive.</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
}

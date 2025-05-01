"use client"
 
import { useForm } from "react-hook-form" 
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"

type FormData = {
    link: string;
}
 
export default function LinkForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<FormData>({
        mode: "onSubmit"
    })
    
    function onSubmit(data: FormData) {
        const url = new URL(data.link)
        const path = url.pathname
        setLoading(true)

        router.push(path)
    }

    function isValidURL(urlString: string): boolean {
        try {
            const url = new URL(urlString)
            const hostname = url.hostname.replace(/^www\./, '')
            if (hostname !== 'soundcloud.com') {
                return false
            }
        
            const pathSegments = url.pathname.split('/').filter(Boolean)

            if (pathSegments.length === 2) {
                return true
            }
            if (pathSegments.length === 3 && pathSegments[1] === 'sets') {
                return true
            }

            return false
        } catch {
            return false
        }
    }
 
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-top gap-2 w-full max-w-screen-md">
                <FormField
                    control={form.control}
                    rules={{
                        validate: (value) => isValidURL(value) || 'Invalid SoundCloud URL',
                    }}
                    name="link"
                    defaultValue=""
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl >
                                <Input placeholder="https://soundcloud.com/jxxyy/gout" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs">
                                <span className="text-foreground">Enter a SoundCloud Track/Album/Playlist URL</span>
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <Button disabled={loading} type="submit">
                    {loading ? <Loader2 className="animate-spin" /> : "Fetch"}
                </Button>
            </form>
        </Form>
    )
}
"use client"
 
import { useForm } from "react-hook-form" 
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type FormData = {
    link: string;
}
 
export default function LinkForm() {
    const router = useRouter()

    const form = useForm<FormData>({
        mode: "onSubmit"
    })
    
    function onSubmit(data: FormData) {
        const url = new URL(data.link)
        const path = url.pathname

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2 w-full max-w-screen-md">
                <FormField
                    control={form.control}
                    rules={{
                        validate: (value) => isValidURL(value) || 'Invalid Soundcloud URL',
                    }}
                    name="link"
                    defaultValue=""
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl >
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Search</Button>
            </form>
        </Form>
    )
}
import { Playlist, Track } from "./types";

const WEB_CLIENTID = "JtwkMxXKQNqDFvsQ3pUayFVgt4j9dS87"

export async function getPlaylistURL(track: string, authorization: string): Promise<string | null> {
    try {
        const response = await (await fetch(`${track}?client_id=${WEB_CLIENTID}&track_authorization=${authorization}`, {
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-language': 'en-US,en;q=0.9',
                'priority': 'u=0, i',
                'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'none',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
                'origin': 'https://soundcloud.com'
            },
        })).json()
        console.log(response)
        return response.url
    } catch {
        return null
    }
}

export async function getTrackData(url: string): Promise<Track | null> {
    try {
        const response = await fetch(url, {
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-language': 'en-US,en;q=0.9',
                'priority': 'u=0, i',
                'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'none',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
                'origin': 'https://soundcloud.com'
            },
        })
        const html = await response.text()
    
        const startMarker = 'window.__sc_hydration = ['
        const endMarker = '];'
    
        const startIndex = html.indexOf(startMarker)
        if (startIndex === -1) {
            throw new Error('start marker not found')
        }
    
        const jsonStart = startIndex + startMarker.length
        const endIndex = html.indexOf(endMarker, jsonStart)
        if (endIndex === -1) {
            throw new Error('end marker not found')
        }
    
        const substr = html.substring(jsonStart, endIndex)
        const hydratables = JSON.parse(`[${substr}]`)

        const track: Track = hydratables[hydratables.length-1].data

        return track

    } catch (error) {
        console.log('error fetching or parsing hydration data:', error)
        return null
    }
}

export async function getPlaylistData(url: string): Promise<Playlist | null> {
    try {
        const response = await fetch(url, {
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-language': 'en-US,en;q=0.9',
                'priority': 'u=0, i',
                'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'none',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
                'origin': 'https://soundcloud.com'
            },
        })
        const html = await response.text()
    
        const startMarker = 'window.__sc_hydration = ['
        const endMarker = '];'
    
        const startIndex = html.indexOf(startMarker)
        if (startIndex === -1) {
            throw new Error('start marker not found')
        }
    
        const jsonStart = startIndex + startMarker.length
        const endIndex = html.indexOf(endMarker, jsonStart)
        if (endIndex === -1) {
            throw new Error('end marker not found')
        }
    
        const substr = html.substring(jsonStart, endIndex)
        const hydratables = JSON.parse(`[${substr}]`)

        const playlist: Playlist = hydratables[hydratables.length].data

        return playlist
    } catch (error) {
        console.log('error fetching or parsing hydration data:', error)
        return null
    }
}
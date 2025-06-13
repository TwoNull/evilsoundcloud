import { Set, Track } from "./types";

export async function getPlaylistURL(track: string, authorization: string): Promise<string> {
    try {
        const response = await (await fetch(`${track}?client_id=${process.env.WEB_CLIENTID}&track_authorization=${authorization}`, {
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
        return response.url
    } catch (error) {
        console.log('error fetching or parsing playlist URL:', error)
        return ""
    }
}

export async function populateTracks(set: Set): Promise<Set> {
    const indices: number[] = []
    let ids = ""
    for (let s = 0; s < set.tracks.length; s++) {
        if (set.tracks[s].media === undefined) {
            indices.push(s)
            ids += set.tracks[s].id + ","
        }
    }
    try {
        const response = await (await fetch(`https://api-v2.soundcloud.com/tracks?ids=${ids.substring(0, ids.length-1)}&client_id=${process.env.WEB_CLIENTID}`, {
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
        for (let i = 0; i < response.length; i++) {
            set.tracks[indices[i]] = response[i]
        }
    } catch (error) {
        console.log('error fetching set track data:', error)
    }
    return set
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

        const versionTime = String(html.match(/<script>window\.__sc_version="[0-9]{10}"<\/script>/)![0].match(/[0-9]{10}/));

        if (process.env.WEB_VERSIONTIME != versionTime) {
            const scripts = html.matchAll(/<script.+src="(.+)">/g);

            let clientid = "";
            for (let script of scripts) {
                const url = script[1];

                const scrf = await fetch(url).then(r => r.text()).catch(() => {});
                const id = scrf!.match(/\("client_id=[A-Za-z0-9]{32}"\)/);

                if (id && typeof id[0] === 'string') {
                    clientid = id[0].match(/[A-Za-z0-9]{32}/)![0];
                    break;
                }
            }
            await updateClientId(versionTime, clientid)
        }
    
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
        
        if (hydratables[hydratables.length-1].hydratable != "sound") {
            throw new Error('hydratable object does not contain sound')
        }

        const track: Track = hydratables[hydratables.length-1].data

        return track

    } catch (error) {
        console.log('error fetching or parsing track data:', error)
        return null
    }
}

export async function getSetData(url: string): Promise<Set | null> {
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

        const versionTime = String(html.match(/<script>window\.__sc_version="[0-9]{10}"<\/script>/)![0].match(/[0-9]{10}/));

        if (process.env.WEB_VERSIONTIME != versionTime) {
            const scripts = html.matchAll(/<script.+src="(.+)">/g);

            let clientid = "";
            for (let script of scripts) {
                const url = script[1];

                const scrf = await fetch(url).then(r => r.text()).catch(() => {});
                const id = scrf!.match(/\("client_id=[A-Za-z0-9]{32}"\)/);

                if (id && typeof id[0] === 'string') {
                    clientid = id[0].match(/[A-Za-z0-9]{32}/)![0];
                    break;
                }
            }
            await updateClientId(versionTime, clientid)
        }
    
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

        if (hydratables[hydratables.length-1].hydratable != "playlist") {
            throw new Error('hydratable object does not contain playlist')
        }

        const set: Set = hydratables[hydratables.length-1].data

        return set
    } catch (error) {
        console.log('error fetching or parsing set data:', error)
        return null
    }
}

async function updateClientId(versionTime: string, id: string) {
    const res1 = fetch(`https://api.vercel.com/v10/projects/${process.env.PROJECT_NAME}/env/${process.env.WEB_CLIENTID_ID}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            value: id,
            target: ['production'],
        }),
    });
    const res2 = fetch(`https://api.vercel.com/v10/projects/${process.env.PROJECT_NAME}/env/${process.env.WEB_VERSIONID_ID}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            value: versionTime,
            target: ['production'],
        }),
    });
    await Promise.all([res1, res2])
}
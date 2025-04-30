export async function getPlaylistSegments(url: string): Promise<string[]> {
    const segURLs: string[] = []
    try {
        const response = await fetch(url, {
            headers: {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'referer': 'https://soundcloud.com/',
                'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
            }
        })
        const m3u8 = await response.text()
        const lines = m3u8.split('\n')
        const segmentUrls: string[] = []
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()
            
            if (line === '' || line.startsWith('#')) {
                continue
            }
            
            segmentUrls.push(line)
        }
        
        return segmentUrls
    } catch (error) {
        console.log('error fetching or parsing playlist segments:', error)
        return segURLs
    }
}

export async function getSegmentData(url: string): Promise<ArrayBuffer> {
    try {
        const response = await fetch(url, {
            headers: {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9',
                'referer': 'https://soundcloud.com/',
                'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'cross-site',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
            }
        })
        return await response.arrayBuffer()
    }
    catch (error) {
        console.log('error fetching or parsing segment data:', error)
        return new ArrayBuffer(0)
    }
}
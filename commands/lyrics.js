const fetch = require('node-fetch');

async function lyricsCommand(sock, chatId, songTitle, message) {
    if (!songTitle) {
        await sock.sendMessage(chatId, { 
            text: '🔍 Please enter the song name to get the lyrics! Usage: *lyrics <song name> [by artist]*'
        }, { quoted: message });
        return;
    }

    try {
        // Send a searching reaction
        await sock.sendMessage(chatId, { react: { text: '🔍', key: message.key } });

        let apiUrl;
        // Check if the user specified an artist using " by " (case-insensitive)
        const byMatch = songTitle.match(/^(.*?)\s+by\s+(.+)$/i);

        if (byMatch) {
            const trackName = byMatch[1].trim();
            const artistName = byMatch[2].trim();
            // Use LRCLIB's dedicated track and artist search parameters
            apiUrl = `https://lrclib.net/api/search?track_name=${encodeURIComponent(trackName)}&artist_name=${encodeURIComponent(artistName)}`;
        } else {
            // Standard general search without "by"
            apiUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(songTitle)}`;
        }

        let res = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'WhatsAppBot (https://github.com/bigbosssunzy)'
            }
        });
        
        if (!res.ok) {
            throw new Error(`API returned status ${res.status}`);
        }
        
        let data = await res.json();

        // Fallback: If specific search with parameters returns nothing, try a cleaned general query
        if ((!data || data.length === 0 || !data[0].plainLyrics) && byMatch) {
            const cleanedQuery = `${byMatch[1]} ${byMatch[2]}`;
            apiUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(cleanedQuery)}`;
            res = await fetch(apiUrl, {
                headers: { 'User-Agent': 'WhatsAppBot (https://github.com/bigbosssunzy)' }
            });
            if (res.ok) {
                data = await res.json();
            }
        }

        if (!data || data.length === 0 || !data[0].plainLyrics) {
            await sock.sendMessage(chatId, {
                text: `❌ Sorry, I couldn't find any lyrics for "${songTitle}".`
            }, { quoted: message });
            return;
        }

        const track = data[0];
        const lyrics = track.plainLyrics;
        const songHeader = `🎵 *${track.trackName}* - ${track.artistName}\n\n`;
        
        const fullText = songHeader + lyrics;
        const maxChars = 4096;
        const output = fullText.length > maxChars ? fullText.slice(0, maxChars - 3) + '...' : fullText;

        await sock.sendMessage(chatId, { text: output }, { quoted: message });
    } catch (error) {
        console.error('Error in lyrics command:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ An error occurred while fetching the lyrics for "${songTitle}".`
        }, { quoted: message });
    }
}

module.exports = { lyricsCommand };
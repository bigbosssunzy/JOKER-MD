const axios = require('axios');

async function spotifyCommand(sock, chatId, message) {
    try {
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

        const used = (rawText || '').split(/\s+/)[0] || '.spotify';
        const query = rawText.slice(used.length).trim();

        if (!query) {
            await sock.sendMessage(chatId, { text: 'Usage: .spotify <song name>\nExample: .spotify rema' }, { quoted: message });
            return;
        }

        // Send processing reaction
        await sock.sendMessage(chatId, { react: { text: '🎵', key: message.key } }).catch(() => {});

        let trackData = null;

        // ==========================================
        // METHOD 1: Official Spotify Web API
        // ==========================================
        try {
            const clientId = '422879c8a7f04803966f0436d2e81540';
            const clientSecret = 'c443c98358984db0b9691094fe342d1d';

            const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', 
                new URLSearchParams({ grant_type: 'client_credentials' }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
                },
                timeout: 8000
            });

            const accessToken = tokenResponse.data?.access_token;
            if (accessToken) {
                const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
                    params: { q: query, type: 'track', limit: 1 },
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                    timeout: 8000
                });

                const track = searchResponse.data?.tracks?.items?.[0];
                if (track) {
                    trackData = {
                        title: track.name,
                        artist: track.artists.map(a => a.name).join(', '),
                        album: track.album.name,
                        url: track.external_urls.spotify,
                        coverUrl: track.album.images?.[0]?.url
                    };
                }
            }
        } catch (spotifyErr) {
            console.log('[FALLBACK] Method 1 (Spotify API) failed. Trying fallback method...');
        }

        // ==========================================
        // METHOD 2: Apple iTunes Public API (Fallback)
        // ==========================================
        if (!trackData) {
            try {
                const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1`;
                const itunesRes = await axios.get(itunesUrl, { timeout: 8000 });
                const item = itunesRes.data?.results?.[0];

                if (item) {
                    trackData = {
                        title: item.trackName,
                        artist: item.artistName,
                        album: item.collectionName || 'Single',
                        url: item.trackViewUrl,
                        coverUrl: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : null
                    };
                }
            } catch (itunesErr) {
                console.log('[FALLBACK] Method 2 (iTunes API) failed.');
            }
        }

        // If both methods fail to find anything
        if (!trackData) {
            await sock.sendMessage(chatId, { text: '❌ No matching track found from any source.' }, { quoted: message });
            return;
        }

        const caption = `🎵 *Title:* ${trackData.title}\n👤 *Artist:* ${trackData.artist}\n💿 *Album:* ${trackData.album}\n🔗 ${trackData.url}`;

        // Send track info and high-res cover art
        if (trackData.coverUrl) {
            await sock.sendMessage(chatId, { image: { url: trackData.coverUrl }, caption }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: caption }, { quoted: message });
        }

    } catch (error) {
        console.error('[SPOTIFY CMD] error:', error?.message || error);
        await sock.sendMessage(chatId, { text: '❌ Failed to retrieve track information.' }, { quoted: message });
    }
}

module.exports = spotifyCommand;

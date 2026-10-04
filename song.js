const axios = require('axios');

async function songCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        
        // Cleanly strip out .song, .play, /song, /play, !song, or !play prefixes
        const searchQuery = text.replace(/^[\.\/\\!]?\s*(song|play)\s*/i, '').trim();

        if (!searchQuery) {
            return await sock.sendMessage(chatId, { 
                text: "What song do you want to download?\n*Example:* `.song London view by bm`"
            }, { quoted: message });
        }

        const API_URL = 'https://knightbotapi.stream/api/ytmp3';
        
        console.log(`[SONG COMMAND] Clean Query: "${searchQuery}"`);

        // Fetch song details and download URL from KnightBot API
        const response = await axios.get(API_URL, {
            params: {
                apikey: 'knight',
                query: searchQuery
            },
            timeout: 120000
        });

        const data = response.data;

        if (!data || !data.success || !data.download) {
            throw new Error('API response did not return a valid download link');
        }

        const title = data.title || searchQuery;
        const downloadUrl = data.download;
        const thumbnailUrl = data.thumbnail;

        const captionText = `🎵 Searching and processing: *"${title}"*...\n_Please wait, downloading audio..._`;

        // Send thumbnail image together with the processing message
        if (thumbnailUrl) {
            await sock.sendMessage(chatId, {
                image: { url: thumbnailUrl },
                caption: captionText
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: captionText }, { quoted: message });
        }

        console.log(`[SONG COMMAND] Fetching MP3 buffer from: ${downloadUrl}`);

        // Fetch the generated MP3 file
        const audioResponse = await axios.get(downloadUrl, {
            responseType: 'arraybuffer',
            timeout: 90000
        });

        const audioBuffer = Buffer.from(audioResponse.data);

        if (!audioBuffer || audioBuffer.length === 0) {
            throw new Error('Downloaded audio buffer is empty.');
        }

        const cleanTitle = title.replace(/[^\w\s-]/g, '');

        // Send MP3 to WhatsApp chat
        await sock.sendMessage(chatId, {
            audio: audioBuffer,
            mimetype: 'audio/mp4',
            fileName: `${cleanTitle}.mp3`,
            ptt: false
        }, { quoted: message });

    } catch (err) {
        if (err.response) {
            console.error(`[SONG COMMAND ERROR] Status: ${err.response.status} | URL: ${err.config?.url}`);
        } else {
            console.error('[SONG COMMAND ERROR]:', err.message);
        }

        let errorMessage = '❌ Failed to download song. Please try again later.';
        if (err.response?.status === 404) {
            errorMessage = '❌ Route or file not found (404). Check API endpoint status.';
        }

        await sock.sendMessage(chatId, { text: errorMessage }, { quoted: message });
    }
}

module.exports = songCommand;

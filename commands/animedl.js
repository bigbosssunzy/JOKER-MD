const axios = require('axios');

const MY_API_URL = 'https://anime-api-7v5s.onrender.com'; // Make sure this matches your exact Render URL

async function animeDownloaderCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, { 
                text: "❌ *Please provide an anime name.*\n\n*Usage:* `.animedl naruto 1`" 
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { react: { text: '⏳', key: message.key } });

        let rawInput = args.join(' ');
        let epNumber = 1;
        const lastArg = args[args.length - 1];

        if (!isNaN(lastArg)) {
            epNumber = parseInt(lastArg);
            rawInput = args.slice(0, -1).join(' ');
        }

        const query = rawInput || args.join(' ');

        const response = await axios.get(`${MY_API_URL}/api/anime?q=${encodeURIComponent(query)}&ep=${epNumber}`, { timeout: 15000 });
        const data = response.data;

        if (!data || !data.videoUrl) {
            await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
            return await sock.sendMessage(chatId, { text: `❌ Could not retrieve video stream for "${query}".` }, { quoted: message });
        }

        let caption = `⛩️ *【 ANIME VIDEO PLAYER 】*\n\n`;
        caption += `🎬 *Anime:* ${data.title}\n`;
        caption += `📺 *Episode:* Ep ${data.episode}\n\n`;
        caption += `🤡 *JOKER BOT*`;

        // Pass video payload correctly
        await sock.sendMessage(chatId, { 
            video: { url: data.videoUrl }, 
            caption: caption,
            mimetype: 'video/mp4',
            ptt: false
        }, { quoted: message });

        await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });

    } catch (err) {
        console.error('❌ Anime Video Error:', err.message || err);
        await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        await sock.sendMessage(chatId, { 
            text: `❌ *Error:* ${err.message}` 
        }, { quoted: message });
    }
}

module.exports = animeDownloaderCommand;
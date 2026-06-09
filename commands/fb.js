const axios = require('axios');

module.exports = {
    name: 'fb',
    alias: ['facebook', 'fbreel', 'fbdown'],
    category: 'download',
    desc: 'Download FB videos using your RapidAPI key',
    start: async (message, { sock, text }) => {
        const chatId = message.key.remoteJid;

        if (!text) return await sock.sendMessage(chatId, { text: "🤡 *Big Boss,* please provide a Facebook link!" }, { quoted: message });

        await sock.sendMessage(chatId, { text: "📥 *Joker is extracting the media...* 🃏" }, { quoted: message });

        const options = {
            method: 'POST',
            url: 'https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': '9eb73045demsh0a6fe2663495e04p135a36jsn6cdc1418742d',
                'X-RapidAPI-Host': 'social-download-all-in-one.p.rapidapi.com'
            },
            data: { url: text }
        };

        try {
            const response = await axios.request(options);
            const data = response.data;

            // Looking for the video in the "medias" array from your screenshot
            if (data.medias && data.medias.length > 0) {
                // Filter to find the best quality video or just take the first one
                const video = data.medias.find(m => m.type === 'video') || data.medias[0];
                
                await sock.sendMessage(chatId, { 
                    video: { url: video.url }, 
                    caption: `🎬 *Media Downloaded Successfully!*\n📌 *Title:* ${data.title || 'No Title'}\n\n👑 *Owner:* 🦊⃟ᴠͥɪͣᴘͫ✮⃝🇧𝖎𝖌🇧ө͜͡ss𝄟⃝🎧™` 
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, { text: "❌ No downloadable media found. Is the link public?" }, { quoted: message });
            }
        } catch (error) {
            console.error('RapidAPI Error:', error);
            await sock.sendMessage(chatId, { text: "⚠️ API Error! Your monthly limit might be hit or the link is broken." }, { quoted: message });
        }
    }
};
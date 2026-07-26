const axios = require('axios');

// Global session storage for active subtitle searches
global.subttSessions = global.subttSessions || {};

async function subttCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, { 
                text: "❌ *Please provide a search query or a number.*\n\n*Usage Guide:*\n• Search Movie/Series: `.subtt <name>` (e.g., `.subtt avatar` or `.subtt black clover s01e01`)\n• Download Subtitle: `.subtt <number>` (e.g., `.subtt 1`)" 
            }, { quoted: message });
        }

        const firstArg = args[0];
        const session = global.subttSessions[chatId];

        // 1. Handle Selection by Number (Sends the subtitle file/document)
        if (!isNaN(firstArg) && session && session.items && session.items.length > 0) {
            const index = parseInt(firstArg) - 1;

            if (index < 0 || index >= session.items.length) {
                return await sock.sendMessage(chatId, { text: `❌ Invalid number! Please choose between 1 and ${session.items.length}.` }, { quoted: message });
            }

            const selectedSub = session.items[index];

            await sock.sendMessage(chatId, { react: { text: '⏳', key: message.key } });
            
            const displayName = selectedSub.filename || selectedSub.release || selectedSub.title || selectedSub.name || `Subtitle_${index + 1}`;
            await sock.sendMessage(chatId, { text: `📥 *Preparing subtitle file:* \n_${displayName}_` }, { quoted: message });

            const downloadLink = selectedSub.download || selectedSub.downloadLink || selectedSub.url || selectedSub.link;

            if (!downloadLink) {
                return await sock.sendMessage(chatId, { text: `❌ Download link unavailable for this subtitle.` }, { quoted: message });
            }

            const fileName = `${displayName.replace(/[^a-zA-Z0-9]/g, '_')}.srt`;

            await sock.sendMessage(chatId, {
                document: { url: downloadLink },
                mimetype: 'application/x-subrip',
                fileName: fileName,
                caption: `✅ *Subtitle Downloaded Successfully*\n📁 *File:* ${fileName}\n🤡 *JOKER-MD*`
            }, { quoted: message });

            await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });
            return;
        }

        // 2. Handle Search Query & Display Rich Visual Cards
        await sock.sendMessage(chatId, { react: { text: '⏳', key: message.key } });
        const query = args.join(' ');

        const apiUrl = `https://apis.davidcyril.name.ng/subttsearch/search?q=${encodeURIComponent(query)}&page=1`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        const data = response.data;

        const results = data.results || data.data || data.subtitles || data.items || (Array.isArray(data) ? data : []);

        if (!results || results.length === 0) {
            await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
            return await sock.sendMessage(chatId, { text: `❌ No subtitles found for "${query}". For series, try adding season/episode (e.g., \`s01e01\`).` }, { quoted: message });
        }

        const paginatedItems = results.slice(0, 10);

        global.subttSessions[chatId] = {
            query: query,
            items: paginatedItems
        };

        await sock.sendMessage(chatId, { text: `🎬 *Subtitle Search Results for "${query}"*\nFound ${paginatedItems.length} matches. Sending detailed cards...` }, { quoted: message });

        for (let i = 0; i < paginatedItems.length; i++) {
            const itemNumber = i + 1;
            const item = paginatedItems[i];
            
            // Extract comprehensive data fields for full name and metadata
            const fullTitle = item.title || item.movie || item.name || "Unknown Movie / Series";
            const releaseName = item.filename || item.release || item.subName || fullTitle;
            const langText = item.language || item.lang || item.country || "English";
            const downloadCount = item.downloads || item.downloadCount || item.count || "Available";
            const fileSize = item.size || item.filesize || "";
            const uploader = item.uploader || item.author || "";
            
            // Image card fallback
            const thumbnail = item.image || item.poster || item.thumbnail || item.img || "https://files.catbox.moe/g3x5r2.jpg";

            let caption = `📌 *[${itemNumber}] ${fullTitle}*\n\n`;
            caption += `📂 *Release:* \`${releaseName}\`\n`;
            caption += `🌐 *Language:* ${langText}\n`;
            if (fileSize) caption += `📦 *Size:* ${fileSize}\n`;
            caption += `📥 *Downloads:* ${downloadCount}`;
            if (uploader) caption += `\n👤 *Uploader:* ${uploader}`;

            if (i === paginatedItems.length - 1) {
                caption += `\n\n*💡 Command Guide:*\n` +
                           `• Download Subtitle: \`.subtt <number>\` (e.g., \`.subtt 1\`)`;
            }

            await sock.sendMessage(chatId, {
                image: { url: thumbnail },
                caption: caption
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });

    } catch (err) {
        console.error('❌ Subtt Command Error:', err.message || err);
        await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        await sock.sendMessage(chatId, { text: `❌ *Error:* ${err.message}` }, { quoted: message });
    }
}

module.exports = subttCommand;

const axios = require('axios');

async function apkCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, { 
                text: "❌ *Please provide an app name.*\n\n*Usage:* `.apk whatsapp`" 
            }, { quoted: message });
        }

        const query = args.join(' ');

        await sock.sendMessage(chatId, { react: { text: '⏳', key: message.key } });
        await sock.sendMessage(chatId, { text: `⏳ *Searching and fetching APK for "${query}"...*` }, { quoted: message });

        const apiUrl = `https://apis.davidcyril.name.ng/download/apk?text=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl, { timeout: 30000 });
        const data = response.data;

        if (!data || !data.status || !data.apk) {
            await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
            return await sock.sendMessage(chatId, { text: `❌ No APK found for "${query}".` }, { quoted: message });
        }

        const apk = data.apk;
        
        let caption = `📦 *【 APK DOWNLOADER 】*\n\n`;
        caption += `📱 *Name:* ${apk.name}\n`;
        caption += `📌 *Package:* ${apk.package}\n`;
        caption += `🔄 *Version:* ${apk.lastUpdated}\n\n`;
        caption += `🤡 *JOKER-MD*`;

        // Send app preview card with icon
        if (apk.icon) {
            await sock.sendMessage(chatId, {
                image: { url: apk.icon },
                caption: caption
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: caption }, { quoted: message });
        }

        // Send the actual APK file as a document
        if (apk.downloadLink) {
            await sock.sendMessage(chatId, { text: `📥 *Uploading APK file (${apk.name})...*` }, { quoted: message });
            
            const safeFileName = `${apk.name.replace(/[^a-zA-Z0-9]/g, '_')}.apk`;

            await sock.sendMessage(chatId, {
                document: { url: apk.downloadLink },
                mimetype: 'application/vnd.android.package-archive',
                fileName: safeFileName,
                caption: `✅ *Downloaded Successfully:* ${apk.name}`
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: `❌ Download link unavailable for this application.` }, { quoted: message });
        }

        await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });

    } catch (err) {
        console.error('❌ APK Command Error:', err.message || err);
        await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        await sock.sendMessage(chatId, { text: `❌ *Error:* ${err.message}` }, { quoted: message });
    }
}

module.exports = apkCommand;
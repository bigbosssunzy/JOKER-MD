const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// Helper to include channel newsletter branding
function getChannelInfo() {
    return {
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363428288475430@newsletter',
                newsletterName: 'JOKER',
                serverMessageId: -1
            }
        }
    };
}

async function saveStatusCommand(sock, chatId, message) {
    try {
        // 1. Check if the user is replying to a status/media
        const context = message.message?.extendedTextMessage?.contextInfo;
        const quoted = context?.quotedMessage?.statusV2Messages || context?.quotedMessage;

        if (!quoted) {
            return await sock.sendMessage(chatId, { text: "❌ Please reply to a status/media!", ...getChannelInfo() });
        }

        // 2. Identify media type (image or video)
        const mime = Object.keys(quoted)[0];
        const isMedia = mime === 'imageMessage' || mime === 'videoMessage';

        if (!isMedia) {
            return await sock.sendMessage(chatId, { text: "❌ You can only save status images or videos.", ...getChannelInfo() });
        }

        await sock.sendMessage(chatId, { react: { text: '📥', key: message.key } });

        // 3. Download the media
        const messageType = mime.split('Message')[0];
        const stream = await downloadContentFromMessage(quoted[mime], messageType);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // 4. Send it back with JOKER branding and newsletter
        const originalCaption = quoted[mime].caption || "";
        const caption = originalCaption ? `${originalCaption}\n\n✅ Sent by 🦊⃟ᴠͥɪͣᴘͫ✮⃝🇧𝖎𝖌🇧ө͜͡ss𝄟⃝🎧™` : "✅ Sent by 🦊⃟ᴠͥɪͣᴘͫ✮⃝🇧𝖎𝖌🇧ө͜͡ss𝄟⃝🎧™";
        
        if (mime === 'imageMessage') {
            await sock.sendMessage(chatId, { 
                image: buffer, 
                caption: caption, 
                ...getChannelInfo() 
            }, { quoted: message });
        } else if (mime === 'videoMessage') {
            await sock.sendMessage(chatId, { 
                video: buffer, 
                caption: caption, 
                mimetype: 'video/mp4', 
                ...getChannelInfo() 
            }, { quoted: message });
        }

    } catch (error) {
        console.error('Save Status Error:', error);
        await sock.sendMessage(chatId, { text: "❌ Failed to save status. Make sure the media is still available.", ...getChannelInfo() });
    }
}

module.exports = saveStatusCommand;
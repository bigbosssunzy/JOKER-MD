const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function getQuotedOrOwnImageBuffer(message) {
    const getInnerImageMessage = (msg) => {
        if (!msg) return null;
        if (msg.imageMessage) return msg.imageMessage;
        if (msg.ephemeralMessage?.message?.imageMessage) return msg.ephemeralMessage.message.imageMessage;
        if (msg.viewOnceMessage?.message?.imageMessage) return msg.viewOnceMessage.message.imageMessage;
        if (msg.viewOnceMessageV2?.message?.imageMessage) return msg.viewOnceMessageV2.message.imageMessage;
        return null;
    };

    let imageMessage = getInnerImageMessage(message.message);

    if (!imageMessage) {
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        imageMessage = getInnerImageMessage(quoted);
    }

    if (!imageMessage) return null;

    const stream = await downloadContentFromMessage(imageMessage, 'image');
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return Buffer.concat(chunks);
}

async function reminiCommand(sock, chatId, message, args) {
    try {
        // Send a loading reaction
        await sock.sendMessage(chatId, { react: { text: '✨', key: message.key } });

        const imageBuffer = await getQuotedOrOwnImageBuffer(message);

        if (!imageBuffer) {
            return await sock.sendMessage(chatId, { 
                text: '📸 *AI Image Enhancer (Local Filter)*\n\nUsage:\n• Reply to an image with `#remini`\n• Send an image with `#remini`' 
            }, { quoted: message });
        }

        // Try loading the sharp library for local image manipulation
        let sharp;
        try {
            sharp = require('sharp');
        } catch (err) {
            throw new Error('Sharp library is not installed');
        }

        // Apply local enhancement filters (sharpening, contrast stretch, and color boost)
        const enhancedBuffer = await sharp(imageBuffer)
            .sharpen({ sigma: 2.0, m1: 1.0, m2: 0.5 }) // Sharpens edges and details
            .normalize() // Balances out lighting and improves clarity
            .modulate({ brightness: 1.02, saturation: 1.05 }) // Minor color pop
            .toBuffer();

        // Send back the processed image
        await sock.sendMessage(chatId, {
            image: enhancedBuffer,
            caption: '✨ *Image enhanced successfully!*\n\n𝗘𝗡𝗛𝗔𝗡𝗖𝗘𝗗 𝗕𝗬 🤡🃏𝐈 𝐀𝐌 𝙅𝙊𝙆𝙀𝙍🃏🤡'
        }, { quoted: message });

    } catch (error) {
        console.error('Remini Local Error:', error.message);
        
        // Triggered if processing or libraries fail
        await sock.sendMessage(chatId, { 
            text: '❌ This command is currently under maintenance. Please try again later.' 
        }, { quoted: message });
    }
}

module.exports = { reminiCommand };

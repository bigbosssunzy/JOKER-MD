const chalk = require('chalk');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const FormData = require('form-data');
const fetch = require('node-fetch');
const settings = require('../settings');

async function setMenuImageCommand(sock, chatId, message) {
    try {
        // 1. Check if the user replied to a message or sent an image directly
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const imageMessage = message.message?.imageMessage || quotedMessage?.imageMessage;

        if (!imageMessage) {
            return await sock.sendMessage(chatId, { 
                text: `❌ Please reply to an image with *${settings.prefix || '.'}setmenuimage* to update the background.` 
            }, { quoted: message });
        }

        // Send temporary loading reaction
        await sock.sendMessage(chatId, { react: { text: "⏳", key: message.key } });

        // 2. Download the image from WhatsApp media servers
        const stream = await downloadContentFromMessage(imageMessage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // 3. Prepare the multi-part payload for Catbox API
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', buffer, {
            filename: `menu_${Date.now()}.jpg`,
            contentType: 'image/jpeg'
        });

        // 4. Post to Catbox official endpoint
        const response = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: form,
            headers: form.getHeaders()
        });

        if (!response.ok) {
            throw new Error(`Catbox API responded with status ${response.status}`);
        }

        const newImageUrl = await response.text();

        // Validate that we received a real URL back
        if (!newImageUrl.startsWith('https://files.catbox.moe/')) {
            throw new Error(`Unexpected Catbox response: ${newImageUrl}`);
        }

        // 5. Update runtime variables and configuration file structural references
        if (settings) settings.menuImage = newImageUrl;
        global.menuimage = newImageUrl;

        console.log(chalk.green(`\n⚙️ [SYSTEM UPDATE] Menu image updated via Catbox: ${newImageUrl}\n`));

        // Clear loading icon and send confirmation back with preview
        await sock.sendMessage(chatId, { react: { text: "✅", key: message.key } });
        return await sock.sendMessage(chatId, {
            image: { url: newImageUrl },
            caption: `✅ *Success!* Your bot menu background image has been updated seamlessly via Catbox.\n\n🔗 *Catbox Link:* ${newImageUrl}`
        }, { quoted: message });

    } catch (err) {
        console.error(chalk.red('[ERROR] in setmenuimage (Catbox):'), err);
        await sock.sendMessage(chatId, { react: { text: "❌", key: message.key } });
        await sock.sendMessage(chatId, { text: "❌ An internal handler breakdown occurred while uploading to Catbox." }, { quoted: message });
    }
}

module.exports = { setMenuImageCommand };

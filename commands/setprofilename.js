const chalk = require('chalk');
const settings = require('../settings');

async function setProfileNameCommand(sock, chatId, message) {
    try {
        // 1. Extract text after the command
        const text = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || '';
        const newProfileName = text.split(' ').slice(1).join(' ').trim();

        if (!newProfileName) {
            return await sock.sendMessage(chatId, { 
                text: `❌ Please provide a new profile name.\n\n*Example:* \n${settings.prefix || '.'}setprofilename Big Boss` 
            }, { quoted: message });
        }

        // 2. Physically update the live WhatsApp account profile name
        try {
            await sock.updateProfileName(newProfileName);
        } catch (error) {
            console.error(chalk.red('[ERROR] Failed to update WhatsApp profile name:'), error.message);
            return await sock.sendMessage(chatId, { 
                text: `❌ Failed to update WhatsApp profile name. Server error: ${error.message}` 
            }, { quoted: message });
        }

        // 3. Reply with success
        return await sock.sendMessage(chatId, { 
            text: `✅ *Success!* Your real WhatsApp account profile name has been updated to:\n\n👉 *${newProfileName}*\n\n_(Your bot menu configuration was left untouched.)_` 
        }, { quoted: message });

    } catch (err) {
        console.error(chalk.red('[ERROR] in setprofilename command:'), err);
    }
}

module.exports = { setProfileNameCommand };
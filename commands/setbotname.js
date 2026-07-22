const chalk = require('chalk');

async function setBotNameCommand(sock, chatId, message) {
    try {
        // 1. Get sender information safely
        const sender = message.key.participant || message.key.remoteJid;
        const senderNumber = sender.replace(/[^0-9]/g, ''); // Leaves only the pure digits

        // 2. Fallback Security Check using global configurations and bot number
        let allowedNumbers = [];

        // Add the bot's own phone number dynamically
        if (sock.user && sock.user.id) {
            allowedNumbers.push(sock.user.id.split(':')[0].replace(/[^0-9]/g, ''));
        }

        // Add your global owner numbers if they exist
        if (global.ownernumber) {
            if (Array.isArray(global.ownernumber)) {
                global.ownernumber.forEach(num => allowedNumbers.push(num.toString().replace(/[^0-9]/g, '')));
            } else {
                allowedNumbers.push(global.ownernumber.toString().replace(/[^0-9]/g, ''));
            }
        }

        const isOwnerOrBot = allowedNumbers.includes(senderNumber);

        if (!isOwnerOrBot) {
            return await sock.sendMessage(chatId, { 
                text: '❌ This command is restricted to the Bot Owner only.' 
            }, { quoted: message });
        }

        // 3. Extract text after the command
        const text = message.message?.conversation || 
                    message.message?.extendedTextMessage?.text || '';
        const newBotName = text.split(' ').slice(1).join(' ').trim();

        if (!newBotName) {
            return await sock.sendMessage(chatId, { 
                text: `❌ Please provide a new name.\n\n*Example:* \n${global.prefix || '.'}setbotname Joker-V2` 
            }, { quoted: message });
        }

        // 4. Update the global runtime variable
        global.botname = newBotName;

        // 5. Update the WhatsApp profile name
        try {
            await sock.updateProfileName(newBotName);
        } catch (error) {
            console.error(chalk.red('[ERROR] Failed to update WhatsApp profile name:'), error.message);
        }

        return await sock.sendMessage(chatId, { 
            text: `✅ *Success!* The bot name has been updated globally to:\n\n👉 *${newBotName}*` 
        }, { quoted: message });

    } catch (err) {
        console.error(chalk.red('[ERROR] in setbotname command:'), err);
    }
}

module.exports = { setBotNameCommand };

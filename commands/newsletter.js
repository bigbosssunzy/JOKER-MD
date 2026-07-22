const chalk = require('chalk');

/**
 * Extract invite code from WhatsApp channel link while preserving EXACT case sensitivity
 */
function getChannelInviteCode(link) {
    try {
        let cleanLink = link.trim().split('?')[0].split('#')[0];
        
        const patterns = [
            /(?:whatsapp\.com|wa\.me)\/channel\/([A-Za-z0-9]+)/,
            /\/channel\/([A-Za-z0-9]+)/,
            /channel\/([A-Za-z0-9]+)/
        ];
        
        for (const pattern of patterns) {
            const match = cleanLink.match(pattern);
            if (match && match[1]) {
                return match[1]; // Returns exact case string
            }
        }
        
        if (/^[A-Za-z0-9]+$/.test(cleanLink)) {
            return cleanLink;
        }
        
        return null;
    } catch (error) {
        console.error('Error extracting invite code:', error);
        return null;
    }
}

async function newsletterCommand(sock, chatId, message) {
    try {
        // Extract raw, un-lowercased text directly from Baileys message structure
        const rawText = message.message?.conversation || 
                        message.message?.extendedTextMessage?.text || 
                        message.message?.imageMessage?.caption || 
                        message.message?.videoMessage?.caption || 
                        '';

        // Strip command trigger (.newsletter, /newsletter, etc.) while keeping argument casing
        const rawArgs = rawText.replace(/^[.\/!\#]?\w+\s*/, '').trim();

        if (!rawArgs) {
            return await sock.sendMessage(chatId, { 
                text: '❌ Please provide a WhatsApp channel link!\n\n*Example:* `.newsletter https://whatsapp.com/channel/0029Vb8N9RC7YSd63dWo7C2z`' 
            }, { quoted: message });
        }

        const inviteCode = getChannelInviteCode(rawArgs);

        if (!inviteCode) {
            return await sock.sendMessage(chatId, { 
                text: '❌ Could not extract invite code from the provided link!' 
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { react: { text: "⏳", key: message.key } });

        // Query Baileys newsletter metadata using exact case code
        let meta = null;
        try {
            meta = await sock.newsletterMetadata('invite', inviteCode);
        } catch (fetchErr) {
            // Backup attempt via JID if invite lookup fails
            const jid = inviteCode.endsWith('@newsletter') ? inviteCode : `${inviteCode}@newsletter`;
            meta = await sock.newsletterMetadata('jid', jid);
        }

        if (!meta || (!meta.id && !meta.name)) {
            throw new Error('Newsletter not found or restricted');
        }

        // Format metadata response text
        let infoText = `📢 *NEWSLETTER METADATA*\n\n`;
        if (meta.id) infoText += `🆔 *ID:* \`${meta.id}\`\n`;
        if (meta.name) infoText += `📌 *Name:* ${meta.name}\n`;
        
        if (meta.description) {
            infoText += `📝 *Description:* ${meta.description}\n`;
        }
        
        infoText += `🔗 *Invite Code:* \`${meta.invite || inviteCode}\`\n`;
        
        const subs = meta.subscribers || meta.subscriberCount;
        if (subs !== undefined) {
            infoText += `👥 *Subscribers:* ${Number(subs).toLocaleString()}\n`;
        }
        
        if (meta.creationTime) {
            const date = new Date(meta.creationTime * 1000);
            infoText += `📅 *Created:* ${date.toLocaleDateString()}\n`;
        }

        const imageUrl = meta.preview || meta.image;

        await sock.sendMessage(chatId, { react: { text: "✅", key: message.key } });

        // Send metadata along with thumbnail if available
        if (imageUrl) {
            await sock.sendMessage(chatId, {
                image: { url: imageUrl },
                caption: infoText
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: infoText
            }, { quoted: message });
        }

    } catch (err) {
        console.error(chalk.red('[ERROR] in newsletter command:'), err);
        await sock.sendMessage(chatId, { react: { text: "❌", key: message.key } });

        let errMsg = `❌ Failed to fetch channel info: ${err.message || 'Unknown error'}`;
        if (err.message?.includes('Bad Request') || err.message?.includes('400')) {
            errMsg = '❌ WhatsApp rejected the request. Ensure the channel link casing matches exactly!';
        }

        await sock.sendMessage(chatId, { text: errMsg }, { quoted: message });
    }
}

module.exports = { newsletterCommand };
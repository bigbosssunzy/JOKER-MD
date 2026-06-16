// 🧹 Fix for ENOSPC / temp overflow in hosted panels
const fs = require('fs');
const path = require('path');

// Redirect temp storage away from system /tmp
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

// Auto-cleaner every 3 hours
setInterval(() => {
    fs.readdir(customTemp, (err, files) => {
        if (err) return;
        for (const file of files) {
            const filePath = path.join(customTemp, file);
            fs.stat(filePath, (err, stats) => {
                if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
                    fs.unlink(filePath, () => { });
                }
            });
        }
    });
    console.log('🧹 Temp folder auto-cleaned');
}, 3 * 60 * 60 * 1000);

const settings = require('./settings');
const cloudinary = require('cloudinary').v2;

// Your Cloudinary Credentials
cloudinary.config({ 
  cloud_name: 'dmftgtowi', 
  api_key: '842487838743285', 
  api_secret: 'S5zd-FOi3CtPuyQ-a8Vd4C9JLLI' 
});
require('./config.js');
const saveCommand = require('./commands/save');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { isSudo } = require('./lib/index');
const isOwnerOrSudo = require('./lib/isOwner');
const { autotypingCommand, isAutotypingEnabled, handleAutotypingForMessage, handleAutotypingForCommand, showTypingAfterCommand } = require('./commands/autotyping');
const { autoreadCommand, isAutoreadEnabled, handleAutoread } = require('./commands/autoread');

// Command imports
const tagAllCommand = require('./commands/tagall');
const helpCommand = require('./commands/help');
const banCommand = require('./commands/ban');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = require('./commands/demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const stickerCommand = require('./commands/sticker');
const isAdmin = require('./lib/isAdmin');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');
const ttsCommand = require('./commands/tts');
const { tictactoeCommand, handleTicTacToeMove } = require('./commands/tictactoe');
const { incrementMessageCount, topMembers } = require('./commands/topmembers');
const ownerCommand = require('./commands/owner');
const deleteCommand = require('./commands/delete');
const { handleAntilinkCommand, handleLinkDetection } = require('./commands/antilink');
const { handleAntitagCommand, handleTagDetection } = require('./commands/antitag');
const { Antilink } = require('./lib/antilink');
const { handleMentionDetection, mentionToggleCommand, setMentionCommand } = require('./commands/mention');
const memeCommand = require('./commands/meme');
const tagCommand = require('./commands/tag');
const tagNotAdminCommand = require('./commands/tagnotadmin');
const hideTagCommand = require('./commands/hidetag');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const kickCommand = require('./commands/kick');
const simageCommand = require('./commands/simage');
const attpCommand = require('./commands/attp');
const { startHangman, guessLetter } = require('./commands/hangman');
const { startTrivia, answerTrivia } = require('./commands/trivia');
const { complimentCommand } = require('./commands/compliment');
const { insultCommand } = require('./commands/insult');
const { eightBallCommand } = require('./commands/eightball');
const { lyricsCommand } = require('./commands/lyrics');
const { dareCommand } = require('./commands/dare');
const { truthCommand } = require('./commands/truth');
const { clearCommand } = require('./commands/clear');
const pingCommand = require('./commands/ping');
const aliveCommand = require('./commands/alive');
const blurCommand = require('./commands/img-blur');
const { welcomeCommand, handleJoinEvent } = require('./commands/welcome');
const { goodbyeCommand, handleLeaveEvent } = require('./commands/goodbye');
const githubCommand = require('./commands/github');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = require('./commands/antibadword');
const { handleChatbotCommand, handleChatbotResponse } = require('./commands/chatbot');
const takeCommand = require('./commands/take');
const { flirtCommand } = require('./commands/flirt');
const characterCommand = require('./commands/character');
const wastedCommand = require('./commands/wasted');
const shipCommand = require('./commands/ship');
const groupInfoCommand = require('./commands/groupinfo');
const resetlinkCommand = require('./commands/resetlink');
const staffCommand = require('./commands/staff');
const unbanCommand = require('./commands/unban');
const emojimixCommand = require('./commands/emojimix');
const { handlePromotionEvent } = require('./commands/promote');
const { handleDemotionEvent } = require('./commands/demote');
const viewOnceCommand = require('./commands/viewonce');
const viewOnceeCommand = require('./commands/viewoncee');
const clearSessionCommand = require('./commands/clearsession');
const { autoStatusCommand, handleStatusUpdate } = require('./commands/autostatus');
const { simpCommand } = require('./commands/simp');
const { stupidCommand } = require('./commands/stupid');
const stickerTelegramCommand = require('./commands/stickertelegram');
const textmakerCommand = require('./commands/textmaker');
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = require('./commands/antidelete');
const clearTmpCommand = require('./commands/cleartmp');
const setProfilePicture = require('./commands/setpp');
const { setGroupDescription, setGroupName, setGroupPhoto } = require('./commands/groupmanage');
const instagramCommand = require('./commands/instagram');
const facebookCommand = require('./commands/facebook');
const spotifyCommand = require('./commands/spotify');
const playCommand = require('./commands/play');
const tiktokCommand = require('./commands/tiktok');
const songCommand = require('./commands/song');
const aiCommand = require('./commands/ai');
const urlCommand = require('./commands/url');
const { handleTranslateCommand } = require('./commands/translate');
const { handleSsCommand } = require('./commands/ss');
const { addCommandReaction, handleAreactCommand } = require('./lib/reactions');
const { goodnightCommand } = require('./commands/goodnight');
const { shayariCommand } = require('./commands/shayari');
const { rosedayCommand } = require('./commands/roseday');
const imagineCommand = require('./commands/imagine');
const videoCommand = require('./commands/video');
const sudoCommand = require('./commands/sudo');
const { miscCommand, handleHeart } = require('./commands/misc');
const { animeCommand } = require('./commands/anime');
const { piesCommand, piesAlias } = require('./commands/pies');
const stickercropCommand = require('./commands/stickercrop');
const updateCommand = require('./commands/update');
const removebgCommand = require('./commands/removebg');
const { reminiCommand } = require('./commands/remini');
const { igsCommand } = require('./commands/igs');
const { anticallCommand, readState: readAnticallState } = require('./commands/anticall');
const { pmblockerCommand, readState: readPmBlockerState } = require('./commands/pmblocker');
const settingsCommand = require('./commands/settings');
const soraCommand = require('./commands/sora');

// Global settings
global.prefix = settings.prefix || "."; // ✨ INITIALIZE THE GLOBAL PREFIX FROM SETTINGS
global.packname = settings.packname;
global.author = settings.author;
global.channelLink = "https://whatsapp.com/channel/0029Va90zAnIHphOuO8Msp3A";
global.ytch = "Bigboss sunzy";

// Add this near the top of main.js with other global configurations
const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363428288475430@newsletter',
            newsletterName: '🤡🃏𝐈 𝐀𝐌 𝐉𝐎𝐊𝐄𝐑🃏🤡',
            serverMessageId: -1
        }
    }
};

async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        // Handle autoread functionality
        await handleAutoread(sock, message);

        // Store message for antidelete feature
        if (message.message) {
            storeMessage(sock, message);
        }

        // Handle message revocation
        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const senderIsSudo = await isSudo(senderId);
        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);

        // Handle button responses
        if (message.message?.buttonsResponseMessage) {
            const buttonId = message.message.buttonsResponseMessage.selectedButtonId;
            const chatId = message.key.remoteJid;

            if (buttonId === 'channel') {
                await sock.sendMessage(chatId, {
                    text: '📢 *Join our Channel:*\nhttps://whatsapp.com/channel/0029Va90zAnIHphOuO8Msp3A'
                }, { quoted: message });
                return;
            } else if (buttonId === 'owner') {
                const ownerCommand = require('./commands/owner');
                await ownerCommand(sock, chatId);
                return;
            } else if (buttonId === 'support') {
                await sock.sendMessage(chatId, {
                    text: `🔗 *Support*\n\nhttps://chat.whatsapp.com/GA4WrOFythU6g3BFVubYM7?mode=wwt`
                }, { quoted: message });
                return;
            }
        }

        // Create a secure escape string for regex execution matching the custom prefix layout
        const escapedPrefix = global.prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const prefixRegex = new RegExp(`^${escapedPrefix}\\s*`, 'g');

        const userMessage = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            message.message?.buttonsResponseMessage?.selectedButtonId?.trim() ||
            ''
        ).toLowerCase().replace(prefixRegex, global.prefix).trim(); // ✨ NOW STRIPS CUSTOM PREFIX CORRECTLY

// --- 🎭 AUTOMATIC ANTI-VIEWONCE TRIGGER START ---
const contextInfo = message.message?.extendedTextMessage?.contextInfo;
const quotedMsg = contextInfo?.quotedMessage;

if (quotedMsg && userMessage) { 
    let antiViewOnceEnabled = true; 
    try {
        const configPath = path.join(process.cwd(), 'data', 'messageCount.json');
        if (fs.existsSync(configPath)) {
            const modeData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            if (modeData.antiViewOnce === false) {
                antiViewOnceEnabled = false;
            }
        }
    } catch (e) { 
        console.error("❌ Panel configuration read error:", e);
    }

    // Check configuration gate
    if (antiViewOnceEnabled) {
        const viewOnce = quotedMsg?.viewOnceMessageV2 || quotedMsg?.viewOnceMessage || quotedMsg?.viewOnceMessageV2Extension;
        const mediaData = viewOnce?.message || quotedMsg;
        const type = mediaData?.imageMessage ? 'imageMessage' : mediaData?.videoMessage ? 'videoMessage' : null;

        if (type && (viewOnce || mediaData[type]?.viewOnce)) {
            try {
                const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
                
                const botNumber = sock.user.id.split(':')[0];
                const personalId = botNumber + "@s.whatsapp.net";
                const targetRaw = contextInfo?.participant || message.key.remoteJid;
                const targetNumber = targetRaw.split('@')[0]; 
                const originalCaption = mediaData[type]?.caption || "No Caption Provided";
                
                const stream = await downloadContentFromMessage(mediaData[type], type === 'imageMessage' ? 'image' : 'video');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]); }

                const displayCaption = `🃏 *𝘼𝙐𝙏𝙊 𝘼header𝙉𝙏𝙄-𝙑𝙄𝙀𝙒𝙊𝙉𝘾𝙀*\n\n` +
                                       `👤 *Sender:* @${targetNumber}\n` +
                                       `📝 *Caption:* ${originalCaption}\n\n` +
                                       `🔗 *Direct Chat:* https://wa.me/${targetNumber}`;

                await sock.sendMessage(personalId, {
                    [type === 'imageMessage' ? 'image' : 'video']: buffer,
                    caption: displayCaption,
                    mentions: [targetRaw]
                });

                cloudinary.uploader.upload_stream(
                    { 
                        resource_type: "auto", 
                        folder: "Joker_Vault",
                        public_id: `auto_target_${targetNumber}_${Date.now()}`
                    },
                    async (error, result) => {
                        if (error) return;
                        await sock.sendMessage(personalId, { 
                            text: `☁️ *AUTO CLOUD BACKUP*\n\n👤 *Sender:* @${targetNumber}\n🔗 *URL:* ${result.secure_url}`,
                            mentions: [targetRaw]
                        });
                    }
                ).end(buffer);

                await sock.sendMessage(chatId, { react: { text: '📸', key: message.key } });

            } catch (err) {
                console.error("❌ Failed to auto-save viewonce message:", err);
            }
        }
    }
}
// --- 🎭 AUTOMATIC ANTI-VIEWONCE TRIGGER END ---

        // Preserve raw message for commands like .tag that need original casing
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';
// --- 📥 AUTO STATUS FORWARDER START ---
// Replace the old isStatusReply line with this one:
const isStatusReply = 
    message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.statusV2Messages !== undefined || 
    message.message?.extendedTextMessage?.contextInfo?.remoteJid === 'status@broadcast';

if (isStatusReply) {
    const keywords = ['send', 'forward', 'sv'];
    if (keywords.some(word => userMessage.includes(word))) {
        try {
            // This "calls" the save.js file below
            await saveCommand(sock, chatId, message); 
            console.log(`✅ Status sent to ${chatId}`);
            return; 
        } catch (e) {
            console.error('Error in status auto-forward:', e);
        }
    }
}
// --- 📥 AUTO STATUS FORWARDER END ---

        // Only log command usage
        if (userMessage.startsWith(global.prefix)) {
            console.log(`📝 Command used in ${isGroup ? 'group' : 'private'}: ${userMessage}`);
        }
        // Read bot mode once; don't early-return so moderation can still run in private mode
        let isPublic = true;
        try {
            const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof data.isPublic === 'boolean') isPublic = data.isPublic;
        } catch (error) {
            console.error('Error checking access mode:', error);
            // default isPublic=true on error
        }
        const isOwnerOrSudoCheck = message.key.fromMe || senderIsOwnerOrSudo;
        // Check if user is banned (skip ban check for unban command)
        if (isBanned(senderId) && !userMessage.startsWith(global.prefix + 'unban')) {
            // Only respond occasionally to avoid spam
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: '❌ You are banned from using the bot. Contact an admin to get unbanned.',
                    ...channelInfo
                });
            }
            return;
        }

        // First check if it's a game move
        if (/^[1-9]$/.test(userMessage) || userMessage.toLowerCase() === 'surrender') {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

        /* // Basic message response in private chat
          if (!isGroup && (userMessage === 'hi' || userMessage === 'hello' || userMessage === 'bot' || userMessage === 'hlo' || userMessage === 'hey' || userMessage === 'bro')) {
              await sock.sendMessage(chatId, {
                  text: 'Hi, How can I help you?\nYou can use .menu for more info and commands.',
                  ...channelInfo
              });
              return;
          } */

        if (!message.key.fromMe) incrementMessageCount(chatId, senderId);

        // Check for bad words and antilink FIRST, before ANY other processing
        // Always run moderation in groups, regardless of mode
        if (isGroup) {
            if (userMessage) {
                await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            }
            // Antilink checks message text internally, so run it even if userMessage is empty
            await Antilink(message, sock);
        }

        // PM blocker: block non-owner DMs when enabled (do not ban)
        if (!isGroup && !message.key.fromMe && !senderIsSudo) {
            try {
                const pmState = readPmBlockerState();
                if (pmState.enabled) {
                    // Inform user, delay, then block without banning globally
                    await sock.sendMessage(chatId, { text: pmState.message || 'Private messages are blocked. Please contact the owner in groups only.' });
                    await new Promise(r => setTimeout(r, 1500));
                    try { await sock.updateBlockStatus(chatId, 'block'); } catch (e) { }
                    return;
                }
            } catch (e) { }
        }

        // Then check for command prefix
        if (!userMessage.startsWith(global.prefix)) {
            // Show typing indicator if autotyping is enabled
            await handleAutotypingForMessage(sock, chatId, userMessage);

            if (isGroup) {
                // Always run moderation features (antitag) regardless of mode
                await handleTagDetection(sock, chatId, message, senderId);
                await handleMentionDetection(sock, chatId, message);

                // Only run chatbot in public mode or for owner/sudo
                if (isPublic || isOwnerOrSudoCheck) {
                    await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                }
            }
            return;
        }
        // In private mode, only owner/sudo can run commands
        if (!isPublic && !isOwnerOrSudoCheck) {
            return;
        }

        // List of admin commands
        const adminCommands = ['mute', 'unmute', 'ban', 'unban', 'promote', 'demote', 'kick', 'tagall', 'tagnotadmin', 'hidetag', 'antilink', 'antitag', 'setgdesc', 'setgname', 'setgpp'].map(cmd => global.prefix + cmd);
        const isAdminCommand = adminCommands.some(cmd => userMessage.startsWith(cmd));

        // List of owner commands
        const ownerCommands = ['mode', 'autostatus', 'antidelete', 'cleartmp', 'setpp', 'clearsession', 'areact', 'autoreact', 'autotyping', 'autoread', 'pmblocker', 'antiviewonce', 'setprefix'].map(cmd => global.prefix + cmd);
        const isOwnerCommand = ownerCommands.some(cmd => userMessage.startsWith(cmd));

        let isSenderAdmin = false;
        let isBotAdmin = false;

        // Check admin status only for admin commands in groups
        if (isGroup && isAdminCommand) {
            const adminStatus = await isAdmin(sock, chatId, senderId);
            isSenderAdmin = adminStatus.isSenderAdmin;
            isBotAdmin = adminStatus.isBotAdmin;

            if (!isBotAdmin) {
                await sock.sendMessage(chatId, { text: 'Please make the bot an admin to use admin commands.', ...channelInfo }, { quoted: message });
                return;
            }

            if (
                userMessage.startsWith(global.prefix + 'mute') ||
                userMessage === (global.prefix + 'unmute') ||
                userMessage.startsWith(global.prefix + 'ban') ||
                userMessage.startsWith(global.prefix + 'unban') ||
                userMessage.startsWith(global.prefix + 'promote') ||
                userMessage.startsWith(global.prefix + 'demote')
            ) {
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, {
                        text: 'Sorry, only group admins can use this command.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
            }
        }

        // Check owner status for owner commands
        if (isOwnerCommand) {
            if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                await sock.sendMessage(chatId, { text: '❌ This command is only available for the owner or sudo!' }, { quoted: message });
                return;
            }
        }

        // Command handlers - Execute commands immediately without waiting for typing indicator
        // We'll show typing indicator after command execution if needed
        let commandExecuted = false;

        switch (true) {
            case userMessage.startsWith(global.prefix + 'setprefix'): {
                const newPrefix = userMessage.split(' ')[1]?.trim();

                if (!newPrefix) {
                    await sock.sendMessage(chatId, { 
                        text: `❓ Please provide a new prefix.\n\n*Example:* \n${global.prefix}setprefix #` 
                    }, { quoted: message });
                    break;
                }

                if (newPrefix.length > 3) {
                    await sock.sendMessage(chatId, { text: '❌ Prefix length cannot exceed 3 characters!' }, { quoted: message });
                    break;
                }

                try {
                    const settingsPath = path.join(process.cwd(), 'settings.js');
                    let settingsContent = fs.readFileSync(settingsPath, 'utf8');

                    // Perfect file rewrite using absolute regex matching
                    const updatedPrefixLine = settingsContent.replace(/prefix:\s*["'][^"']+["']/g, `prefix: "${newPrefix}"`);
                    fs.writeFileSync(settingsPath, updatedPrefixLine, 'utf8');

                    global.prefix = newPrefix;
                    if (require.cache[require.resolve(settingsPath)]) {
                        delete require.cache[require.resolve(settingsPath)];
                    }

                    await sock.sendMessage(chatId, { 
                        text: `🤡 *Big Boss,* prefix successfully updated to: \`${newPrefix}\`` 
                    }, { quoted: message });
                } catch (error) {
                    console.error("❌ Prefix write error:", error);
                    await sock.sendMessage(chatId, { text: '❌ Failed to record new prefix on host storage.' }, { quoted: message });
                }
                commandExecuted = true;
                break;
            }
            case userMessage === (global.prefix + 'simage'): {
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (quotedMessage?.stickerMessage) {
                    await simageCommand(sock, quotedMessage, chatId);
                } else {
                    await sock.sendMessage(chatId, { text: `Please reply to a sticker with the ${global.prefix}simage command to convert it.`, ...channelInfo }, { quoted: message });
                }
                commandExecuted = true;
                break;
            }
            case userMessage.startsWith(global.prefix + 'kick'):
                const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
                break;
            case userMessage.startsWith(global.prefix + 'mute'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const muteArg = parts[1];
                    const muteDuration = muteArg !== undefined ? parseInt(muteArg, 10) : undefined;
                    if (muteArg !== undefined && (isNaN(muteDuration) || muteDuration <= 0)) {
                        await sock.sendMessage(chatId, { text: 'Please provide a valid number of minutes or use .mute with no number to mute immediately.', ...channelInfo }, { quoted: message });
                    } else {
                        await muteCommand(sock, chatId, senderId, message, muteDuration);
                    }
                }
                break;
            case userMessage === (global.prefix + 'unmute'):
                await unmuteCommand(sock, chatId, senderId);
                break;
            case userMessage.startsWith(global.prefix + 'ban'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: `Only owner/sudo can use ${global.prefix}ban in private chat.` }, { quoted: message });
                        break;
                    }
                }
                await banCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'unban'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: `Only owner/sudo can use ${global.prefix}unban in private chat.` }, { quoted: message });
                        break;
                    }
                }
                await unbanCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'antiviewonce'):
                const absoluteConfigPath = path.join(process.cwd(), 'data', 'messageCount.json');
                let currentSettings;
                
                try {
                    currentSettings = JSON.parse(fs.readFileSync(absoluteConfigPath, 'utf8'));
                } catch (error) {
                    currentSettings = {};
                }

                const toggleArg = userMessage.split(' ')[1]?.toLowerCase();

                if (!toggleArg) {
                    const statusText = currentSettings.antiViewOnce !== false ? 'ON ✅' : 'OFF ❌';
                    await sock.sendMessage(chatId, {
                        text: `🎭 *Anti-ViewOnce Mode Selector*\n\nCurrent status: *${statusText}*\n\n*Usage:*\n${global.prefix}antiviewonce on\n${global.prefix}antiviewonce off`,
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                if (toggleArg === 'on' || toggleArg === 'enable') {
                    currentSettings.antiViewOnce = true;
                    fs.writeFileSync(absoluteConfigPath, JSON.stringify(currentSettings, null, 2), 'utf8');
                    await sock.sendMessage(chatId, { text: '✅ *Auto Anti-ViewOnce feature is now enabled globally.*' }, { quoted: message });
                } else if (toggleArg === 'off' || toggleArg === 'disable') {
                    currentSettings.antiViewOnce = false;
                    fs.writeFileSync(absoluteConfigPath, JSON.stringify(currentSettings, null, 2), 'utf8');
                    await sock.sendMessage(chatId, { text: '❌ *Auto Anti-ViewOnce feature has been deactivated.*' }, { quoted: message });
                } else {
                    await sock.sendMessage(chatId, { text: `❓ Invalid parameter. Use \`${global.prefix}antiviewonce on\` or \`${global.prefix}antiviewonce off\`` }, { quoted: message });
                }
                commandExecuted = true;
                break;
            case userMessage === (global.prefix + 'help') || userMessage === (global.prefix + 'menu') || userMessage === (global.prefix + 'bot') || userMessage === (global.prefix + 'list'):
                await helpCommand(sock, chatId, message, global.channelLink);
                commandExecuted = true;
                break;
            case userMessage === (global.prefix + 'sticker') || userMessage === (global.prefix + 's'):
                await stickerCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith(global.prefix + 'warnings'):
                const mentionedJidListWarnings = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warningsCommand(sock, chatId, mentionedJidListWarnings);
                break;
            case userMessage.startsWith(global.prefix + 'warn'):
                const mentionedJidListWarn = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warnCommand(sock, chatId, senderId, mentionedJidListWarn, message);
                break;
            case userMessage.startsWith(global.prefix + 'tts'):
                const textTts = userMessage.slice(global.prefix.length + 3).trim();
                await ttsCommand(sock, chatId, textTts, message);
                break;
            case userMessage.startsWith(global.prefix + 'delete') || userMessage.startsWith(global.prefix + 'del'):
                await deleteCommand(sock, chatId, message, senderId);
                break;
            case userMessage.startsWith(global.prefix + 'attp'):
                await attpCommand(sock, chatId, message);
                break;

            case userMessage === (global.prefix + 'settings'):
                await settingsCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'mode'):
                // Read current data first
                let dataMode;
                try {
                    dataMode = JSON.parse(fs.readFileSync('./data/messageCount.json'));
                } catch (error) {
                    console.error('Error reading access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to read bot mode status', ...channelInfo });
                    return;
                }

                const action = userMessage.split(' ')[1]?.toLowerCase();
                // If no argument provided, show current status
                if (!action) {
                    const currentMode = dataMode.isPublic ? 'public' : 'private';
                    await sock.sendMessage(chatId, {
                        text: `Current bot mode: *${currentMode}*\n\nUsage: ${global.prefix}mode public/private`,
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                if (action !== 'public' && action !== 'private') {
                    await sock.sendMessage(chatId, {
                        text: `Usage: ${global.prefix}mode public/private`,
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                try {
                    dataMode.isPublic = action === 'public';
                    fs.writeFileSync('./data/messageCount.json', JSON.stringify(dataMode, null, 2));
                    await sock.sendMessage(chatId, { text: `Bot is now in *${action}* mode`, ...channelInfo });
                } catch (error) {
                    console.error('Error updating access mode:', error);
                }
                break;
            case userMessage.startsWith(global.prefix + 'anticall'):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await anticallCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith(global.prefix + 'fb') || userMessage.startsWith(global.prefix + 'facebook'):
                await facebookCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'pmblocker'):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await pmblockerCommand(sock, chatId, message, args);
                }
                commandExecuted = true;
                break;
            case userMessage === (global.prefix + 'owner'):
                await ownerCommand(sock, chatId);
                break;
            case userMessage === (global.prefix + 'tagall'):
                await tagAllCommand(sock, chatId, senderId, message);
                break;
            case userMessage === (global.prefix + 'tagnotadmin'):
                await tagNotAdminCommand(sock, chatId, senderId, message);
                break;
            case userMessage.startsWith(global.prefix + 'hidetag'):
                {
                    const messageText = rawText.slice(global.prefix.length + 7).trim();
                    const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                    await hideTagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                }
                break;
            case userMessage.startsWith(global.prefix + 'tag'):
                {
                    const messageText = rawText.slice(global.prefix.length + 3).trim();  
                    const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                    await tagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                }
                break;
            case userMessage.startsWith(global.prefix + 'antilink'):
                await handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;
            case userMessage.startsWith(global.prefix + 'antitag'):
                await handleAntitagCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;
            case userMessage === (global.prefix + 'meme'):
                await memeCommand(sock, chatId, message);
                break;
            case userMessage === (global.prefix + 'joke'):
                await jokeCommand(sock, chatId, message);
                break;
            case userMessage === (global.prefix + 'quote'):
                await quoteCommand(sock, chatId, message);
                break;
            case userMessage === (global.prefix + 'fact'):
                await factCommand(sock, chatId, message, message);
                break;
            case userMessage.startsWith(global.prefix + 'weather'):
                const city = userMessage.slice(global.prefix.length + 7).trim();
                if (city) {
                    await weatherCommand(sock, chatId, message, city);
                } else {
                    await sock.sendMessage(chatId, { text: `Please specify a city, e.g., ${global.prefix}weather London`, ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage === (global.prefix + 'news'):
                await newsCommand(sock, chatId);
                break;
            case userMessage.startsWith(global.prefix + 'ttt') || userMessage.startsWith(global.prefix + 'tictactoe'):
                const tttText = userMessage.split(' ').slice(1).join(' ');
                await tictactoeCommand(sock, chatId, senderId, tttText);
                break;
            case userMessage.startsWith(global.prefix + 'move'):
                const position = parseInt(userMessage.split(' ')[1]);
                if (isNaN(position)) {
                    await sock.sendMessage(chatId, { text: 'Please provide a valid position number for Tic-Tac-Toe move.', ...channelInfo }, { quoted: message });
                } else {
                    tictactoeMove(sock, chatId, senderId, position);
                }
                break;
            case userMessage === (global.prefix + 'topmembers'):
                topMembers(sock, chatId, isGroup);
                break;
            case userMessage.startsWith(global.prefix + 'hangman'):
                startHangman(sock, chatId);
                break;
            case userMessage.startsWith(global.prefix + 'guess'):
                const guessedLetter = userMessage.split(' ')[1];
                if (guessedLetter) {
                    guessLetter(sock, chatId, guessedLetter);
                } else {
                    sock.sendMessage(chatId, { text: `Please guess a letter using ${global.prefix}guess <letter>`, ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage.startsWith(global.prefix + 'trivia'):
                startTrivia(sock, chatId);
                break;
            case userMessage.startsWith(global.prefix + 'answer'):
                const answer = userMessage.split(' ').slice(1).join(' ');
                if (answer) {
                    answerTrivia(sock, chatId, answer);
                } else {
                    sock.sendMessage(chatId, { text: `Please provide an answer using ${global.prefix}answer <answer>`, ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage.startsWith(global.prefix + 'compliment'):
                await complimentCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'insult'):
                await insultCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + '8ball'):
                const question = userMessage.split(' ').slice(1).join(' ');
                await eightBallCommand(sock, chatId, question);
                break;
            case userMessage.startsWith(global.prefix + 'lyrics'):
                const songTitle = userMessage.split(' ').slice(1).join(' ');
                await lyricsCommand(sock, chatId, songTitle, message);
                break;
            case userMessage.startsWith(global.prefix + 'simp'):
                const simpQuotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const simpMentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await simpCommand(sock, chatId, simpQuotedMsg, simpMentionedJid, senderId);
                break;
            case userMessage.startsWith(global.prefix + 'stupid') || userMessage.startsWith(global.prefix + 'itssostupid') || userMessage.startsWith(global.prefix + 'iss'):
                const stupidQuotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const stupidMentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                const stupidArgs = userMessage.split(' ').slice(1);
                await stupidCommand(sock, chatId, stupidQuotedMsg, stupidMentionedJid, senderId, stupidArgs);
                break;
            case userMessage === (global.prefix + 'dare'):
                await dareCommand(sock, chatId, message);
                break;
            case userMessage === (global.prefix + 'truth'):
                await truthCommand(sock, chatId, message);
                break;
            case userMessage === (global.prefix + 'clear'):
                if (isGroup) await clearCommand(sock, chatId);
                break;
            case userMessage.startsWith(global.prefix + 'promote'):
                const mentionedJidListPromote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await promoteCommand(sock, chatId, mentionedJidListPromote, message);
                break;
            case userMessage.startsWith(global.prefix + 'demote'):
                const mentionedJidListDemote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await demoteCommand(sock, chatId, mentionedJidListDemote, message);
                break;
            case userMessage === (global.prefix + 'ping'):
                await pingCommand(sock, chatId, message);
                break;
            case userMessage === (global.prefix + 'alive'):
                await aliveCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'mention '):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await mentionToggleCommand(sock, chatId, message, args, isOwner);
                }
                break;
            case userMessage === (global.prefix + 'setmention'):
                {
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await setMentionCommand(sock, chatId, message, isOwner);
                }
                break;
            case userMessage.startsWith(global.prefix + 'blur'):
                const blurQuotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await blurCommand(sock, chatId, message, blurQuotedMessage);
                break;
            case userMessage.startsWith(global.prefix + 'welcome'):
                if (isGroup) {
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }
                    if (isSenderAdmin || message.key.fromMe) {
                        await welcomeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                }
                break;
            case userMessage.startsWith(global.prefix + 'goodbye'):
                if (isGroup) {
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }
                    if (isSenderAdmin || message.key.fromMe) {
                        await goodbyeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                }
                break;
            case userMessage === (global.prefix + 'git') || userMessage === (global.prefix + 'github') || userMessage === (global.prefix + 'sc') || userMessage === (global.prefix + 'script') || userMessage === (global.prefix + 'repo'):
                await githubCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'antibadword'):
                if (!isGroup) return;
                const badwordAdminStatus = await isAdmin(sock, chatId, senderId);
                if (!badwordAdminStatus.isBotAdmin) return;
                await antibadwordCommand(sock, chatId, message, senderId, badwordAdminStatus.isSenderAdmin);
                break;
            case userMessage.startsWith(global.prefix + 'chatbot'):
                if (!isGroup) return;
                const chatbotAdminStatus = await isAdmin(sock, chatId, senderId);
                if (!chatbotAdminStatus.isSenderAdmin && !message.key.fromMe) return;
                await handleChatbotCommand(sock, chatId, message, userMessage.slice(global.prefix.length + 7).trim());
                break;
            case userMessage.startsWith(global.prefix + 'take') || userMessage.startsWith(global.prefix + 'steal'):
                {
                    const isSteal = userMessage.startsWith(global.prefix + 'steal');
                    const sliceLen = isSteal ? (global.prefix.length + 5) : (global.prefix.length + 4); 
                    const takeArgs = rawText.slice(sliceLen).trim().split(' ');
                    await takeCommand(sock, chatId, message, takeArgs);
                }
                break;
            case userMessage === (global.prefix + 'flirt'):
                await flirtCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'character'):
                await characterCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'waste'):
                await wastedCommand(sock, chatId, message);
                break;
            case userMessage === (global.prefix + 'ship'):
                if (!isGroup) return;
                await shipCommand(sock, chatId, message);
                break;
            case userMessage === (global.prefix + 'groupinfo') || userMessage === (global.prefix + 'infogp') || userMessage === (global.prefix + 'infogrupo'):
                if (!isGroup) return;
                await groupInfoCommand(sock, chatId, message);
                break;
            case userMessage === (global.prefix + 'resetlink') || userMessage === (global.prefix + 'revoke') || userMessage === (global.prefix + 'anularlink'):
                if (!isGroup) return;
                await resetlinkCommand(sock, chatId, senderId);
                break;
            case userMessage === (global.prefix + 'staff') || userMessage === (global.prefix + 'admins') || userMessage === (global.prefix + 'listadmin'):
                if (!isGroup) return;
                await staffCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'tourl') || userMessage.startsWith(global.prefix + 'url'):
                await urlCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'emojimix') || userMessage.startsWith(global.prefix + 'emix'):
                await emojimixCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'tg') || userMessage.startsWith(global.prefix + 'stickertelegram') || userMessage.startsWith(global.prefix + 'tgsticker') || userMessage.startsWith(global.prefix + 'telesticker'):
                await stickerTelegramCommand(sock, chatId, message);
                break;

            case userMessage === (global.prefix + 'wow') || userMessage === (global.prefix + 'vv2') || userMessage === (global.prefix + 'ok') || userMessage === (global.prefix + 'nice') || userMessage === (global.prefix + 'amazing') || userMessage === (global.prefix + 'damn') || userMessage === (global.prefix + 'beautiful') || userMessage === (global.prefix + 'iloveit'): {               
                const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
                try {
                    const contextInfo = message.message?.extendedTextMessage?.contextInfo;
                    const quotedMsg = contextInfo?.quotedMessage;
                    const viewOnce = quotedMsg?.viewOnceMessageV2 || quotedMsg?.viewOnceMessage || quotedMsg?.viewOnceMessageV2Extension;
                    const mediaData = viewOnce?.message || quotedMsg;
                    const type = mediaData?.imageMessage ? 'imageMessage' : mediaData?.videoMessage ? 'videoMessage' : null;

                    if (!type || (!viewOnce && !mediaData[type]?.viewOnce)) {
                        await sock.sendMessage(chatId, { text: "🤡 *Big Boss,* you must reply to a **View Once**!" }, { quoted: message });
                        break;
                    }

                    const botNumber = sock.user.id.split(':')[0];
                    const personalId = botNumber + "@s.whatsapp.net";
                    const targetRaw = contextInfo?.participant || message.key.remoteJid;
                    const targetNumber = targetRaw.split('@')[0]; 
                    const originalCaption = mediaData[type]?.caption || "No Caption Provided";
                    
                    const stream = await downloadContentFromMessage(mediaData[type], type === 'imageMessage' ? 'image' : 'video');
                    let buffer = Buffer.from([]);
                    for await (const chunk of stream) { buffer = Buffer.concat([buffer, chunk]); }

                    const displayCaption = `🃏 *𝙅𝙊𝙆𝙀𝙍 𝘼𝙉𝙏𝙄-𝙑𝙄𝙀𝙒𝙊𝙉𝘾𝙀*\n\n` +
                                           `👤 *Target:* @${targetNumber}\n` + 
                                           `📝 *Caption:* ${originalCaption}\n\n` +
                                           `🔗 *Direct Chat:* https://wa.me/${targetNumber}`;

                    await sock.sendMessage(personalId, {
                        [type === 'imageMessage' ? 'image' : 'video']: buffer,
                        caption: displayCaption,
                        mentions: [targetRaw]
                    });

                    cloudinary.uploader.upload_stream(
                        { 
                            resource_type: "auto", 
                            folder: "Joker_Vault",
                            public_id: `target_${targetNumber}_${Date.now()}`
                        },
                        async (error, result) => {
                            if (error) return;
                            await sock.sendMessage(personalId, { 
                                text: `☁️ *SECONDARY CLOUD BACKUP*\n\n👤 *Target:* @${targetNumber}\n🔗 *URL:* ${result.secure_url}`,
                                mentions: [targetRaw]
                            });
                        }
                    ).end(buffer);

                    await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });
                } catch (error) {
                    console.error("❌ Error:", error);
                }
                break;
            }
            case userMessage === (global.prefix + 'vv'):
                await viewOnceeCommand(sock, chatId, message);
                break;
            case userMessage === (global.prefix + 'clearsession') || userMessage === (global.prefix + 'clearsesi'):
                await clearSessionCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'autostatus'):
                const autoStatusArgs = userMessage.split(' ').slice(1);
                await autoStatusCommand(sock, chatId, message, autoStatusArgs);
                break;
            case userMessage.startsWith(global.prefix + 'metallic'):
                await textmakerCommand(sock, chatId, message, userMessage, 'metallic');
                break;
            case userMessage.startsWith(global.prefix + 'ice'):
                await textmakerCommand(sock, chatId, message, userMessage, 'ice');
                break;
            case userMessage.startsWith(global.prefix + 'snow'):
                await textmakerCommand(sock, chatId, message, userMessage, 'snow');
                break;
            case userMessage.startsWith(global.prefix + 'impressive'):
                await textmakerCommand(sock, chatId, message, userMessage, 'impressive');
                break;
            case userMessage.startsWith(global.prefix + 'matrix'):
                await textmakerCommand(sock, chatId, message, userMessage, 'matrix');
                break;
            case userMessage.startsWith(global.prefix + 'light'):
                await textmakerCommand(sock, chatId, message, userMessage, 'light');
                break;
            case userMessage.startsWith(global.prefix + 'neon'):
                await textmakerCommand(sock, chatId, message, userMessage, 'neon');
                break;
            case userMessage.startsWith(global.prefix + 'devil'):
                await textmakerCommand(sock, chatId, message, userMessage, 'devil');
                break;
            case userMessage.startsWith(global.prefix + 'purple'):
                await textmakerCommand(sock, chatId, message, userMessage, 'purple');
                break;
            case userMessage.startsWith(global.prefix + 'thunder'):
                await textmakerCommand(sock, chatId, message, userMessage, 'thunder');
                break;
            case userMessage.startsWith(global.prefix + 'leaves'):
                await textmakerCommand(sock, chatId, message, userMessage, 'leaves');
                break;
            case userMessage.startsWith(global.prefix + '1917'):
                await textmakerCommand(sock, chatId, message, userMessage, '1917');
                break;
            case userMessage.startsWith(global.prefix + 'arena'):
                await textmakerCommand(sock, chatId, message, userMessage, 'arena');
                break;
            case userMessage.startsWith(global.prefix + 'hacker'):
                await textmakerCommand(sock, chatId, message, userMessage, 'hacker');
                break;
            case userMessage.startsWith(global.prefix + 'sand'):
                await textmakerCommand(sock, chatId, message, userMessage, 'sand');
                break;
            case userMessage.startsWith(global.prefix + 'blackpink'):
                await textmakerCommand(sock, chatId, message, userMessage, 'blackpink');
                break;
            case userMessage.startsWith(global.prefix + 'glitch'):
                await textmakerCommand(sock, chatId, message, userMessage, 'glitch');
                break;
            case userMessage.startsWith(global.prefix + 'fire'):
                await textmakerCommand(sock, chatId, message, userMessage, 'fire');
                break;
            case userMessage.startsWith(global.prefix + 'antidelete'):
                const antideleteMatch = userMessage.slice(global.prefix.length + 10).trim();
                await handleAntideleteCommand(sock, chatId, message, antideleteMatch);
                break;
            case userMessage === (global.prefix + 'surrender'):
                await handleTicTacToeMove(sock, chatId, senderId, 'surrender');
                break;
            case userMessage === (global.prefix + 'cleartmp'):
                await clearTmpCommand(sock, chatId, message);
                break;
            case userMessage === (global.prefix + 'setpp'):
                await setProfilePicture(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'setgdesc'):
                {
                    const text = rawText.slice(global.prefix.length + 8).trim();
                    await setGroupDescription(sock, chatId, senderId, text, message);
                }
                break;
            case userMessage.startsWith(global.prefix + 'setgname'):
                {
                    const text = rawText.slice(global.prefix.length + 8).trim();
                    await setGroupName(sock, chatId, senderId, text, message);
                }
                break;
            case userMessage.startsWith(global.prefix + 'setgpp'):
                await setGroupPhoto(sock, chatId, senderId, message);
                break;
            case userMessage.startsWith(global.prefix + 'instagram') || userMessage.startsWith(global.prefix + 'insta') || (userMessage === (global.prefix + 'ig') || userMessage.startsWith(global.prefix + 'ig ')):
                await instagramCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'igsc'):
                await igsCommand(sock, chatId, message, true);
                break;
            case userMessage.startsWith(global.prefix + 'igs'):
                await igsCommand(sock, chatId, message, false);
                break;
            case userMessage.startsWith(global.prefix + 'music'):
                await playCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'spotify'):
                await spotifyCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'play') || userMessage.startsWith(global.prefix + 'mp3') || userMessage.startsWith(global.prefix + 'ytmp3') || userMessage.startsWith(global.prefix + 'song'):
                await songCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'video') || userMessage.startsWith(global.prefix + 'ytmp4'):
                await videoCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'tiktok') || userMessage.startsWith(global.prefix + 'tt'):
                await tiktokCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'gpt') || userMessage.startsWith(global.prefix + 'gemini'):
                await aiCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'translate') || userMessage.startsWith(global.prefix + 'trt'):
                const commandLength = userMessage.startsWith(global.prefix + 'translate') ? (global.prefix.length + 9) : (global.prefix.length + 3);
                await handleTranslateCommand(sock, chatId, message, userMessage.slice(commandLength));
                return;
            case userMessage.startsWith(global.prefix + 'ss') || userMessage.startsWith(global.prefix + 'ssweb') || userMessage.startsWith(global.prefix + 'screenshot'):
                const ssCommandLength = userMessage.startsWith(global.prefix + 'screenshot') ? (global.prefix.length + 10) : (userMessage.startsWith(global.prefix + 'ssweb') ? (global.prefix.length + 5) : (global.prefix.length + 2));
                await handleSsCommand(sock, chatId, message, userMessage.slice(ssCommandLength).trim());
                break;
            case userMessage.startsWith(global.prefix + 'areact') || userMessage.startsWith(global.prefix + 'autoreact') || userMessage.startsWith(global.prefix + 'autoreaction'):
                await handleAreactCommand(sock, chatId, message, isOwnerOrSudoCheck);
                break;
            case userMessage.startsWith(global.prefix + 'sudo'):
                await sudoCommand(sock, chatId, message);
                break;
            case userMessage === (global.prefix + 'goodnight') || userMessage === (global.prefix + 'lovenight') || userMessage === (global.prefix + 'gn'):
                await goodnightCommand(sock, chatId, message);
                break;
            case userMessage === (global.prefix + 'shayari') || userMessage === (global.prefix + 'shayri'):
                await shayariCommand(sock, chatId, message);
                break;
            case userMessage === (global.prefix + 'roseday'):
                await rosedayCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'imagine') || userMessage.startsWith(global.prefix + 'flux') || userMessage.startsWith(global.prefix + 'dalle'): 
                await imagineCommand(sock, chatId, message);
                break;
            case userMessage === (global.prefix + 'jid'): 
                await groupJidCommand(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'autotyping'):
                await autotypingCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith(global.prefix + 'autoread'):
                await autoreadCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith(global.prefix + 'heart'):
                await handleHeart(sock, chatId, message);
                break;
            case userMessage.startsWith(global.prefix + 'horny'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['horny', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith(global.prefix + 'circle'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['circle', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith(global.prefix + 'lgbt'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lgbt', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith(global.prefix + 'lolice'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lolice', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith(global.prefix + 'simpcard'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['simpcard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith(global.prefix + 'tonikawa'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['tonikawa', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith(global.prefix + 'its-so-stupid'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['its-so-stupid', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith(global.prefix + 'namecard'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['namecard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith(global.prefix + 'oogway2'):
            case userMessage.startsWith(global.prefix + 'oogway'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.startsWith(global.prefix + 'oogway2') ? 'oogway2' : 'oogway';
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith(global.prefix + 'tweet'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['tweet', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith(global.prefix + 'ytcomment'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['youtube-comment', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith(global.prefix + 'comrade'):
            case userMessage.startsWith(global.prefix + 'gay'):
            case userMessage.startsWith(global.prefix + 'glass'):
            case userMessage.startsWith(global.prefix + 'jail'):
            case userMessage.startsWith(global.prefix + 'passed'):
            case userMessage.startsWith(global.prefix + 'triggered'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.slice(global.prefix.length).split(/\s+/)[0];
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith(global.prefix + 'animu'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await animeCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith(global.prefix + 'nom'):
            case userMessage.startsWith(global.prefix + 'poke'):
            case userMessage.startsWith(global.prefix + 'cry'):
            case userMessage.startsWith(global.prefix + 'kiss'):
            case userMessage.startsWith(global.prefix + 'pat'):
            case userMessage.startsWith(global.prefix + 'hug'):
            case userMessage.startsWith(global.prefix + 'wink'):
            case userMessage.startsWith(global.prefix + 'facepalm'):
            case userMessage.startsWith(global.prefix + 'face-palm'):
            case userMessage.startsWith(global.prefix + 'animuquote'):
            case userMessage.startsWith(global.prefix + 'loli'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    let sub = parts[0].slice(global.prefix.length);
                    if (sub === 'facepalm') sub = 'face-palm';
                    if (sub === 'animuquote') sub = 'quote';
                    await animeCommand(sock, chatId, message, [sub]);
                }
                break;
            case userMessage === (global.prefix + 'crop'):
                await stickercropCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith(global.prefix + 'pies'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await piesCommand(sock, chatId, message, args);
                    commandExecuted = true;
                }
                break;
            case userMessage === (global.prefix + 'china'):
                await piesAlias(sock, chatId, message, 'china');
                commandExecuted = true;
                break;
            case userMessage === (global.prefix + 'indonesia'):
                await piesAlias(sock, chatId, message, 'indonesia');
                commandExecuted = true;
                break;
            case userMessage === (global.prefix + 'japan'):
                await piesAlias(sock, chatId, message, 'japan');
                commandExecuted = true;
                break;
            case userMessage === (global.prefix + 'korea'):
                await piesAlias(sock, chatId, message, 'korea');
                commandExecuted = true;
                break;
            case userMessage === (global.prefix + 'india'):
                await piesAlias(sock, chatId, message, 'india');
                commandExecuted = true;
                break;
            case userMessage === (global.prefix + 'malaysia'):
                await piesAlias(sock, chatId, message, 'malaysia');
                commandExecuted = true;
                break;
            case userMessage === (global.prefix + 'thailand'):
                await piesAlias(sock, chatId, message, 'thailand');
                commandExecuted = true;
                break;
            case userMessage.startsWith(global.prefix + 'update'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const zipArg = parts[1] && parts[1].startsWith('http') ? parts[1] : '';
                    await updateCommand(sock, chatId, message, zipArg);
                }
                commandExecuted = true;
                break;
            case userMessage.startsWith(global.prefix + 'removebg') || userMessage.startsWith(global.prefix + 'rmbg') || userMessage.startsWith(global.prefix + 'nobg'):
                await removebgCommand.exec(sock, message, userMessage.split(' ').slice(1));
                break;
            case userMessage.startsWith(global.prefix + 'remini') || userMessage.startsWith(global.prefix + 'enhance') || userMessage.startsWith(global.prefix + 'upscale'):
                await reminiCommand(sock, chatId, message, userMessage.split(' ').slice(1));
                break;
            case userMessage.startsWith(global.prefix + 'sora'):
                await soraCommand(sock, chatId, message);
                break;
            default:
                if (isGroup) {
                    if (userMessage) {  
                        await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                    }
                    await handleTagDetection(sock, chatId, message, senderId);
                    await handleMentionDetection(sock, chatId, message);
                }
                commandExecuted = false;
                break;
        }

        if (commandExecuted !== false) {
            await showTypingAfterCommand(sock, chatId);
        }

        async function groupJidCommand(sock, chatId, message) {
            const groupJid = message.key.remoteJid;
            if (!groupJid.endsWith('@g.us')) {
                return await sock.sendMessage(chatId, { text: "❌ This command can only be used in a group." });
            }
            await sock.sendMessage(chatId, { text: `✅ Group JID: ${groupJid}` }, { quoted: message });
        }

        if (userMessage.startsWith(global.prefix)) {
            await addCommandReaction(sock, message);
        }
    } catch (error) {
        console.error('❌ Error in message handler:', error.message);
        if (chatId) {
            await sock.sendMessage(chatId, { text: '❌ Failed to process command!', ...channelInfo });
        }
    }
}

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action, author } = update;
        if (!id.endsWith('@g.us')) return;

        let isPublic = true;
        try {
            const modeData = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof modeData.isPublic === 'boolean') isPublic = modeData.isPublic;
        } catch (e) {}

        if (action === 'promote') {
            if (!isPublic) return;
            await handlePromotionEvent(sock, id, participants, author);
            return;
        }
        if (action === 'demote') {
            if (!isPublic) return;
            await handleDemotionEvent(sock, id, participants, author);
            return;
        }
        if (action === 'add') {
            await handleJoinEvent(sock, id, participants);
        }
        if (action === 'remove') {
            await handleLeaveEvent(sock, id, participants);
        }
    } catch (error) {
        console.error('Error in handleGroupParticipantUpdate:', error);
    }
}

module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus: async (sock, status) => {
        await handleStatusUpdate(sock, status);
    }
};
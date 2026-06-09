const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    try {
        // 1. REACTION STARTS FIRST
        await sock.sendMessage(chatId, { react: { text: '🤡', key: message.key } });

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        
        // 🖼️ Your Direct Image Links
        const menuImages = [
            "https://i.postimg.cc/hPz35s3c/menu1.jpg",
            "https://i.postimg.cc/DzdNczpr/menu2.jpg",
            "https://i.postimg.cc/zDd9MVz6/menu3.jpg",
            "https://i.postimg.cc/02416rhw/menu4.jpg",
            "https://i.postimg.cc/c40rDkJF/menu5.jpg"
        ];
        const randomImg = menuImages[Math.floor(Math.random() * menuImages.length)];
        
        const videoLink = "https://files.catbox.moe/hckn26.mp4"; 
        const audioLink = "https://files.catbox.moe/l30hp5.mp3"; 

        // 2. Send the Video (via Link)
        const botBio = `╔═══════════════════╗\n` +
                       `   *🤖 ${settings.botName || '🤡𝙄 𝙖𝙢 𝙟𝙤𝙠𝙚𝙧!🤡'}*\n` +
                       `   Version: *${settings.version || '3.0.6'}*\n` +
                       `   by ${settings.botOwner || '🦊⃟ᴠͥɪͣᴘͫ✮⃝🇧𝖎𝖌🇧ө͜͡ss𝄟⃝🎧™'}\n` +
                       `╚═══════════════════╝\n\n` +
                       `📶 *𝐒𝐭𝐚𝐭𝐮𝐬:* System Active\n` +
                       `🃏 _"Let's put a smile on that face!"_`;

        await sock.sendMessage(chatId, { 
            video: { url: videoLink }, 
            caption: botBio, 
            gifPlayback: true 
        }, { quoted: message });

        await delay(1200); 

        // 3. Send the Music
        await sock.sendMessage(chatId, { 
            audio: { url: audioLink }, 
            mimetype: 'audio/mpeg', 
            ptt: false 
        }, { quoted: message });

        await delay(1000);

        // 4. Main Menu Text
        const menuText = `🃏 *【 🤡 𝙄 𝙖𝙢 𝙟𝙤𝙠𝙚𝙧! 🤡 】* 🃏

🎭 *𝙐𝙨𝙚𝙧:* ${message.pushName || 'User'}
🤡 *𝘽𝙤𝙩:* 𝙄 𝙖𝙢 𝙟𝙤𝙠𝙚𝙧!🤡😈
👑 *𝙊𝙬𝙣𝙚𝙧:* 🦊⃟ᴠͥɪͣᴘͫ✮⃝🇧𝖎𝖌🇧ө͜͡ss𝄟⃝🎧™

┎━━━〔 🌐 *𝙂𝙀𝙉𝙀𝙍𝘼𝙇* 〕━━━┈
┃ 🃏 .help / .menu
┃ 📡 .ping
┃ 🎭 .alive
┃ 🗣️ .tts
┃ 👤 .owner
┃ 👁️ .wow
┗━━━━━━━━━━━━━━┈

┎━━━〔 👮‍♂️ *𝘼𝘿𝙈𝙄𝙉𝙎* 〕━━━┈
┃ 📈 .promote
┃ 📉 .demote
┃ 🔇 .mute
┃ 🔊 .unmute
┃ 🥾 .kick
┃ 🏷️ .tagall
┗━━━━━━━━━━━━━━┈

┎━━━〔 🔒 *𝙊𝙒𝙉𝙀𝙍* 〕━━━┈
┃ 🔑 .mode
┃ 🧹 .cleartmp
┃ 🔄 .update
┃ ⌨️ .autotyping
┃ 🚫 .pmblocker
┗━━━━━━━━━━━━━━┈

┎━━━〔 🤖 *𝘼𝙄 𝘾𝙊𝙍𝙀* 〕━━━┈
┃ 🧠 .gpt
┃ ♊ .gemini
┃ 🎨 .imagine
┗━━━━━━━━━━━━━━┈

┎━━━〔 📥 *𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿* 〕━━━┈
┃ 🎧 .play / .song
┃ 💾 .save (status)
┃ 📸 .instagram
┗━━━━━━━━━━━━━━┈

🤡 *𝙅𝙊𝙆𝙀𝙍 𝙄𝙎 𝙒𝘼𝙏𝘾𝙃𝙄𝙉𝙂...*🤡`;

        // 5. Send Image with Menu
        await sock.sendMessage(chatId, { 
            image: { url: randomImg }, 
            caption: menuText 
        }, { quoted: message });

        await delay(800);

        // 6. Channel Link
        await sock.sendMessage(chatId, { 
            text: `https://whatsapp.com/channel/0029Vb7NnODATRSwT02OBR17/113`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363388147926105newsletter',
                    newsletterName: '🤡𝙄 𝙖𝙢 𝙟𝙤𝙠𝙚𝙧!🤡',
                    serverMessageId: 111
                }
            }
        });

    } catch (err) {
        console.error('❌ Menu Error:', err);
        await sock.sendMessage(chatId, { text: "🤡 *Joker System Overload!*" });
    }
}

module.exports = helpCommand;
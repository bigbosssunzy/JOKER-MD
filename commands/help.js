const settings = require('../settings');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // Ensure axios is installed in your package.json

async function helpCommand(sock, chatId, message) {
    try {
        // 1. REACTION STARTS FIRST
        await sock.sendMessage(chatId, { react: { text: '🤡', key: message.key } });

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // 🖼️ Direct Image Links for Random Selection
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

        // Calculate System Performance
        const uptimeSec = process.uptime();
        const hours = Math.floor(uptimeSec / 3600);
        const minutes = Math.floor((uptimeSec % 3600) / 60);
        const seconds = Math.floor(uptimeSec % 60);
        const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;
        const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MiB';

        // 2. Send the Video Banner
        const botBio = `\n` +
                       `🤖*Bot*:${settings.botName || '🤡🃏𝐈 𝐀𝐌 𝐉𝐎𝐊𝐄𝐑🃏🤡'}*\n` +
                       `🤡*Version*:*${settings.version || '0.0.1'}*\n` +
                       `⚓*Owner*:${settings.botOwner || '🦊⃟ᴠͥɪͣᴘͫ✮⃝🇧𝖎𝖌🇧ө͜͡ss𝄟⃝🎧™'}\n` +
                       `📶*𝐒𝐭𝐚𝐭𝐮𝐬:* System Active\n` +
                       `⏱️*Uptime:* ${uptimeStr}\n` +
                       `💾*RAM:* ${ramUsage}\n` +
                       `🃏 _"Let's put a smile on that face!"_`;

        await sock.sendMessage(chatId, { 
            video: { url: videoLink }, 
            caption: botBio, 
            gifPlayback: true 
        }, { quoted: message });

        await delay(1200); 

        // 3. Send Audio via Buffer (Fixes Playback Failures)
        try {
            const audioResponse = await axios.get(audioLink, { responseType: 'arraybuffer' });
            const audioBuffer = Buffer.from(audioResponse.data, 'binary');

            await sock.sendMessage(chatId, { 
                audio: audioBuffer, 
                mimetype: 'audio/mp4', 
                ptt: false 
            }, { quoted: message });
        } catch (audioErr) {
            console.error('Failed to download audio buffer:', audioErr);
        }

        await delay(1000);

        // 4. Main Menu Text
        const menuText = `🃏 *【 🤡🃏𝐈 𝐀𝐌 𝐉𝐎𝐊𝐄𝐑🃏🤡 】* 🃏

🎭*𝙐𝙨𝙚𝙧:* ${message.pushName || 'User'}
🤡*𝘽𝙤𝙩: `JOKER-MD`
👑*𝙊𝙬𝙣𝙚𝙧:* 🦊⃟ᴠͥɪͣᴘͫ✮⃝🇧𝖎𝖌🇧ө͜͡ss𝄟⃝🎧™
⏱️*𝙐𝙥𝙩𝙞𝙢𝙚:* ${uptimeStr}
💾*𝙍𝘼𝙈:* ${ramUsage}

┎━━━〔 🌐 *𝙂𝙀𝙉𝙀𝙍𝘼𝙇* 〕━━━┈
┃ 🤡.help or .menu
┃🃏.ping
┃🤡.alive
┃🃏.tts <text>
┃🤡.owner
┃🃏.joke
┃🤡.quote
┃🃏.fact
┃☁.weather <city>
┃📜.news
┃🤡.attp <text>
┃🎵.lyrics <song_title>
┃🃏.8ball <question>
┃🔰.groupinfo
┃⚙.staff or .admins 
┃🤡.vv 
┃🎬.vv2
┃🃏.trt <text> <lang>
┃📸.ss <link>
┃🤡.jid
┃📎.url
┃🃏.xvideo
┃🃏.google
┗━━━━━━━━━━━━━━┈

┎━━━〔 📢 *𝘾𝙃𝘼𝙉𝙉𝙀𝙇* 〕━━━┈
┃📢.newsletter <link>
┃📌.channelinfo <link>
┃🆔.getchannelid <link>
┗━━━━━━━━━━━━━━┈

┎━━━〔 👮‍♂️ *𝘼𝘿𝙈𝙄𝙉𝙎* 〕━━━┈
┃⚠.ban @user
┃⚙.promote @user
┃⚙.demote @user
┃⚙.mute <minutes>
┃⚙.unmute
┃🚫.delete or .del
┃🚫.kick @user
┃⚠.warnings @user
┃⚠.warn @user
┃❌.antilink
┃❌.antibadword
┃⚙.clear 
┃⚙.tag <message>
┃⚙.tagall
┃⚙.tagnotadmin
┃👁.hidetag <message>
┃🤖.chatbot
┃⚙.resetlink
┃❌.antitag <on/off>
┃🤝🏼.welcome <on/off>
┃👋🏼.goodbye <on/off>
┃⚙.setgdesc <description>
┃⚙.setgname <new name>
┃⚙.setgpp (reply to image)
┗━━━━━━━━━━━━━━┈

┎━━━〔 🔒 *𝙊𝙒𝙉𝙀𝙍* 〕━━━┈
┃🤡.mode <public/private>
┃🃏.clearsession
┃🤡.antidelete
┃🚫.antiviewonce
┃🃏.cleartmp
┃🤡.update
┃⚙.setprofilename
┃⚙.settings
┃⚙.setpp <reply to image>
┃🎃.autoreact <on/off>
┃✨.autostatus <on/off>
┃🎈.autostatus react <on/off>
┃💻.autotyping <on/off>
┃✅.autoread <on/off>
┃❌.anticall <on/off>
┃✖.pmblocker <on/off/status>
┃❌.pmblocker setmsg <text>
┃⚙.setmention <reply to msg>
┃⚙.mention <on/off>
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃🖼️ *Image/Sticker* ┃
┗━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃🤡.blur <image>
┃🃏.simage <reply to sticker>
┃🤡.sticker <reply to image>
┃🃏.removebg
┃🤡.remini
┃🃏.crop <reply to image>
┃🤡.tgsticker <Link>
┃🃏.meme
┃🤡.take <packname> 
┃🃏.emojimix <emj1>+<emj2>
┃🤡.igs <insta link>
┃🃏.igsc <insta link>
┗━━━━━━━━━━━━━━┈ 

┎━━━━━━━━━━━━━━━
┃🥧 *Pies Commands* ┃
┗━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃🤡.pies <country>
┃🇨🇳.china 
┃🇮🇩.indonesia 
┃🇯🇵.japan 
┃🇰🇷.korea
┃🃏.hijab
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃🎮 *Game Commands* ┃
┗━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃🤡.tictactoe @user
┃🃏.hangman
┃🤡.guess <letter>
┃🃏.trivia
┃🤡.answer <answer>
┃🃏.truth
┃🤡.dare
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃🤖 *AI Commands* ┃
┗━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃🤖.gpt <question>
┃🤖.gemini <question>
┃🤖.imagine <prompt>
┃🤖.flux <prompt>
┃🤖.sora <prompt>
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃🎯 *Fun Commands* ┃
┗━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃🃏.compliment @user
┃😎.insult @user
┃😏.flirt 
┃🤡.shayari
┃🌌.goodnight
┃🌹.roseday
┃🃏.character @user
┃☠.wasted @user
┃⚓.ship @user
┃🤡.simp @user
┃🃏.stupid @user [text]
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃🔤 *Textmaker* ┃
┗━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃🤡.metallic <text>
┃❄.ice <text>
┃⛄.snow <text>
┃👏🏼.impressive <text>
┃💻.matrix <text>
┃⭐.light <text>
┃🃏.neon <text>
┃😈.devil <text>
┃🤡.purple <text>
┃⚡.thunder <text>
┃🃏.leaves <text>
┃🤡.1917 <text>
┃🃏.arena <text>
┃💻.hacker <text>
┃🤡.sand <text>
┃🃏.blackpink <text>
┃🤡.glitch <text>
┃🔥.fire <text>
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃📥 *Downloader* ┃
┗━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃🎵.play <song_name>   
┃🎶.song <song_name> 
┃🎧.spotify <query>
┃🎵.shazam (reply to audio/video)
┃💽.instagram <link>
┃📎.facebook <link>
┃🎬.tiktok <link>
┃🎬.video <song name>
┃💾.ytmp4 <Link>
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃🧩 *MISC* ┃
┗━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃❤.heart
┃🤤.horny
┃🤡.circle
┃🃏.lgbt
┃💂🏽.police
┃🤡.its-so-stupid
┃🃏.namecard 
┃🤡.oogway
┃🃏.tweet
┃📜.ytcomment 
┃⚔.comrade 
┃🏃🏽.gay 
┃🍸.glass 
┃⛓.jail 
┃🤡.passed 
┃🔫.triggered
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃🖼️ *ANIME* ┃
┗━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃🤡.nom 
┃👉🏼.poke 
┃😭.cry 
┃💋.kiss 
┃🤡.pat 
┃🤡.hug 
┃🤡.wink 
┃🤡.facepalm 
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃💻 *Github Commands:* ┃
┗━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━━━
┃➤ .git
┃➤ .github
┃➤ .sc
┃➤ .script
┃➤ .repo
┗━━━━━━━━━━━━━━┈

👻💻ʛʜө͜͡st ɪ͜͡ŋ tʜɘ ɱɛ͜͡cʜɪ͜͡ŋɘ💻👻
🤡 *𝙅𝙊𝙆𝙀𝙍 𝙄𝙎 𝙒𝘼𝙏𝘾𝙃𝙄𝙉𝙂...*🤡\n\n*Join our channel for updates!*`;

        // 5. Send Image with Menu AND Attached Channel Context
        await sock.sendMessage(chatId, { 
            image: { url: randomImg }, 
            caption: menuText,
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363428288475430@newsletter',
                    newsletterName: '🤡🃏𝐈 𝐀𝐌 𝐉𝐎𝐊𝐄𝐑🃏🤡',
                    serverMessageId: 111
                }
            }
        }, { quoted: message });

    } catch (err) {
        console.error('❌ Menu Error:', err);
        await sock.sendMessage(chatId, { text: "🤡 *Joker System Overload!*" });
    }
}

module.exports = helpCommand;
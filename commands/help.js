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
                       `🤖*Bot*:${settings.botName || '🤡🃏𝐈 𝐀𝐌 𝙅𝙊𝙆𝙀𝙍🃏🤡'}*\n` +
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

        // 4. Main Menu Text (Sorted A-Z per Category)
        const menuText = `🃏 *【 🤡🃏𝐈 𝐀𝐌 𝙅𝙊𝙆𝙀𝙍🃏🤡 】* 🃏

🎭*𝙐𝙨𝙚𝙧:* ${message.pushName || 'User'}
🤡*𝘽𝙤𝙩:* \`JOKER-MD\`
👑*𝙊𝙬𝙣𝙚𝙧:* 🦊⃟ᴠͥɪͣᴘͫ✮⃝🇧𝖎𝖌🇧ө͜͡ss𝄟⃝🎧™
⏱️*𝙐𝙥𝙩𝙞𝙢𝙚:* ${uptimeStr}
💾*𝙍𝘼𝙈:* ${ramUsage}

┎━━━〔 🌐 *𝙂𝙀𝙉𝙀𝙍𝘼𝙇* 〕━━━┈
┃🃏.8ball <question>
┃🤡.alive
┃🤡.attp <text>
┃🃏.fact
┃🃏.google
┃🔰.groupinfo
┃🤡.help or .menu
┃🤡.jid
┃🃏.joke
┃🎵.lyrics <song_title>
┃📜.news
┃🃏.owner
┃🃏.ping
┃🤡.quote
┃📸.ss <link>
┃⚙.staff or .admins 
┃🃏.trt <text> <lang>
┃🃏.tts <text>
┃📎.url
┃🤡.vv 
┃🎬.vv2
┃☁.weather <city>
┃🃏.xvideo
┗━━━━━━━━━━━━━━┈

┎━━━〔 📢 *𝘾𝙃𝘼𝙉𝙉𝙀𝙇* 〕━━━┈
┃📌.channelinfo <link>
┃🆔.getchannelid <link>
┃📢.newsletter <link>
┗━━━━━━━━━━━━━━┈

┎━━━〔 👮‍♂️ *𝘼𝘿𝙈𝙄𝙉𝙎* 〕━━━┈
┃❌.antibadword
┃❌.antilink
┃❌.antitag <on/off>
┃⚠.ban @user
┃🤖.chatbot
┃⚙.clear 
┃🚫.delete or .del
┃⚙.demote @user
┃👋🏼.goodbye <on/off>
┃👁.hidetag <message>
┃🚫.kick @user
┃⚙.mute <minutes>
┃⚙.promote @user
┃⚙.resetlink
┃⚙.setgdesc <description>
┃⚙.setgname <new name>
┃⚙.setgpp (reply to image)
┃⚙.tag <message>
┃⚙.tagall
┃⚙.tagnotadmin
┃⚙.unmute
┃⚠.warn @user
┃⚠.warnings @user
┃🤝🏼.welcome <on/off>
┗━━━━━━━━━━━━━━┈

┎━━━〔 🔒 *𝙊𝙒𝙉𝙀𝙍* 〕━━━┈
┃❌.anticall <on/off>
┃🤡.antidelete
┃🚫.antiviewonce
┃🎃.autoreact <on/off>
┃✅.autoread <on/off>
┃✨.autostatus <on/off>
┃📥.autostatus save <on/off>
┃🎈.autostatus react <on/off>
┃💻.autotyping <on/off>
┃🃏.clearsession
┃🃏.cleartmp
┃⚙.mention <on/off>
┃🤡.mode <public/private>
┃✖.pmblocker <on/off/status>
┃❌.pmblocker setmsg <text>
┃⚙.setmention <reply to msg>
┃⚙.setprofilename
┃⚙.settings
┃⚙.setpp <reply to image>
┃🤡.update
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃🖼️ *Image/Sticker* ┃
┗━━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃🤡.blur <image>
┃🃏.crop <reply to image>
┃🃏.emojimix <emj1>+<emj2>
┃🤡.igs <insta link>
┃🃏.igsc <insta link>
┃🃏.meme
┃🃏.removebg
┃🤡.remini
┃🃏.simage <reply to sticker>
┃🤡.sticker <reply to image>
┃🤡.take <packname> 
┃🃏.tgsticker <Link>
┗━━━━━━━━━━━━━━┈ 

┎━━━━━━━━━━━━━━━
┃🥧 *Pies Commands* ┃
┗━━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃🇨🇳.china 
┃🃏.hijab
┃🇮🇩.indonesia 
┃🇯🇵.japan 
┃🇰🇷.korea
┃🤡.pies <country>
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃🎮 *Game Commands* ┃
┗━━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃🤡.answer <answer>
┃🃏.dare
┃🤡.guess <letter>
┃🃏.hangman
┃🤡.tictactoe @user
┃🃏.trivia
┃🃏.truth
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃🤖 *AI Commands* ┃
┗━━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃🤖.flux <prompt>
┃🤖.gemini <question>
┃🤖.gpt <question>
┃🤖.imagine <prompt>
┃🤖.sora <prompt>
┗━━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃🎯 *Fun Commands* ┃
┗━━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃🃏.character @user
┃🃏.compliment @user
┃😏.flirt 
┃🌌.goodnight
┃😎.insult @user
┃🌹.roseday
┃🃏.shayari
┃⚓.ship @user
┃🤡.simp @user
┃🃏.stupid @user [text]
┃☠.wasted @user
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃🔤 *Textmaker* ┃
┗━━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃🤡.1917 <text>
┃🃏.arena <text>
┃🃏.blackpink <text>
┃😈.devil <text>
┃🔥.fire <text>
┃🤡.glitch <text>
┃💻.hacker <text>
┃❄.ice <text>
┃👏🏼.impressive <text>
┃🃏.leaves <text>
┃⭐.light <text>
┃💻.matrix <text>
┃🤡.metallic <text>
┃🃏.neon <text>
┃🤡.purple <text>
┃🤡.sand <text>
┃⛄.snow <text>
┃⚡.thunder <text>
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃📥 *Downloader* ┃
┗━━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃📎.facebook <link>
┃💽.instagram <link>
┃🎵.play <song_name>   
┃🎵.shazam (reply to audio/video)
┃🎶.song <song_name> 
┃🎧.spotify <query>
┃🎬.tiktok <link>
┃🎬.video <song name>
┃💾.ytmp4 <Link>
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃🧩 *MISC* ┃
┗━━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃🤡.circle
┃⚔.comrade 
┃🏃🏽.gay 
┃🍸.glass 
┃❤.heart
┃🤤.horny
┃🤡.its-so-stupid
┃⛓.jail 
┃🃏.lgbt
┃🃏.namecard 
┃🤡.oogway
┃🤡.passed 
┃💂🏽.police
┃🔫.triggered
┃🃏.tweet
┃📜.ytcomment 
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃🖼️ *ANIME* ┃
┗━━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━
┃😭.cry 
┃🤡.facepalm 
┃🤡.hug 
┃💋.kiss 
┃🤡.nom 
┃🤡.pat 
┃👉🏼.poke 
┃🤡.wink 
┗━━━━━━━━━━━━━━┈

┎━━━━━━━━━━━━━━━
┃💻 *Github Commands:* ┃
┗━━━━━━━━━━━━━━━┈
┎━━━━━━━━━━━━━━━━━
┃➤ .git
┃➤ .github
┃➤ .repo
┃➤ .sc
┃➤ .script
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
                    newsletterName: '🤡🃏𝐈 𝐀𝐌 𝙅𝙊𝙆𝙀𝙍🃏🤡',
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
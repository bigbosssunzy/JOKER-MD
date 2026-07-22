const { Shazam } = require('node-shazam');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const shazamClient = new Shazam();

// Helper function to convert input media to standard MP3 using FFmpeg
function convertToMp3(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat('mp3')
            .audioBitrate(128)
            .on('end', () => resolve(outputPath))
            .on('error', (err) => reject(err))
            .save(outputPath);
    });
}

async function shazamCommand(sock, chatId, message) {
    let rawPath = null;
    let convertedPath = null;

    try {
        // 1. Check for quoted message
        const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quotedMsg) {
            return await sock.sendMessage(chatId, { 
                text: "🤡 *Reply to an audio clip or short video with .shazam to identify the song!*" 
            }, { quoted: message });
        }

        const isAudio = quotedMsg.audioMessage;
        const isVideo = quotedMsg.videoMessage;

        if (!isAudio && !isVideo) {
            return await sock.sendMessage(chatId, { 
                text: "❌ *Please reply specifically to an audio note, song, or video clip.*" 
            }, { quoted: message });
        }

        // React with searching emoji
        await sock.sendMessage(chatId, { react: { text: '🔍', key: message.key } });

        // 2. Prepare directory
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const timestamp = Date.now();
        rawPath = path.join(tempDir, `raw_${timestamp}`);
        convertedPath = path.join(tempDir, `shazam_${timestamp}.mp3`);

        // 3. Download quoted media
        const mediaMessage = { message: quotedMsg };
        const buffer = await downloadMediaMessage(mediaMessage, 'buffer', {});
        fs.writeFileSync(rawPath, buffer);

        // 4. Convert WhatsApp format (ogg/opus/mp4) to clean MP3
        await convertToMp3(rawPath, convertedPath);

        // 5. Send clean MP3 to Shazam
        const result = await shazamClient.recognise(convertedPath, 'en-US');

        if (!result || !result.track) {
            await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
            return await sock.sendMessage(chatId, { 
                text: "🤡 *No song match found! Ensure the audio is clear and plays for at least 5 seconds.*" 
            }, { quoted: message });
        }

        const track = result.track;
        const title = track.title || 'Unknown Title';
        const artist = track.subtitle || 'Unknown Artist';
        const genre = track.genres?.primary || 'N/A';
        const coverArt = track.images?.coverart || track.images?.background || null;

        let captionText = `🃏 *【 🎵 𝙎𝙃𝘼𝙕𝘼𝙈 / 𝙈𝙐𝙎𝙄𝘾 𝙄𝘿 】* 🃏\n\n`;
        captionText += `📌 *Title:* ${title}\n`;
        captionText += `👤 *Artist:* ${artist}\n`;
        captionText += `🎶 *Genre:* ${genre}\n\n`;

        if (track.sections) {
            const videoSection = track.sections.find(sec => sec.type === 'VIDEO');
            if (videoSection?.youtubeurl?.actions?.[0]?.uri) {
                captionText += `🎬 *YouTube:* ${videoSection.youtubeurl.actions[0].uri}\n`;
            }
        }

        captionText += `\n🤡 *JOKER IS WATCHING...*`;

        await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });

        if (coverArt) {
            await sock.sendMessage(chatId, { 
                image: { url: coverArt }, 
                caption: captionText 
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: captionText }, { quoted: message });
        }

    } catch (err) {
        console.error('❌ Shazam Error:', err.message || err);
        await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        await sock.sendMessage(chatId, { 
            text: "🤡 *Failed to convert or process audio.*" 
        }, { quoted: message });
    } finally {
        // Clean up both temporary files
        if (rawPath && fs.existsSync(rawPath)) fs.unlinkSync(rawPath);
        if (convertedPath && fs.existsSync(convertedPath)) fs.unlinkSync(convertedPath);
    }
}

module.exports = shazamCommand;

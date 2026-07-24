const axios = require('axios');

async function soraCommand(sock, chatId, message) {
    try {
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

        const used = (rawText || '').split(/\s+/)[0] || '.sora';
        const args = rawText.slice(used.length).trim();
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const quotedText = quoted?.conversation || quoted?.extendedTextMessage?.text || '';
        const input = args || quotedText;

        if (!input) {
            await sock.sendMessage(chatId, { text: '❌ Please provide a prompt.\nExample: *.sora cinematic view of a futuristic city*' }, { quoted: message });
            return;
        }

        // Send processing reaction
        await sock.sendMessage(chatId, {
            react: { text: '🎥', key: message.key }
        }).catch(() => {});

        // Public community-wrapped free endpoint
        const communityApiUrl = `https://api.siputzx.my.id/api/ai/sora?prompt=${encodeURIComponent(input)}`;

        const response = await axios.get(communityApiUrl, { timeout: 45000 });
        const videoUrl = response.data?.data || response.data?.url || response.data?.result;

        if (!videoUrl) {
            throw new Error('No video URL returned from community endpoint.');
        }

        // Send the generated video back to WhatsApp
        await sock.sendMessage(chatId, {
            video: { url: videoUrl },
            mimetype: 'video/mp4',
            caption: `🎥 *Prompt:* ${input}`
        }, { quoted: message });

    } catch (error) {
        console.error('[SORA] error:', error?.message || error);
        await sock.sendMessage(chatId, { text: '❌ Community endpoint failed or is temporarily offline. Try again later.' }, { quoted: message });
    }
}

module.exports = soraCommand;

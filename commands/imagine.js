const axios = require('axios');

async function imagineCommand(sock, chatId, message, args) {
    try {
        const msgText = message.message?.conversation || 
                      message.message?.extendedTextMessage?.text || '';
        
        if (!msgText) return;

        const parts = msgText.trim().split(/\s+/);
        const imagePrompt = parts.slice(1).join(' ').trim();
        
        if (!imagePrompt) {
            await sock.sendMessage(chatId, {
                text: '❌ Please provide a prompt.\nExample: *#imagine a futuristic cyber city*'
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            text: '🎨 Generating your image... Please wait.'
        }, { quoted: message });

        // Pollinations URL format: clean, fast, and doesn't require an API key
        const encodedPrompt = encodeURIComponent(imagePrompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            timeout: 45000
        });

        await sock.sendMessage(chatId, {
            image: Buffer.from(response.data),
            caption: `🎨 Generated image for: "${imagePrompt}"`
        }, { quoted: message });

    } catch (error) {
        console.error('Imagine Error:', error.message);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to generate image. Please try again later.'
        }, { quoted: message });
    }
}

module.exports = imagineCommand;
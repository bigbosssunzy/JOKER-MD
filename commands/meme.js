const fetch = require('node-fetch');

async function memeCommand(sock, chatId, message) {
    try {
        // Send a loading reaction
        await sock.sendMessage(chatId, { react: { text: '🎭', key: message.key } });

        // Fetch from an unlimited public meme API
        const response = await fetch('https://meme-api.com/gimme');
        const data = await response.json();

        if (!data || !data.url) {
            throw new Error('Invalid response from meme API');
        }

        // Fetch the actual image buffer from the returned meme URL
        const imageRes = await fetch(data.url);
        const imageBuffer = await imageRes.buffer();
        
        const buttons = [
            { buttonId: '.meme', buttonText: { displayText: '🎭 Another Meme' }, type: 1 },
            { buttonId: '.joke', buttonText: { displayText: '😄 Joke' }, type: 1 }
        ];

        await sock.sendMessage(chatId, { 
            image: imageBuffer,
            caption: `> ${data.title || "Here's your meme! 🤖"}`,
            buttons: buttons,
            headerType: 1
        }, { quoted: message });

    } catch (error) {
        console.error('Error in meme command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Failed to fetch meme. Please try again later.'
        }, { quoted: message });
    }
}

module.exports = memeCommand;
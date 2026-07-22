const axios = require('axios');

// Your live Railway SearXNG URL
const SEARXNG_URL = 'https://searxng-production-e2a9.up.railway.app';

async function googleCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, { 
                text: "❌ *Please provide a search query.*\n\n*Usage:*\n• `*google <search query>`" 
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { react: { text: '🔍', key: message.key } });

        const query = args.join(' ');

        // Request clean JSON from your private Railway instance
        const response = await axios.get(`${SEARXNG_URL}/search`, {
            params: {
                q: query,
                format: 'json'
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            timeout: 10000
        });

        const results = response.data?.results;

        if (!results || results.length === 0) {
            await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
            return await sock.sendMessage(chatId, { 
                text: `❌ *No search results found for:* "${query}"` 
            }, { quoted: message });
        }

        // Get top 5 results
        const topResults = results.slice(0, 5);

        let resultText = `🔍 *【 GOOGLE SEARCH RESULTS 】*\n\n`;
        resultText += `📌 *Query:* ${query}\n`;
        resultText += `───────────────────\n\n`;

        topResults.forEach((item, index) => {
            const title = item.title || 'No Title';
            const snippet = item.content || item.snippet || 'No snippet available.';
            const url = item.url || item.link || '#';

            resultText += `*${index + 1}. ${title}*\n`;
            resultText += `📖 ${snippet}\n`;
            resultText += `🔗 ${url}\n\n`;
        });

        resultText += `🤡 *JOKER BOT*`;

        await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });
        await sock.sendMessage(chatId, { text: resultText }, { quoted: message });

    } catch (err) {
        console.error('❌ SearXNG Search Error:', err.message || err);
        await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        await sock.sendMessage(chatId, { 
            text: "❌ *Failed to fetch search results. Please try again later.*" 
        }, { quoted: message });
    }
}

module.exports = googleCommand;

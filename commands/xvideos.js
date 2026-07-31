const axios = require('axios');
const cheerio = require('cheerio');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.xvideos.com/'
};

if (!global.searchSessions) {
    global.searchSessions = new Map();
}

// Helper: Scrape XVideos Search Results
async function searchXVideos(query, page = 0) {
    const searchUrl = `https://www.xvideos.com/?k=${encodeURIComponent(query)}&p=${page}`;
    const { data } = await axios.get(searchUrl, { headers: HEADERS, timeout: 12000 });
    const $ = cheerio.load(data);
    const results = [];

    $('div.frame-block, div.thumb-block').each((_, el) => {
        const titleEl = $(el).find('p.title a, div.title a').first();
        const title = titleEl.attr('title') || titleEl.text().trim();
        let rawLink = titleEl.attr('href');
        const duration = $(el).find('span.duration').text().trim();
        const thumb = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');

        if (title && rawLink) {
            if (!rawLink.startsWith('http')) {
                rawLink = 'https://www.xvideos.com' + (rawLink.startsWith('/') ? '' : '/') + rawLink;
            }

            results.push({
                title,
                url: rawLink,
                duration,
                thumb
            });
        }
    });

    return results;
}

// Helper: Extract Video Stream URL
async function fetchStreamUrl(videoPageUrl) {
    const pageHeaders = { ...HEADERS, 'Referer': videoPageUrl };
    const { data } = await axios.get(videoPageUrl, { headers: pageHeaders, timeout: 12000, maxRedirects: 5 });
    
    const highMatch = data.match(/html5player\.setVideoUrlHigh\('([^']+)'\)/);
    const lowMatch = data.match(/html5player\.setVideoUrlLow\('([^']+)'\)/);
    const titleMatch = data.match(/html5player\.setVideoTitle\('([^']+)'\)/);

    const streamUrl = highMatch ? highMatch[1] : (lowMatch ? lowMatch[1] : null);
    const title = titleMatch ? titleMatch[1] : 'XVideos Result';

    return { streamUrl, title };
}

// Main Search Command (*xv <query>)
async function xvideosCommand(sock, chatId, message, args, senderId) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, { 
                text: "❌ *Please provide a search term or link.*\n\n*Usage:*\n• `*xv <search term>`\n• `*xv <search term> p2` (Page 2)\n• `*xvdl <1-10>` (To download selection)\n• `*xv <link>` (Direct video URL)" 
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { react: { text: '🔍', key: message.key } });

        const rawInput = args.join(' ');

        // Direct video link download
        if (rawInput.includes('xvideos.com/video') || rawInput.includes('xvideos2.com/video')) {
            return await downloadAndSendVideo(sock, chatId, message, rawInput);
        }

        let page = 0;
        let query = rawInput;
        const pageMatch = rawInput.match(/\s+(?:p|page)?\s*(\d+)$/i);
        if (pageMatch) {
            page = parseInt(pageMatch[1], 10) - 1;
            if (page < 0) page = 0;
            query = rawInput.replace(/\s+(?:p|page)?\s*\d+$/i, '').trim();
        }

        const results = await searchXVideos(query, page);

        if (!results || results.length === 0) {
            await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
            return await sock.sendMessage(chatId, { 
                text: "❌ *No results found for your query.*" 
            }, { quoted: message });
        }

        const topResults = results.slice(0, 10);
        
        // Consistent Session Key for both Private DMs and Groups
        const cleanSender = (senderId || chatId).split('@')[0];
        const sessionKey = `${chatId}_${cleanSender}`;

        global.searchSessions.set(sessionKey, {
            query,
            page: page + 1,
            results: topResults
        });

        await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });

        // Loop through results and send an image card for each video with its own caption & number
        for (let index = 0; index < topResults.length; index++) {
            const item = topResults[index];
            const itemCaption = `🔞 *【 XVIDEOS RESULT (${index + 1}/10) 】*\n\n` +
                                `📌 *Title:* ${item.title}\n` +
                                `⏱️ *Duration:* ${item.duration || 'N/A'}\n\n` +
                                `📥 *To download:* Type \`*xvdl ${index + 1}\`\n` +
                                `🤡 *JOKER BOT*`;

            if (item.thumb) {
                await sock.sendMessage(chatId, { 
                    image: { url: item.thumb }, 
                    caption: itemCaption 
                });
            } else {
                await sock.sendMessage(chatId, { text: itemCaption });
            }

            // Brief delay between messages to maintain order and prevent spam rate-limits
            await new Promise(resolve => setTimeout(resolve, 400));
        }

    } catch (err) {
        console.error('❌ XVideos Search Error:', err.message || err);
        await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        await sock.sendMessage(chatId, { 
            text: "❌ *An error occurred while fetching search results.*" 
        }, { quoted: message });
    }
}

// Selection Download Command (*xvdl <1-10>)
async function xvideosDownloadCommand(sock, chatId, message, args, senderId) {
    try {
        const cleanSender = (senderId || chatId).split('@')[0];
        const sessionKey = `${chatId}_${cleanSender}`;
        const session = global.searchSessions.get(sessionKey);

        if (!session || !session.results || session.results.length === 0) {
            return await sock.sendMessage(chatId, { 
                text: "❌ *No active search session found.* Please search first using `*xv <query>`." 
            }, { quoted: message });
        }

        const selection = parseInt(args[0], 10);

        if (isNaN(selection) || selection < 1 || selection > session.results.length) {
            return await sock.sendMessage(chatId, { 
                text: `❌ *Invalid selection.* Please pick a number from 1 to ${session.results.length}.` 
            }, { quoted: message });
        }

        const selectedVideo = session.results[selection - 1];
        await downloadAndSendVideo(sock, chatId, message, selectedVideo.url, selectedVideo.title);

    } catch (err) {
        console.error('❌ XVideos Selection Download Error:', err.message || err);
        await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        await sock.sendMessage(chatId, { 
            text: "❌ *Failed to process selection download.*" 
        }, { quoted: message });
    }
}

// Download Helper
async function downloadAndSendVideo(sock, chatId, message, videoUrl, fallbackTitle = '') {
    await sock.sendMessage(chatId, { react: { text: '📥', key: message.key } });

    const { streamUrl, title } = await fetchStreamUrl(videoUrl);

    if (!streamUrl) {
        await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        return await sock.sendMessage(chatId, { 
            text: "❌ *Failed to extract downloadable video stream.*" 
        }, { quoted: message });
    }

    let captionText = `🔞 *【 XVIDEOS DOWNLOADER 】*\n\n`;
    captionText += `📌 *Title:* ${title || fallbackTitle}\n\n`;
    captionText += `🤡 *JOKER BOT*`;

    await sock.sendMessage(chatId, {
        video: { url: streamUrl },
        caption: captionText,
        mimetype: 'video/mp4'
    }, { quoted: message });

    await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });
}

module.exports = {
    xvideosCommand,
    xvideosDownloadCommand
};

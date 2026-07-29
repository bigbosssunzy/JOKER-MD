/**
 * Facebook Downloader - Auto-Redirect Resolver & Downloader
 */

const axios = require('axios');

// Store processed message IDs to prevent duplicates
const processedMessages = new Set();

// Helper function to expand Facebook short/share links
async function resolveFacebookUrl(shortUrl) {
    try {
        const response = await axios.get(shortUrl, {
            maxRedirects: 5,
            validateStatus: function (status) {
                return status >= 200 && status < 400;
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });
        // Return the final resolved URL after redirects
        return response.request?.res?.responseUrl || shortUrl;
    } catch (error) {
        // Fallback to original URL if expansion fails
        return shortUrl;
    }
}

async function fbCommand(sock, chatId, message, args) {
    try {
        if (processedMessages.has(message.key.id)) {
            return;
        }
        
        processedMessages.add(message.key.id);
        setTimeout(() => {
            processedMessages.delete(message.key.id);
        }, 5 * 60 * 1000);
        
        const q = args ? args.join(' ') : '';
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text ||
                     q;
        
        if (!text || !q) {
            return await sock.sendMessage(chatId, { 
                text: '⚠️ *Please provide a valid Facebook video link!*\n\n*Example:* `#fb https://www.facebook.com/...`' 
            }, { quoted: message });
        }
        
        let rawUrl = args[0] || text.split(' ').slice(1).join(' ').trim();
        rawUrl = rawUrl.replace(/['"]+/g, '').trim();
        
        const facebookPatterns = [
            /https?:\/\/(?:www\.|m\.)?facebook\.com\//,
            /https?:\/\/(?:www\.|m\.)?fb\.com\//,
            /https?:\/\/fb\.watch\//,
            /https?:\/\/(?:www\\.)?facebook\.com\/share\//
        ];
        
        if (!facebookPatterns.some(pattern => pattern.test(rawUrl))) {
            return await sock.sendMessage(chatId, { 
                text: '❌ *That doesn\'t look like a valid Facebook URL.*' 
            }, { quoted: message });
        }
        
        await sock.sendMessage(chatId, {
            react: { text: '⏳', key: message.key }
        });
        
        try {
            // Step 1: Resolve short links like /share/r/ into full URLs
            const resolvedUrl = await resolveFacebookUrl(rawUrl);
            
            // Step 2: Fetch video streams using a public downloader endpoint
            const apiRes = await axios.get(`https://deliriussapi-oficial.vercel.app/download/fbdl?url=${encodeURIComponent(resolvedUrl)}`, {
                timeout: 30000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            
            const resData = apiRes.data;
            
            if (!resData || !resData.status || !resData.data) {
                throw new Error('Could not extract video streams from this link.');
            }
            
            // Pick HD or SD video format
            const videoItem = resData.data.find(v => v.resolution === 'HD') || 
                              resData.data.find(v => v.resolution === 'SD') || 
                              resData.data[0];
                              
            const videoUrl = videoItem?.url;
            
            if (!videoUrl) {
                throw new Error('No direct video stream link found.');
            }
            
            let captionText = `🎬 *Facebook Video Downloaded*\n\n*🤡🃏 𝐈 𝐀𝐌 𝐉𝐎𝐊𝐄𝐑 🃏🤡*`;
            if (videoItem.resolution) {
                captionText += `\n📹 *Quality:* ${videoItem.resolution}`;
            }
            
            await sock.sendMessage(chatId, {
                video: { url: videoUrl },
                mimetype: 'video/mp4',
                caption: captionText
            }, { quoted: message });
            
            await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });
            
        } catch (error) {
            console.error('Error in Facebook download process:', error.message || error);
            await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
            await sock.sendMessage(chatId, { 
                text: `❌ *Failed to download Facebook video.*\n\nMake sure the post is public and not a private group video.` 
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in Facebook command execution:', error);
        await sock.sendMessage(chatId, { react: { text: '❌', key: message.key } });
        await sock.sendMessage(chatId, { 
            text: '❌ *An error occurred while processing your request.*' 
        }, { quoted: message });
    }
}

module.exports = fbCommand;

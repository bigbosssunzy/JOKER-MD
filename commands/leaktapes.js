const axios = require('axios');
const cheerio = require('cheerio');

// Define leak sites, names, short forms, and direct website base URLs
const leakSites = {
    darknaija: { name: "Darknaija", alias: ["dn"], url: "https://darknaija.com" },
    nacknaija: { name: "Nacknaija", alias: ["nn"], url: "https://nacknaija.com" },
    stellaplus: { name: "Stellaplus", alias: ["sp"], url: "https://stellaplus.xyz" },
    naijacum: { name: "Naijacum", alias: ["nc"], url: "https://darknaija.com" },
    naijaceleb: { name: "Naijaceleb", alias: ["ncl"], url: "https://darknaija.com" },
    totoleak: { name: "Totoleak", alias: ["tl"], url: "https://darknaija.com" }
};

// Global session storage for pagination and downloads
global.leakSessions = global.leakSessions || {};

// 1. Main .leaktapes command handler
async function leakTapesMenu(sock, chatId, message) {
    try {
        await sock.sendMessage(chatId, { react: { text: '🔞', key: message.key } });

        let menuText = `*1-leaktapes*\n`;
        for (const [key, site] of Object.entries(leakSites)) {
            menuText += `┃ .${key} (or .${site.alias.join(', .')})\n`;
        }
        menuText += `\n*Usage Guide (Direct Scraping):*\n` +
                    `• View latest: \`.<sitename>\` (e.g., \`.darknaija\`)\n` +
                    `• Next page: \`.<sitename> p2\`\n` +
                    `• Search: \`.<sitename> <query>\` (e.g., \`.darknaija teen\`)\n` +
                    `• Download: \`.<sitename> dl <number>\`, \`.<sitename> d <number>\`, or \`.<sitename> <number>\``;

        await sock.sendMessage(chatId, { text: menuText }, { quoted: message });
    } catch (e) {
        console.error('❌ Leaktapes Menu Error:', e);
        await sock.sendMessage(chatId, { text: `🤡 *Error:* ${e.message}` }, { quoted: message });
    }
}

// Helper: Scrape post listings directly from the target website using Cheerio
async function scrapeSiteList(baseUrl, page = 1, searchQuery = '') {
    try {
        let targetUrl = `${baseUrl}/page/${page}/`;
        if (searchQuery) {
            targetUrl = `${baseUrl}/page/${page}/?s=${encodeURIComponent(searchQuery)}`;
        }

        const { data } = await axios.get(targetUrl, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
            },
            timeout: 12000
        });

        const $ = cheerio.load(data);
        const items = [];

        // Universal WordPress & blog structural selectors
        $('article, .post, .item, .masonry-grid-item, .content-item, .card').each((_, el) => {
            const titleEl = $(el).find('h2 a, h3 a, .title a, .entry-title a').first();
            const title = titleEl.text().trim();
            const postUrl = titleEl.attr('href') || $(el).find('a').attr('href');
            
            const imgEl = $(el).find('img').first();
            const thumbnail = imgEl.attr('data-src') || imgEl.attr('src') || "https://files.catbox.moe/g3x5r2.jpg";

            if (title && postUrl) {
                if (!items.some(i => i.postUrl === postUrl)) {
                    items.push({ title, postUrl, thumbnail });
                }
            }
        });

        return items;
    } catch (e) {
        console.error('Scraping list error:', e.message);
        return [];
    }
}

// Helper: Scrape individual post page to find the direct playable video link or download link
async function scrapeDirectVideoUrl(postUrl) {
    try {
        const { data } = await axios.get(postUrl, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
            },
            timeout: 12000
        });

        const $ = cheerio.load(data);
        let videoUrl = null;

        // 1. Check for standard <video> or <source> tags
        $('video source, video').each((_, el) => {
            const src = $(el).attr('src') || $(el).attr('data-src');
            if (src && src.startsWith('http')) {
                videoUrl = src;
            }
        });

        // 2. Check for direct download anchor tags inside the post content (.mp4, storage, catbox, cdn)
        if (!videoUrl) {
            $('.entry-content a, .post-content a, .download-link a, a').each((_, el) => {
                const href = $(el).attr('href');
                if (href && (href.endsWith('.mp4') || href.includes('storage') || href.includes('catbox') || href.includes('cdn') || href.includes('dl'))) {
                    videoUrl = href;
                }
            });
        }

        // 3. Check for video iframes / embedded players
        if (!videoUrl) {
            $('iframe').each((_, el) => {
                const src = $(el).attr('src') || $(el).attr('data-src');
                if (src && !src.includes('facebook') && !src.includes('twitter') && !src.includes('ads') && !src.includes('analytics')) {
                    videoUrl = src.startsWith('http') ? src : `https:${src}`;
                }
            });
        }

        return videoUrl;
    } catch (e) {
        console.error('Scraping video link error:', e.message);
        return null;
    }
}

// 2. Dynamic site handler for direct scraping, strict 10-item limit per page, and downloading
async function handleLeakSite(sock, chatId, message, siteKey, q) {
    const siteData = leakSites[siteKey];
    if (!siteData) return;

    try {
        await sock.sendMessage(chatId, { react: { text: '⏳', key: message.key } });

        // Handle Download Command ("dl 2", "d 2", or just "2")
        let downloadIndex = null;
        if (q) {
            const trimmedQ = q.trim();
            const dlMatch = trimmedQ.match(/^(?:dl|d)\s+(\d+)$/i);
            const numMatch = trimmedQ.match(/^(\d+)$/);

            if (dlMatch) {
                downloadIndex = parseInt(dlMatch[1]) - 1;
            } else if (numMatch && !trimmedQ.startsWith('p')) {
                downloadIndex = parseInt(numMatch[1]) - 1;
            }
        }

        if (downloadIndex !== null) {
            const session = global.leakSessions[chatId];

            if (!session || session.site !== siteKey) {
                return await sock.sendMessage(chatId, { text: `Please browse or search items first using .${siteKey} before downloading.` }, { quoted: message });
            }

            if (isNaN(downloadIndex) || downloadIndex < 0 || downloadIndex >= session.items.length) {
                return await sock.sendMessage(chatId, { text: `Invalid number! Please choose between 1 and ${session.items.length}.` }, { quoted: message });
            }

            const selectedItem = session.items[downloadIndex];
            
            await sock.sendMessage(chatId, { 
                text: `*📥 Extracting video for: ${selectedItem.title}*` 
            }, { quoted: message });

            // Directly scrape the post page to get the actual video file link
            const directVideoUrl = await scrapeDirectVideoUrl(selectedItem.postUrl);

            if (directVideoUrl) {
                await sock.sendMessage(chatId, { 
                    video: { url: directVideoUrl }, 
                    caption: `*${selectedItem.title}*\n\n*JOKER-MD Direct Scraper*` 
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, { text: `❌ Could not extract direct video source from this post link.` }, { quoted: message });
            }
            return;
        }

        let page = 1;
        let searchQuery = '';

        // Handle Pagination or Keyword Search arguments
        if (q) {
            const trimmedQ = q.trim();
            if (trimmedQ.toLowerCase().startsWith("p") && !isNaN(trimmedQ.slice(1))) {
                page = parseInt(trimmedQ.slice(1));
            } else {
                searchQuery = trimmedQ;
            }
        }

        // Scrape items from the website
        const rawResults = await scrapeSiteList(siteData.url, page, searchQuery);

        if (!rawResults || rawResults.length === 0) {
            return await sock.sendMessage(chatId, { text: `No results found on ${siteData.name} for page ${page}.` }, { quoted: message });
        }

        // Strict Enforcement: Cap the displayed batch to exactly 10 items per page
        const paginatedItems = rawResults.slice(0, 10);

        // Store session for this chat using the exact items displayed
        global.leakSessions[chatId] = {
            site: siteKey,
            items: paginatedItems
        };

        await sock.sendMessage(chatId, { text: `*📂 ${siteData.name} Direct Scrapes (Page ${page})*\nFound ${paginatedItems.length} items. Sending batch...` }, { quoted: message });

        // Send each item with thumbnail and caption (Max 10 items)
        for (let i = 0; i < paginatedItems.length; i++) {
            const itemNumber = i + 1;
            const item = paginatedItems[i];
            
            let caption = `*${itemNumber}* • ${item.title}`;

            // Attach command guide to the very last image of the batch
            if (i === paginatedItems.length - 1) {
                caption += `\n\n*💡 Command Guide for ${siteData.name}:*\n` +
                           `• Next Page: \`.${siteKey} p${page + 1}\`\n` +
                           `• Search: \`.${siteKey} <keyword>\`\n` +
                           `• Download: \`.${siteKey} dl <number>\`, \`.${siteKey} d <number>\`, or \`.${siteKey} <number>\``;
            }

            await sock.sendMessage(chatId, {
                image: { url: item.thumbnail },
                caption: caption
            }, { quoted: message });
        }

    } catch (e) {
        console.error(`❌ Direct Scraper Error (${siteKey}):`, e);
        await sock.sendMessage(chatId, { text: `Failed to scrape site: ${e.message}` }, { quoted: message });
    }
}

module.exports = {
    leakTapesMenu,
    handleLeakSite
};
